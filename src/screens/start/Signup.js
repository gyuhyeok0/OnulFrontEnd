import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import DefaultHeader from '../common/DefaultHeader'; // 커스텀 헤더 컴포트 임포트

function Signup({ navigation }) {
    const [memberId, setMemberId] = useState('');
    const [memberPassword, setMemberPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isMemberIdValid, setIsMemberIdValid] = useState(null); 
    const [isMemberPasswordValid, setIsMemberPasswordValid] = useState(null); 
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(null); 

    useEffect(() => {
        console.log("===================== 가입 페이지 ========================");
    }, []);

    const handleNextStep = () => {
        // 유효성 검증
        if (!isMemberIdValid) {
            alert('유효한 아이디를 입력해주세요.');
            return;
        }
        if (!isMemberPasswordValid) {
            alert('유효한 비밀번호를 입력해주세요.');
            return;
        }
        if (!isConfirmPasswordValid) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        
        // 유효성 검사가 완료되면 아이디와 비밀번호를 다음 페이지로 전달
        navigation.navigate('SignupStep1', { memberId, memberPassword });
    };

    const validateMemberId = (text) => {
        setMemberId(text);
        const memberIdRegex = /^(?=[a-zA-Z0-9]{6,})(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9]*$/; // 영문자와 숫자 모두 포함, 첫 자리는 숫자 또는 영문자 가능, 6자리 이상
        setIsMemberIdValid(memberIdRegex.test(text));
    };

    const validateMemberPassword = (text) => {
        setMemberPassword(text);
        // 특수문자를 선택적으로 허용하는 정규식: 영문자와 숫자만 필수
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,20}$/; // 영문자와 숫자를 필수로, 특수문자는 선택
        setIsMemberPasswordValid(passwordRegex.test(text));
    };

    const validateConfirmPassword = (text) => {
        setConfirmPassword(text);
        setIsConfirmPasswordValid(text === memberPassword);
    };

    return (
        <>
            <DefaultHeader title="간편가입" navigation={navigation} />

            <View style={styles.container}>
                <Text style={[styles.label, { marginTop: 50 }]}>아이디</Text>

                <View style={styles.idContainer}>
                    {/* 아이디 입력 */}
                    <TextInput
                        style={[styles.idInput, isMemberIdValid === false && styles.invalidInput]}
                        placeholder="아이디를 입력하세요"
                        placeholderTextColor="#888"
                        value={memberId}
                        onChangeText={validateMemberId}
                    />

                    {/* 중복확인 버튼 */}
                    <TouchableOpacity style={styles.checkButton} onPress={() => alert('아이디 중복 확인')}>
                        <Text style={styles.checkButtonText}>중복확인</Text>
                    </TouchableOpacity>
                </View>
                {isMemberIdValid === false && <Text style={styles.errorText}>영문자와 숫자가 모두 포함된 6자리 이상의 아이디를 입력해주세요.</Text>}

                <View style={{ marginTop: 20 }}>
                    {/* 비밀번호 입력 */}
                    <Text style={styles.label}>비밀번호</Text>
                    <TextInput
                        style={[styles.input, isMemberPasswordValid === false && styles.invalidInput]}
                        placeholder="비밀번호를 입력하세요"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={memberPassword}
                        onChangeText={validateMemberPassword}
                    />
                    {isMemberPasswordValid === false && <Text style={styles.errorText}>영문 대/소문자와 숫자를 조합하여 6~20자로 입력해주세요.</Text>}

                    {/* 비밀번호 확인 입력 */}
                    <Text style={styles.label}>비밀번호 확인</Text>
                    <TextInput
                        style={[styles.input, isConfirmPasswordValid === false && styles.invalidInput]}
                        placeholder="비밀번호를 다시 입력하세요"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={validateConfirmPassword}
                    />
                    {isConfirmPasswordValid === false && <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>}
                </View>

                <View style={styles.buttonContainer}>
                    {/* 다음 버튼 */}
                    <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
                        <Text style={styles.nextButtonText}>다음</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        </>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        padding: 20,
        backgroundColor: '#191D22',
    },
    
    idContainer: {
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width * 0.9, // 부모 컨테이너 너비 설정
    },
    
    label: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        color: 'white',
    },
    
    idInput: {
        flex: 1, // 입력 필드가 남은 공간을 차지하도록 설정
        borderWidth: 1.5,
        borderColor: '#3B404B',
        borderRadius: 10,
        paddingVertical: 12, // 위, 아래 패딩
        paddingLeft: 15, // 왼쪽 패딩
        fontSize: 15,
        color: '#fff', // 텍스트 색상 흰색으로 설정
    },
    
    checkButton: {
        borderWidth: 0, // 보더를 없애는 설정
        marginLeft: 10,
        backgroundColor: '#525D75',
        paddingHorizontal: 25, // 왼쪽, 오른쪽
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 45, // 버튼 높이를 입력 필드 높이와 맞추기
    },

    checkButtonText: {
        color: '#F1F4FA',
        fontWeight: '100',
    },

    invalidInput: {
        borderColor: 'red',
    },

    input: {
        borderWidth: 1.5,
        borderColor: '#3B404B',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        color: '#fff', // 텍스트 색상 흰색으로 설정
    },

    errorText: {
        color: 'red',
        marginTop: 10,
        fontSize: 12,
    },

    buttonContainer: {
        position: 'absolute',
        bottom: 20,  // 하단에서부터의 거리
        width: '100%',  // 부모 컨테이너가 가로 100% 유지
        alignItems: 'center',  // 자식 요소들을 가로 중앙에 정렬
        margin: 20,
    },
    
    nextButton: {
        backgroundColor: '#5E56C3',
        padding: 15,
        marginTop: 20,
        borderRadius: 25,
        alignItems: 'center',
        width: '100%',  
    },

    nextButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Signup;
