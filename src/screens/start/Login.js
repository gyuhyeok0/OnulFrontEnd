import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';

function LoginScreen({ navigation }) {

  useEffect(() => {
    console.log("=====================시작 페이지 ========================")
  }, []);

  const { t } = useTranslation();

  const handlePressSignIn = async () => {
    // 로그인 페이지로 이동
    navigation.navigate('Signin');
  };

  const handlePressSignUp = async () => {

      // 회원가입 페이지로 이동
      navigation.navigate('Signup');
  };

  const handleInquiry = () => {
    navigation.navigate('Inquiry');
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.BackgroundCircle, { top: height * 0.25 }]}></View>
      <View style={styles.container2}>
        
        <Image
          source={require('../../assets/WhiteLogo.png')}
          style={styles.logo}
        />

        <Text style={styles.LogoText}>{t('app_name')}</Text>

        {/* 아래 버튼들을 화면 하단에 배치 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.StartBox} onPress={handlePressSignUp}>
            <Text style={styles.ButtonText}>{t('start_fresh')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.LoginBox} onPress={handlePressSignIn}>
            <Text style={styles.ButtonText}>{t('continue_with_account')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Text style={styles.inquiry} onPress={handleInquiry} >문의하기</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: width, 
    flex: 1,
    justifyContent: 'center', 
    backgroundColor: '#191D22',
  },

  BackgroundCircle: {
    position: 'absolute',
    // top: 150,
    right: -110,
    width: 320,
    height: 320,
    backgroundColor: 'black',
    borderRadius: 400,
  },

  container2: {
    width: '85%',
    flex: 1,  // 전체 높이를 차지하게 합니다.
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 120,
    height: 120,
    marginTop: '-40%',
    marginLeft: '-3.5%',
    resizeMode: 'contain',
  },

  LogoText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '150',
    marginTop: '-4.5%'
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 30,  // 하단에서부터의 거리
    width: '100%',
    alignItems: 'center',
  },

  StartBox: {
    width: 260,
    height: 45,
    backgroundColor: '#5E56C3',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,  // 버튼 간 간격 추가
  },

  LoginBox: {
    width: 260,
    height: 45,
    borderWidth: 1.5,
    borderColor: '#3B404B',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ButtonText: {
    alignItems: 'center',
    color: 'white',
    fontSize: 14,
  },

  inquiry: {
    marginTop: 10,
    color: 'gray',
    // textDecorationLine: 'underline',
  },

});

export default LoginScreen;
