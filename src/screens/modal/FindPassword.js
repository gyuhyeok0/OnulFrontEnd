import React, { useState, useEffect, useRef } from 'react';
import { Modal, TouchableOpacity, StyleSheet, Dimensions, View, TextInput, Text, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PhoneInput from 'react-native-phone-number-input';
import * as Localize from 'react-native-localize'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './FindPassword.module';
import { fetchUserPhoneNumber } from '../../hooks/HandlePhone';
import { Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';

import * as RNLocalize from 'react-native-localize';

import { API_URL_JP, API_URL_US } from '@env';

const screenHeight = Dimensions.get('window').height;

const FindPassword = ({ isVisible, onClose }) => {
    const locales = RNLocalize.getLocales();
    const userLocale = locales.length > 0 ? locales[0].languageTag : "en-US"; // 예: "ja-JP", "ko-KR", "en-US"

    const userRegion = userLocale.includes("JP") || userLocale.includes("KR") ? "JP" : "US";
    const API_URL = userRegion === "JP" ? API_URL_JP : API_URL_US;

    const [modalY] = useState(new Animated.Value(screenHeight));
    const [overlayOpacity] = useState(new Animated.Value(0));
    const [userId, setUserId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [formattedValue, setFormattedValue] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [defaultCountryCode, setDefaultCountryCode] = useState('KR');
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef(null);
    const phoneInput = useRef(null);
    const [timeLeft, setTimeLeft] = useState(300);
    const [showInputFields, setShowInputFields] = useState(false);
    const [isInputDisabled, setIsInputDisabled] = useState(false); // 아이디 입력 비활성화 상태
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isComplete, setIsComplete] = useState(false); // 본인 확인 완료 상태 추가

    const [isMemberPasswordValid, setIsMemberPasswordValid] = useState(null); 
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(null); 
    const [isExpired, setIsExpired] = useState(false); // 타이머 만료 상태 추가
    const { t } = useTranslation();


    const resetState = () => {
        setUserId('');
        setPhoneNumber('');
        setFormattedValue('');
        setVerificationCode('');
        setIsVerified(false);
        setIsTimerRunning(false);
        setTimeLeft(300);
        setShowInputFields(false);
        setIsInputDisabled(false); // 상태 초기화
        setNewPassword('');
        setConfirmPassword('');
        setIsComplete(false); // 상태 초기화 시 본인 확인 완료 상태도 리셋
    };

    useEffect(() => {
        if (isVisible) {
            modalY.setValue(screenHeight);
            Animated.parallel([
                Animated.timing(modalY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            resetState();
        }
    }, [isVisible]);

    const handleClose = () => {
        resetState();
        Animated.parallel([
            Animated.timing(modalY, {
                toValue: screenHeight,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => onClose());
    };

    useEffect(() => {
        const locales = Localize.getLocales();
        if (locales.length > 0) {
            const countryCode = locales[0].countryCode;
            setDefaultCountryCode(countryCode); 
        }
    }, []);

    useEffect(() => {
        if (timeLeft > 0 && !isVerified && isTimerRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timerRef.current);
            setIsExpired(true); // 타이머 만료 시 상태 설정
            Alert.alert(t('findPassword.timeOver'), t('findPassword.timeOverMessage'));
        }
        return () => clearInterval(timerRef.current);
    }, [timeLeft, isVerified, isTimerRunning]);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    
    useEffect(() => {
        if (verificationCode.length === 6 && !isComplete) { // 본인 확인 완료 후 실행되지 않도록
            handleVerification(formattedValue, verificationCode, setIsVerified, () => clearInterval(timerRef.current));
        }
    }, [verificationCode, isComplete]);


    const handleVerificationCodeChange = (text) => {
        const filteredText = text.replace(/[^0-9]/g, ''); // 숫자만 허용
        if (isExpired) {
            Alert.alert(t('findPassword.timeOver'), t('findPassword.timeOverMessage'));
            return; // 만료되었을 경우 입력을 막음
        }
        setVerificationCode(filteredText);
    };
    

    const timerColor = isTimerRunning ? (timeLeft <= 60 ? 'red' : 'white') : '#6D6E6F';

    const handleComplete = async () => {
        try {
            const response = await fetchUserPhoneNumber(userId);
            
            if (response.exists) {
                setShowInputFields(true);
                setIsInputDisabled(true); // 아이디가 존재하면 비활성화
            } else {
                Alert.alert(t('findPassword.idError'), t('findPassword.idNotFound'));
            }
        } catch (error) {
            console.error("Error fetching phone number:", error);
            Alert.alert(t('findPassword.verificationError'), t('findPassword.serverConnectionError'));
        }
    };
    
    const handleNext = async (formattedValue, userId, setTimeLeft, setIsTimerRunning) => {
        const isValid = phoneInput.current?.isValidNumber(formattedValue);

        if (!isValid) {
            Alert.alert(t('findPassword.invalidPhoneNumber'), t('findPassword.invalidPhoneNumberMessage'));
            return;
        }
    
        try {
            const response = await fetch(`${API_URL}/sms/verificationAndSend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: formattedValue,
                    memberId: userId,
                }),
            });
    
            const data = await response.json();
    
            switch (data.status) {
                case 'SUCCESS':
                    Alert.alert(t('findPassword.verificationSuccess'), t('findPassword.verificationSuccessMessage'));
                    setTimeLeft(300);
                    setIsTimerRunning(true);
                    setIsExpired(false); // 타이머 초기화 시 만료 상태 초기화
                    break;
                case 'INVALID_USER_ID':
                    Alert.alert(t('findPassword.verificationError'), t('findPassword.invalidUserId'));
                    break;
                case 'PHONE_NOT_REGISTERED':
                    Alert.alert(t('findPassword.verificationError'), t('findPassword.phoneNotRegistered'));
                    break;
                case 'LIMIT_EXCEEDED':
                    Alert.alert(t('findPassword.verificationError'), t('findPassword.limitExceeded'));
                    break;
                case 'DAILY_LIMIT_EXCEEDED':
                    Alert.alert(t('findPassword.verificationError'), t('findPassword.dailyLimitExceeded'));
                    break;
                default:
                    Alert.alert(t('findPassword.verificationError'), t('findPassword.verificationSendError'));
                    break;
            }
            
            } catch (error) {
                Alert.alert(t('findPassword.verificationError'), t('findPassword.serverConnectionError'));
            }
    };


    // 인증번호 검증
    const handleVerification = async () => {
        try {
            const response = await fetch(`${API_URL}/sms/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: formattedValue,
                    code: verificationCode,
                }),
            });

            const data = await response.text();

            if (response.ok) {
                if (data === "Verification successful") {
                    Alert.alert(t('findPassword.verificationSuccess'), t('findPassword.verificationSuccessMessage'));
                    setIsVerified(true); 
                    clearInterval(timerRef.current);
                    setIsComplete(true);
                } else if (data === "Invalid or expired code") {
                    Alert.alert(t('findPassword.verificationError'), t('findPassword.verificationErrorMessage'));
                    setVerificationCode(''); 
                } else {
                    Alert.alert(t('findPassword.verificationError'), data);
                }
            } else {
                Alert.alert(t('findPassword.verificationError'), data || t('findPassword.verificationCheckError'));
            }
        } catch (error) {
            Alert.alert(t('findPassword.verificationError'), t('findPassword.serverConnectionError'));
        }
    };

    const handlePasswordResetComplete = async () => {
        if (newPassword === confirmPassword) {
            try {
                const response = await fetch(`${API_URL}/signup/reset`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        memberId: userId,  // 회원 ID
                        memberPassword: newPassword,  // 새 비밀번호
                    }),
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    // 서버에서 반환된 상태에 따른 처리
                    switch (data.state) {
                        case 'SUCCESS':
                            Alert.alert(t('findPassword.verificationSuccess'), t('findPassword.passwordResetSuccess'));
                            // handleClose();  // 모달 닫기
                            break;
                        case 'INVALID_REQUEST':
                            Alert.alert(t('findPassword.verificationError'), t('findPassword.invalidRequest'));
                            break;
                        case 'INVALID_PASSWORD':
                            Alert.alert(t('findPassword.verificationError'), t('findPassword.passwordInvalid'));
                            break;
                        case 'ERROR':
                        default:
                            Alert.alert(t('findPassword.verificationError'), t('findPassword.passwordResetError'));
                            break;
                    }
                } else {
                    Alert.alert(t('findPassword.verificationError'), t('findPassword.passwordResetError'));
                }
            } catch (error) {
                Alert.alert(t('findPassword.verificationError'), t('findPassword.serverConnectionError'));
                console.error('Error:', error);
            }
        } else {
            Alert.alert(t('findPassword.verificationError'), t('findPassword.passwordMismatch'));
        }
    };
    
    
    
    const validateMemberPassword = (text) => {
        setNewPassword(text);
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,20}$/; 
        setIsMemberPasswordValid(passwordRegex.test(text));
    };

    const validateConfirmPassword = (text) => {
        setConfirmPassword(text);
        setIsConfirmPasswordValid(text === newPassword);
    };
    
    return (
        <Modal transparent={true} visible={isVisible}>
            <Animated.View style={[modalstyles.modalOverlay, { opacity: overlayOpacity }]}>
                <Animated.View style={[modalstyles.modalContent, { transform: [{ translateY: modalY }] }]}>
                    <View style={modalstyles.titleContainer}>
                        <TouchableOpacity onPress={handleClose} style={modalstyles.backIcon}>
                            <Ionicons name="chevron-back" size={32} style={modalstyles.icon} />
                        </TouchableOpacity>
                        <Text style={modalstyles.title}>{t('findPassword.title')}</Text>
                    </View>

                    <KeyboardAwareScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        extraScrollHeight={20} // 키보드 위 여백
                        enableOnAndroid={true} // Android에서도 작동하도록 설정
                    >

                        <View style={styles.container}>
                            {/* 아이디 입력과 본인 확인 영역 숨기기 */}
                            {!isComplete && (
                                <>
                                    <Text style={{color: '#EBEBEB', fontSize:16, fontWeight: 'bold', marginBottom: 10}}>{t('findPassword.enterId')}</Text>

                                    <TextInput
                                        style={[styles.idInput, isVerified && { color: '#6D6E6F' }, isInputDisabled && { backgroundColor: '#242732', color: '#AAAAAA' }]}
                                        placeholder={t('findPassword.idPlaceholder')}
                                        placeholderTextColor="#CCCCCC"
                                        keyboardType="default"
                                        onChangeText={text => {
                                            const filteredText = text.replace(/[^a-zA-Z0-9]/g, ''); // 영문자와 숫자만 허용
                                            setUserId(filteredText);
                                        }}
                                        value={userId} // 입력값 설정
                                        editable={!isInputDisabled} 
                                    />
                                    <TouchableOpacity style={[styles.completeButton, isInputDisabled && { backgroundColor: '#242732' }]} onPress={handleComplete} disabled={isInputDisabled}>
                                        <Text style={styles.completeButtonText}>{t('findPassword.complete')}</Text>
                                    </TouchableOpacity>

                                    {showInputFields && (
                                        <>
                                            <Text style={{color: '#EBEBEB', fontSize:16, fontWeight: 'bold', marginTop: 20}}>{t('findPassword.verification')}</Text>
                                            <PhoneInput
                                                key={defaultCountryCode}
                                                ref={phoneInput}
                                                defaultValue={phoneNumber}
                                                defaultCode={defaultCountryCode}
                                                layout="first"
                                                onChangeText={(text) => setPhoneNumber(text)}
                                                onChangeFormattedText={(text) => setFormattedValue(text)}
                                                containerStyle={{
                                                    marginTop: 10,
                                                    width: '100%',
                                                    minHeight: 55,
                                                    backgroundColor: '#3B404B',
                                                    borderRadius: 8,
                                                }}
                                                textInputStyle={{ 
                                                    color: 'white',  
                                                    fontSize: 16,    
                                                }}
                                                textContainerStyle={{ 
                                                    backgroundColor: '#3B404B', 
                                                    borderRadius: 8,
                                                    paddingVertical: 10, 
                                                }}
                                                codeTextStyle={{ color: 'white' }} 
                                                countryPickerButtonStyle={{ backgroundColor: '#5E56C3', borderRadius: 12 }}
                                                textInputProps={{
                                                    placeholderTextColor: '#CCCCCC', 
                                                    cursorColor: 'white',
                                                    keyboardType: 'numeric' // 숫자 키보드로 제한
                                                }}
                                                withDarkTheme={true}
                                                withShadow={false}
                                                autoFocus
                                            />

                                            <View style={styles.requestBox}>
                                                <TouchableOpacity 
                                                    style={styles.requestButton} 
                                                    onPress={() => handleNext(formattedValue, userId, setTimeLeft, setIsTimerRunning)} 
                                                    disabled={isVerified}
                                                >
                                                    <Text style={styles.requestButtonText}>{t('findPassword.requestVerification')}</Text>
                                                </TouchableOpacity>

                                                <TextInput
                                                    style={[
                                                        styles.verificationInput,
                                                        isVerified && { color: '#6D6E6F' }
                                                    ]}
                                                    placeholder={t('findPassword.enterVerification')}
                                                    placeholderTextColor="#CCCCCC"
                                                    keyboardType="numeric"
                                                    maxLength={6}
                                                    onChangeText={(text) => {
                                                        const filteredText = text.replace(/[^0-9]/g, ''); // 숫자만 허용
                                                        if (isExpired) {

                                                            Alert.alert(t('findPassword.verificationError'), t('findPassword.timeOverMessage'));

                                                            return; // 만료되었을 경우 입력을 막음
                                                        }
                                                        handleVerificationCodeChange(filteredText);
                                                    }}
                                                    value={verificationCode}
                                                    editable={!isVerified}
                                                />

                                                <View style={{ position: 'absolute', top: 18, right: 15 }}>
                                                    <View style={{ flexDirection: 'row', alignItems:'center' }}>
                                                        <Icon name="clock-o" size={14} color={timerColor} style={{ marginRight: 3 }} />
                                                        <Text style={[styles.timerText, { color: timerColor }]}>
                                                            {formatTime(timeLeft)} 
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </>
                                    )}
                                </>
                            )}
                            <Text style={styles.note}>{t('findPassword.messageNote')}</Text>

                            {/* 비밀번호 재설정 영역 */}
                            {isComplete && (
                                <View>
                                    <Text style={{color: '#EBEBEB', fontSize:16, fontWeight: 'bold', marginTop: 20}}>{t('findPassword.passwordReset')}</Text>

                                    <View>
                                        {/* 새 비밀번호 입력 */}
                                        <TextInput
                                            style={[styles.passwordInput, { backgroundColor: '#3B404B', color: 'white' }]}
                                            placeholder={t('findPassword.enterNewPassword')}
                                            placeholderTextColor="#CCCCCC"
                                            secureTextEntry={true}
                                            onChangeText={validateMemberPassword} // validateMemberPassword로 변경
                                        />
                                        {isMemberPasswordValid === false && <Text style={styles.errorText}>{t('findPassword.passwordInvalid')}</Text>}

                                        
                                        {/* 비밀번호 확인 입력 */}
                                        <TextInput
                                            style={[styles.passwordInput, { backgroundColor: '#3B404B', color: 'white', marginTop: 10 }]}
                                            placeholder={t('findPassword.enterConfirmPassword')}
                                            placeholderTextColor="#CCCCCC"
                                            secureTextEntry={true}
                                            onChangeText={validateConfirmPassword} // 여기서 validateConfirmPassword로 변경
                                        />
                                        {isConfirmPasswordValid === false && <Text style={styles.errorText}>{t('findPassword.passwordMismatch')}
                                        </Text>}

                                        {/* 완료 버튼 */}
                                        <TouchableOpacity 
                                            style={[styles.completeButton, { marginTop: 20 }]} 
                                            onPress={handlePasswordResetComplete}
                                        >
                                        <Text style={styles.completeButtonText}>{t('findPassword.complete')}</Text>







                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}

                            
                        </View>


                    </KeyboardAwareScrollView>

                </Animated.View>
            </Animated.View>
        </Modal>
    );
};


const modalstyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '100%',
        height: screenHeight * 0.94,
        backgroundColor: '#191D22',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    titleContainer: {
        flexDirection: 'row',
        height: 35,
        alignItems: 'center'
    },
    icon: {
        color: 'gray',
    },

    title:{
        color: 'white',
        fontSize: 20
    },

    note: {
        marginTop: 5,
        fontSize: 12,
        color: '#999999',
    },
});

export default FindPassword;
