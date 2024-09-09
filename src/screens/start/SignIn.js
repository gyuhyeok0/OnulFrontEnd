import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import DefaultHeader from '../common/DefaultHeader'; // 커스텀 헤더 컴포넌트 임포트
import Icon from 'react-native-vector-icons/FontAwesome'; // FontAwesome 아이콘 사용
import styles from './Signin.module'; // 스타일 파일
import FindPassword from '../modal/FindPassword';  // 비밀번호 찾기 모달 임포트

const { width, height } = Dimensions.get('window'); // Dimensions 정의

function SignIn({ navigation }) {
    const [isModalVisible, setModalVisible] = useState(false);  // 모달 표시 여부 상태

    useEffect(() => {
        console.log("=====================회원 로그인 페이지 ========================");
    }, []);

    const handleSignIn = () => {
        // 로그인 로직 구현 후 성공 시 페이지 이동
        navigation.navigate('Exercise');
    };

    // 비밀번호 찾기 모달 열기 함수
    const openFindPasswordModal = () => {
        setModalVisible(true);
    };

    // 비밀번호 찾기 모달 닫기 함수
    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <>
            <DefaultHeader title="로그인" navigation={navigation} />
            <View style={styles.container}>
                <View style={[styles.BackgroundCircle, { top: height * 0.13 }]}></View>

                <View style={styles.logoContainer}>
                    <Text style={styles.wellcome}>환영합니다</Text>
                    <Text style={styles.logoText}>나를 위한, 나만의 운동</Text>
                    <Text style={styles.logoText}>이제 시작하세요</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="user" size={24} color="gray" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="아이디"
                        placeholderTextColor="gray"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="lock" size={24} color="gray" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="비밀번호"
                        placeholderTextColor="gray"
                        secureTextEntry={true}
                    />
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
                    <Text style={styles.loginButtonText}>로그인</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerButtonText}>이메일 회원가입</Text>
                </TouchableOpacity>

                {/* 아이디 / 비밀번호 찾기 버튼 */}
                <TouchableOpacity onPress={openFindPasswordModal}>
                    <Text style={styles.forgotText}>아이디 / 비밀번호 찾기</Text>
                </TouchableOpacity>
            </View>

            {/* FindPassword 모달 */}
            <FindPassword isVisible={isModalVisible} onClose={closeModal} />
        </>
    );
}

export default SignIn;
