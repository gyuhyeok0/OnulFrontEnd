import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import DefaultHeader from '../common/DefaultHeader';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './Signin.module';
import FindPassword from '../modal/FindPassword';
import { callLoginAPI } from '../../apis/MemberAPICalls';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';


const { height } = Dimensions.get('window');

function Signin({ navigation }) {
    const dispatch = useDispatch();
    const [isModalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState({
        memberId: '',
        memberPassword: ''
    });
    const [isLoginAttempted, setIsLoginAttempted] = useState(false);
    const [loginError, setLoginError] = useState(null); // 에러 상태 추가
    const { t } = useTranslation();


    const handleSignIn = async () => {
        setIsLoginAttempted(true); // 로그인 시도 상태 설정
        setLoginError(null); // 이전 에러 초기화
        const result = await dispatch(callLoginAPI({ form })); // API 호출 및 결과 저장

        if (result && result.status === 200) {
            navigation.navigate('Exercise');
        } else if (result && result.errorMessage) {
            console.error(result.errorMessage);
        } else {
            console.error(t('signin.error_login_failed'));
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
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                extraScrollHeight={20} // 키보드 위 여백
                enableOnAndroid={true} // Android에서도 작동하도록 설정
            >

            <DefaultHeader title={t('signin.title_page')} navigation={navigation} />
            <View style={styles.container}>
                <View style={[styles.BackgroundCircle, { top: height * 0.13 }]}></View>

                <View style={styles.logoContainer}>
                    <Text style={styles.wellcome}>{t('signin.welcome')}</Text>
                    <Text style={styles.logoText}>{t('signin.tagline_1')}</Text>
                    <Text style={styles.logoText}>{t('signin.tagline_2')}</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="user" size={24} color="gray" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        name="memberId"
                        placeholder={t('signin.placeholder_id')}
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
                        placeholder={t('signin.placeholder_password')}
                        placeholderTextColor="gray"
                        secureTextEntry={true}
                        value={form.memberPassword}
                        onChangeText={(value) => handleInputChange('memberPassword', value)}
                    />
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
                    <Text style={styles.loginButtonText}>{t('signin.login_button')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.registerButtonText}>{t('signin.signup_button')}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={openFindPasswordModal}>
                    <Text style={styles.forgotText}>{t('signin.forgot_password')}</Text>
                </TouchableOpacity>
            </View>

            <FindPassword isVisible={isModalVisible} onClose={closeModal} />

            </KeyboardAwareScrollView>
        </>
    );
}

export default Signin;