import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import DefaultHeader from '../common/DefaultHeader'; 
import PhoneInput from 'react-native-phone-number-input';
import * as Localize from 'react-native-localize'; 
import styles from './Signupstep1.module';
import Agree from './Agree';

function SignupStep1({ navigation, route }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [formattedValue, setFormattedValue] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerified, setIsVerified] = useState(false); 
    const [defaultCountryCode, setDefaultCountryCode] = useState('KR'); 
    const [isAllAgreed, setIsAllAgreed] = useState(false);  // 상태 추가
    const phoneInput = React.createRef();

    // 전 페이지에서 넘어온 props 확인 (아이디와 비밀번호)
    const { memberId, memberPassword } = route.params || {};

    // 국가 코드 설정
    useEffect(() => {
        const locales = Localize.getLocales();
        if (locales.length > 0) {
            const countryCode = locales[0].countryCode;
            setDefaultCountryCode(countryCode); 
        }
    }, []);

    // 컴포넌트가 마운트될 때, props가 없으면 이전 페이지로 리다이렉트
    useEffect(() => {
        if (!memberId || !memberPassword) {
            Alert.alert("오류", "아이디와 비밀번호가 필요합니다.", [
                {
                    text: "확인",
                    onPress: () => navigation.goBack(), // 전 페이지로 돌아감
                },
            ]);
        }
    }, [memberId, memberPassword]);

    const handleNext = async () => {
        const isValid = phoneInput.current?.isValidNumber(formattedValue);

        if (!isValid) {
            Alert.alert("유효하지 않은 전화번호", "올바른 전화번호를 입력해 주세요.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/sms/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: formattedValue,
                }),
            });

            const data = await response.text();

            if (response.ok) {
                Alert.alert("성공", "인증번호를 입력해주세요.");
            } else {
                Alert.alert("오류", data || "인증번호 전송 중 문제가 발생했습니다.");
            }
        } catch (error) {
            Alert.alert("오류", "서버에 연결할 수 없습니다.");
        }
    };

    // 인증번호 검증
    const handleVerification = async () => {
        try {
            const response = await fetch('http://localhost:8080/sms/verify', {
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

    // 회원가입 완료 처리 (아이디, 비밀번호, 국가코드, 동의 상태를 서버로 전송)
    const handleComplete = async () => {
        if (isVerified && isAllAgreed) {
            try {
                // 서버로 회원가입 요청
                const response = await fetch('http://localhost:8080/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        memberId: memberId,           // 아이디
                        memberPassword: memberPassword, // 비밀번호
                        countryCode: defaultCountryCode, // 국가 코드
                        agreed: isAllAgreed           // 동의 상태
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    Alert.alert('가입 완료', '회원가입이 완료되었습니다.');
                    navigation.navigate('Exercise'); // 예시로 다음 화면으로 이동
                } else {
                    Alert.alert('오류', data.message || '회원가입 중 문제가 발생했습니다.');
                }
            } catch (error) {
                Alert.alert('오류', '서버에 연결할 수 없습니다.');
                console.error('Error:', error);
            }
        } else {
            Alert.alert('인증 필요', '휴대폰 번호 인증 및 약관 동의를 완료해주세요.');
        }
    };

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
                        onChangeText={handleVerificationCodeChange}
                        value={verificationCode}
                        editable={!isVerified} 
                    />
                </View>

                {/* setIsAllAgreed를 전달 */}
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
                                    ? { color: '#303030' }  // 조건을 만족하지 않을 때의 폰트 색상
                                    : { color: '#FFFFFF' }  // 조건을 만족할 때의 폰트 색상
                            ]}
                        >
                            완료
                        </Text>

                </TouchableOpacity>
            </ScrollView>
        </>
    );
}

export default SignupStep1;
