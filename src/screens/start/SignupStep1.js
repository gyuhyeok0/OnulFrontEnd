import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import DefaultHeader from '../common/DefaultHeader'; 
import PhoneInput from 'react-native-phone-number-input';
import * as Localize from 'react-native-localize'; 
import styles from './Signupstep1.module';
import Agree from '../../../components/signup/Agree';
import Icon from 'react-native-vector-icons/FontAwesome';
import { callLoginAPI } from '../../apis/MemberAPICalls';
import { useDispatch } from 'react-redux';
import { API_URL } from '@env';
import { useTranslation } from 'react-i18next';



function SignupStep1({ navigation, route }) {
    const dispatch = useDispatch();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [formattedValue, setFormattedValue] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false); 
    const [defaultCountryCode, setDefaultCountryCode] = useState('KR'); 
    const [isAllAgreed, setIsAllAgreed] = useState(false);  
    const [isTimerRunning, setIsTimerRunning] = useState(false); 
    const timerRef = useRef(null); 
    const phoneInput = React.createRef();
    const [timeLeft, setTimeLeft] = useState(300); 

    const { memberId, memberPassword } = route.params || {};

    const { t } = useTranslation();

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
            Alert.alert(t('signupStep1.timeOver'), t('signupStep1.timeOverMessage'));
        }
        return () => clearInterval(timerRef.current);
    }, [timeLeft, isVerified, isTimerRunning]);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleNext = async () => {
        const isValid = phoneInput.current?.isValidNumber(formattedValue);

        if (!isValid) {
            Alert.alert(t('signupStep1.invalidPhoneNumber'), t('signupStep1.invalidPhoneMessage'));
            return;
        }

        try {
            const response = await fetch(`${API_URL}/sms/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: formattedValue,
                }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                Alert.alert(t('signupStep1.success'), t('signupStep1.successMessage'));
                setTimeLeft(300);
                setIsTimerRunning(true);
            } else {
                Alert.alert(t('signupStep1.error'), t(`signupStep1.${data.status}`) || t('signupStep1.error'));
            }
        } catch (error) {
            Alert.alert(t('signupStep1.error'), "server error.");
            console.error('Error:', error);
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
                    Alert.alert(t("signupStep1.success"), t("signupStep1.verificationSuccess"));
                    setIsVerified(true);
                    clearInterval(timerRef.current);
                } else if (data === "Invalid or expired code") {
                    Alert.alert(t("signupStep1.error"), t("signupStep1.verificationFail"));
                    setVerificationCode('');
                } else {
                    Alert.alert(t("signupStep1.error"), data);
                }
            } else {
                Alert.alert(t("signupStep1.error"), data || t("signupStep1.signupError"));
            }
        } catch (error) {
            Alert.alert(t("signupStep1.error"), "server error.");
        }
    };

    useEffect(() => {
        if (verificationCode.length === 6) {
            handleVerification();
        }
    }, [verificationCode]);

    const handleVerificationCodeChange = (text) => {
        setVerificationCode(text);
    };

    // 회원가입
    const handleComplete = async () => {
        if (!isVerified) {
            Alert.alert(t('signupStep1.verificationRequired'), t('signupStep1.verificationRequiredMessage'));
            return;
        }

        if (!isAllAgreed) {
            Alert.alert(t('signupStep1.agreeRequired'), t('signupStep1.agreeRequiredMessage'));
            return;
        }

        try {
            const response = await fetch(`${API_URL}/signup/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    memberId: memberId,             
                    memberPassword: memberPassword, 
                    memberCountryCode: defaultCountryCode, 
                    agreed: isAllAgreed,            
                    memberPhoneNumber: formattedValue 
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                Alert.alert(t("signupStep1.error"), data.message || t("signupStep1.signupError"));
                return;
            }

            const data = await response.json();

            if (data.success === true) {
                // Alert.alert('가입 완료', '회원가입이 완료되었습니다.');

                const form = {
                    memberId: memberId,
                    memberPassword: memberPassword
                };

                const result = await dispatch(callLoginAPI({ form })); // API 호출 및 결과 저장

                if (result && result.status === 200) {
                    // 로그인 성공 시 Onboarding 페이지로 이동
                    navigation.navigate('Onboarding');
                } else if (result && result.errorMessage) {
                    Alert.alert(t("signupStep1.loginError"), result.errorMessage || t("signupStep1.loginFailed"));
                    console.error(result.errorMessage);
                } else {
                    Alert.alert(t("signupStep1.loginError"), t("signupStep1.loginFailed"));
                    console.error(t("signupStep1.loginFailed"));
                }
                
            } else {
                Alert.alert(t("signupStep1.error"), data.message || t("signupStep1.signupError"));
            }
                

        } catch (error) {
            Alert.alert(t("signupStep1.error"), t("signupStep1.connectionError"));
            console.error('Error:', error);
        }
        
    };

    const timerColor = isTimerRunning ? (timeLeft <= 60 ? 'red' : 'white') : '#6D6E6F';

    return (
        <>
            <DefaultHeader title={t('signupStep1.title')} navigation={navigation} />

            <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
                <Text style={styles.phoneNumberTitle}>{t('signupStep1.phoneNumber')}</Text>
                <Text style={styles.description}>
                    {t("signupStep1.description")}
                </Text>
                <Text style={styles.note}>
                    {t("signupStep1.note")}
                </Text>


                <PhoneInput
                    key={defaultCountryCode}  
                    ref={phoneInput}
                    defaultValue={phoneNumber}
                    defaultCode={defaultCountryCode} 
                    layout="first"
                    onChangeText={(text) => setPhoneNumber(text)}
                    onChangeFormattedText={(text) => setFormattedValue(text)}
                    containerStyle={{
                        marginTop: 33,
                        width: '100%', 
                        height: 60,     
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
                    countryPickerButtonStyle={{ backgroundColor: '#3D69A5', borderRadius: 12 }}
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
                    <TouchableOpacity style={styles.requestButton} onPress={handleNext} disabled={isVerified}>
                        <Text style={styles.requestButtonText}>{t("signupStep1.requestCode")}</Text>
                    </TouchableOpacity>

                    <TextInput
                        style={[
                            styles.verificationInput,
                            isVerified && { color: '#6D6E6F' }
                        ]}
                        placeholder={t("signupStep1.enterCode")}
                        placeholderTextColor="#CCCCCC"
                        keyboardType="numeric"
                        maxLength={6}
                        onChangeText={(text) => {
                            const filteredText = text.replace(/[^0-9]/g, ''); // 숫자만 허용
                            handleVerificationCodeChange(filteredText);
                        }}
                        value={verificationCode}
                        editable={!isVerified}
                    />

                    <View style={{position: 'absolute', top: 22, right: 15}}>
                        <View style={{flexDirection: 'row', alignItems:'center'}}>
                            <Icon 
                                name="clock-o" 
                                size={14} 
                                color= {timerColor} 
                                style={{ marginRight: 3 }} 
                            />

                            <Text style={[timerStyles.timerText, { color: timerColor }]}>
                                {formatTime(timeLeft)} 
                            </Text>
                        </View>
                    </View>

                </View>
                <Text style={styles.note}>{t("signupStep1.messageReceiveNote")}</Text>

                <Agree setIsAllAgreed={setIsAllAgreed} /> 

                <TouchableOpacity
                    style={[styles.completeButton, (!isVerified || !isAllAgreed) && { backgroundColor: '#6D6E6F' }]} 
                    onPress={handleComplete}
                    disabled={!isVerified || !isAllAgreed} 
                >
                    <Text
                        style={[
                            styles.completeButtonText,
                            (!isVerified || !isAllAgreed)
                                ? { color: '#303030' } 
                                : { color: '#FFFFFF' } 
                        ]}
                    >
                        {t("signupStep1.complete")}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    );
}

const timerStyles = {
    timerText: {
        position: 'relative',
        fontSize: 16,
    },
}

export default SignupStep1;
