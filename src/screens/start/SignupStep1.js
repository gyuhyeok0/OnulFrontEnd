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
            Alert.alert("시간 초과", "인증 시간이 초과되었습니다. 다시 요청해 주세요.");
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
            Alert.alert("유효하지 않은 전화번호", "올바른 전화번호를 입력해 주세요.");
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
                Alert.alert("성공", "인증번호를 입력해주세요.");
                setTimeLeft(300);
                setIsTimerRunning(true);
            } else if (data.status === 'alreadyPhoneNumber') {
                Alert.alert("오류", "전화번호는 계정당 한번만 사용 가능합니다.");
            } else if (data.status === 'LIMIT_EXCEEDED') {
                Alert.alert("오류", "요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
            } else if (data.status === 'DAILY_LIMIT_EXCEEDED') {
                Alert.alert("오류", "일일 요청 횟수를 초과했습니다. 내일 다시 시도해 주세요.");
            } else {
                Alert.alert("오류", data.message || "인증번호 전송 중 문제가 발생했습니다.");
            }
        } catch (error) {
            Alert.alert("오류", "서버에 연결할 수 없습니다.");
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
                    Alert.alert("성공", "인증이 완료되었습니다.");
                    setIsVerified(true); 
                    clearInterval(timerRef.current);
                } else if (data === "Invalid or expired code") {
                    Alert.alert("오류", "잘못 입력하셨습니다.");
                    setVerificationCode(''); 
                } else {
                    Alert.alert("오류", data);
                }
            } else {
                Alert.alert("오류", data || "인증번호 검증 중 문제가 발생했습니다.");
            }
        } catch (error) {
            Alert.alert("오류", "서버에 연결할 수 없습니다.");
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
            Alert.alert('인증 필요', '휴대폰 번호 인증을 완료해주세요.');
            return;
        }

        if (!isAllAgreed) {
            Alert.alert('동의 필요', '약관 동의를 완료해주세요.');
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
                Alert.alert('오류', data.message || '회원가입 중 문제가 발생했습니다.');
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
                    Alert.alert('로그인 오류', result.errorMessage || '로그인 중 문제가 발생했습니다.');
                    console.error(result.errorMessage);
                } else {
                    Alert.alert('로그인 실패', '로그인에 실패했습니다.');
                    console.error("로그인에 실패했습니다.");
                }
                
            } else {
                Alert.alert('오류', data.message || '회원가입 중 문제가 발생했습니다.');
            }

        } catch (error) {
            Alert.alert('오류', '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
            console.error('Error:', error);
        }
    };

    const timerColor = isTimerRunning ? (timeLeft <= 60 ? 'red' : 'white') : '#6D6E6F';

    return (
        <>
            <DefaultHeader title="본인인증" navigation={navigation} />

            <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
                <Text style={styles.phoneNumberTitle}>핸드폰 번호</Text>
                <Text style={styles.description}>
                    원활한 onul 서비스 이용을 위해 최초 1회 인증이 필요합니다.
                </Text>
                <Text style={styles.note}>
                    하나의 전화번호에는 최대 한 개의 계정만 연결할 수 있습니다.
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
                        <Text style={styles.requestButtonText}>인증번호 요청</Text>
                    </TouchableOpacity>

                    <TextInput
                        style={[
                            styles.verificationInput,
                            isVerified && { color: '#6D6E6F' }
                        ]}
                        placeholder="인증번호 입력"
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
                        완료
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
