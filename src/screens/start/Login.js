import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import { callAppleLoginAPI } from '../../apis/AppleAPICalls';
import { ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';


function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);


  const handlePressSignIn = async () => {
    // try {
    //   const appleAuthRequestResponse = await appleAuth.performRequest({
    //     requestedOperation: appleAuth.Operation.LOGIN, // ✅ 로그인 요청
    //     requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    //   });
  
    //   const { identityToken } = appleAuthRequestResponse;
  
    //   if (identityToken) {
    //     Clipboard.setString(identityToken); // ✅ 클립보드에 복사
    //     Alert.alert(
    //       '✅ 복사 완료',
    //       '토큰이 클립보드에 복사되었습니다.\nSafari나 메모 앱에 붙여넣어 확인하세요!'
    //     );
    //   } else {
    //     Alert.alert('Apple Login Failed', 'identityToken 없음');
    //   }
    // } catch (error) {
    //   Alert.alert('Apple Login 실패', error?.message || '알 수 없는 오류');
    // }
  
    navigation.navigate('Signin'); // 이후 토큰 전달 구조로 수정 가능
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

      
          {isLoading ? (
            <ActivityIndicator size="large" color="#ffffff" style={{ marginVertical: 10 }} />
          ) : (
            appleAuth.isSupported && (
              <AppleButton
                buttonType={AppleButton.Type.SIGN_IN}
                buttonStyle={AppleButton.Style.BLACK}
                cornerRadius={22}
                style={styles.appleButton}
                onPress={async () => {
                  try {
                    setIsLoading(true); // 로딩 시작

                    const appleAuthRequestResponse = await appleAuth.performRequest({
                      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
                    });

                    const { identityToken } = appleAuthRequestResponse;

                    if (identityToken) {
                      const result = await callAppleLoginAPI({ identityToken, dispatch });

                      if (result.status === 200) {
                        navigation.navigate('Exercise');
                      } else {
                        console.warn('Apple 로그인 실패:', result.errorMessage);
                      }
                    } else {
                      console.warn('identityToken 없음');
                    }
                  } catch (e) {
                    console.warn('Apple 로그인 실패', e);
                  } finally {
                    setIsLoading(false); // 로딩 종료
                  }
                }}
              />
            )
          )}
          
          <TouchableOpacity>
            <Text style={styles.inquiry} onPress={handleInquiry}>{t('inquiry.title_page')}</Text>
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
    marginBottom: 10,  // 버튼 간 간격 추가
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

  appleButton: {
    width: 260,
    height: 45,
    marginBottom: 10,
  }

});

export default LoginScreen;
