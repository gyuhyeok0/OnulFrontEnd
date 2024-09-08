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
                    phoneNumber: formattedValue, // JSON 형식으로 서버에 전화번호 전송
                }),
            });
    
            // 서버 응답을 JSON으로 처리
            const data = await response.json();
    
            // 서버 응답의 state를 확인하여 메시지 출력
            if (data.state === 'success') {
                Alert.alert("성공", "인증번호를 입력해주세요.");  // 성공 메시지
            } else if (data.state === 'alreadyPhoneNumber') {
                Alert.alert("오류", "전화번호는 계정당 한번만 사용 가능합니다.");  // 오류 메시지
            } else if (data.state === 'error') {
                Alert.alert("오류", data.message || "인증번호 전송 중 문제가 발생했습니다.");  // 일반 오류 메시지
            }
        } catch (error) {
            Alert.alert("오류", "서버에 연결할 수 없습니다.");
            console.error('Error:', error);
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

    

    // 회원가입
    const handleComplete = async () => {
        // 인증 완료 여부 확인
        if (!isVerified) {
            Alert.alert('인증 필요', '휴대폰 번호 인증을 완료해주세요.');
            return; // 인증이 완료되지 않으면 함수 종료
        }
    
        // 약관 동의 여부 확인
        if (!isAllAgreed) {
            Alert.alert('동의 필요', '약관 동의를 완료해주세요.');
            return; // 약관 동의가 완료되지 않으면 함수 종료
        }
    
        try {
            // 서버로 회원가입 요청 전송
            const response = await fetch('http://localhost:8080/signup/signup', {
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
    
            // 서버 응답 처리
            if (!response.ok) {
                // 서버 응답이 성공하지 않았을 때 (상태 코드 200이 아님)
                const data = await response.json();
                Alert.alert('오류', data.message || '회원가입 중 문제가 발생했습니다.');
                return; // 실패 시 함수 종료, 다음 화면으로 넘어가지 않음
            }

            // 서버 응답이 성공한 경우
            const data = await response.json();

            // 서버에서 success 값이 true일 때만 성공 처리
            if (data.success === true) {
                Alert.alert('가입 완료', '회원가입이 완료되었습니다.');
                navigation.navigate('Exercise'); // 회원가입 성공 시에만 다음 화면으로 이동
            } else {
                // success가 true가 아닐 때는 오류 처리
                Alert.alert('오류', data.message || '회원가입 중 문제가 발생했습니다.');
            }
    
        } catch (error) {
            // 네트워크 오류 또는 서버에 연결할 수 없을 때
            Alert.alert('오류', '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
            console.error('Error:', error);
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
