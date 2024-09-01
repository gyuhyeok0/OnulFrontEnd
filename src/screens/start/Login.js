import React from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

function LoginScreen({ navigation }) {
  const { t } = useTranslation();

  const handlePressSignIn = () => {
    navigation.navigate('SignIn');
  };

  const handlePressSignUp = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.container}>
      <View style={styles.BackgroundCircle}></View>
      <View style={styles.container2}>
        
        <Image
          source={require('../../assets/WhiteLogo.png')} // 이미지 경로 지정
          style={styles.logo} // 스타일 적용
        />

        <Text style={styles.LogoText}>{t('app_name')}</Text>

        <TouchableOpacity style={styles.StartBox} onPress={handlePressSignUp}>
          <Text style={styles.ButtonText}>{t('start_fresh')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.LoginBox} onPress={handlePressSignIn}>
          <Text style={styles.ButtonText}>{t('continue_with_account')}</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: width, 
    flex: 1,
    justifyContent: 'center', 
    backgroundColor: '#171717',
  },

  BackgroundCircle: {
    position: 'absolute',
    top: 150,
    right: -110,
    width: 300,
    height: 300,
    backgroundColor: 'black',
    borderRadius: 150,
  },

  container2: {
    width: '85%',
    flex: 0.87,
    alignSelf: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 120, // 로고의 너비
    height: 120, // 로고의 높이
    marginTop: '50%',
    marginLeft: '-3.5%',
    resizeMode: 'contain',
  },

  LogoText: {
    fontSize: 13, // 텍스트 크기
    color: '#ffffff', // 텍스트 색상
    fontWeight: '150', // 텍스트 굵기
    marginTop: '-4.5%'
  },

  StartBox: {
    marginTop: '58%',
    width: 260,
    height: 45,
    backgroundColor: '#5E56C3',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  LoginBox: {
    marginTop: '4%',
    width: 260,
    height: 45,
    backgroundColor: '#303030',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ButtonText: {
    alignItems: 'center',
    color: 'white',
    fontSize: 14,
  },
});

export default LoginScreen;
