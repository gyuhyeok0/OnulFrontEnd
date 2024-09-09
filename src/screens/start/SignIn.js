import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DefaultHeader from '../common/DefaultHeader';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './Signin.module';
import FindPassword from '../modal/FindPassword';
import { callLoginAPI } from '../../apis/MemberAPICalls';

const { width, height } = Dimensions.get('window');

function Signin({ navigation }) {
    const dispatch = useDispatch();
    const [isModalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState({
        memberId: '',
        memberPassword: ''
    });
    const [isLoginAttempted, setIsLoginAttempted] = useState(false);
    const [loginError, setLoginError] = useState(null); // 에러 상태 추가

    const loginResult = useSelector(state => state.member);

    const handleSignIn = async () => {
        setIsLoginAttempted(true); // 로그인 시도 상태 설정
        setLoginError(null); // 이전 에러 초기화
        const result = await dispatch(callLoginAPI({ form })); // API 호출 및 결과 저장

        if (result && result.status === 200) {
            console.log("안녕");
            navigation.navigate('Exercise');
        } else if (result && result.errorMessage) {
            console.error(result.errorMessage);
        } else {
            console.error("로그인에 실패했습니다.");
        }
    };


    const handleInputChange = (name, value) => {
        setForm({
            ...form,
            [name]: value
        });
    };

    const openFindPasswordModal = () => {
        setModalVisible(true);
    };

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
                        name="memberId"
                        placeholder="아이디"
                        placeholderTextColor="gray"
                        value={form.memberId}
                        onChangeText={(value) => handleInputChange('memberId', value)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="lock" size={24} color="gray" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        name="memberPassword"
                        placeholder="비밀번호"
                        placeholderTextColor="gray"
                        secureTextEntry={true}
                        value={form.memberPassword}
                        onChangeText={(value) => handleInputChange('memberPassword', value)}
                    />
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
                    <Text style={styles.loginButtonText}>로그인</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerButtonText}>이메일 회원가입</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={openFindPasswordModal}>
                    <Text style={styles.forgotText}>아이디 / 비밀번호 찾기</Text>
                </TouchableOpacity>
            </View>

            <FindPassword isVisible={isModalVisible} onClose={closeModal} />
        </>
    );
}

export default Signin;
