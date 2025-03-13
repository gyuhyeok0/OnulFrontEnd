import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Button, Animated, Dimensions, Image } from 'react-native';
import DefaultHeader from '../common/DefaultHeader';
import CustomModal from '../modal/ServiceAgree';
import { useDispatch, useSelector } from 'react-redux';
import SubscriptionModal from '../modal/SubscriptionModal';
import { useTranslation } from 'react-i18next';

const screenHeight = Dimensions.get('window').height;

const Menu = ({ navigation }) => {
    const { t } = useTranslation();

    const [isModalVisible, setModalVisible] = useState(false);
    const [modalY] = useState(new Animated.Value(screenHeight)); 
    const memberSignupDate = useSelector((state) => state.member.userInfo.memberSignupDate); // Optional chaining 사용

    const [fourWeeksLater, setFourWeeksLater] = useState(null);
    const isPremium = useSelector(state => state.subscription.isPremium);

    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false); // 결제 모달 상태
    const [modalType, setModalType] = useState('');

    useEffect(() => {
    if (memberSignupDate) {
        const signupDateObj = new Date(memberSignupDate); // 문자열을 Date 객체로 변환
        signupDateObj.setDate(signupDateObj.getDate() + 28); // 28일 후 계산
        setFourWeeksLater(signupDateObj.toISOString().split("T")[0]); // YYYY-MM-DD 형식으로 저장
    }
    }, [memberSignupDate]);

    const handleTranslation = () => {
        navigation.navigate('MenuTranslation');
    };

    const handleAccountInfo = () => {
        navigation.navigate('AcountInfo');
    };

    const handleAsyncStorage = () => {
        navigation.navigate('AsyncStorage2');
    };

    const handleInquiry = () => {
        navigation.navigate('Inquiry');
    };

    const handleAgreement = () => {
        navigation.navigate('Inquiry');

    };

        // ✅ 이용약관 / 개인정보처리방침 모달 열기
    const handleViewTerms = (type) => {
        setModalType(type);  // 모달 타입 저장
        setModalVisible(true);
        Animated.timing(modalY, {
            toValue: screenHeight * 0.35,  
            duration: 500,  
            useNativeDriver: true,
        }).start();
    };

    // ✅ 모달 닫기
    const closeModal = () => {
        Animated.timing(modalY, {
            toValue: screenHeight,  
            duration: 500,
            useNativeDriver: true,
        }).start(() => setModalVisible(false));  
    };

    return (
        <>
            <DefaultHeader title={t('menu.title')} navigation={navigation} />

            <View style={styles.container}>
                <CustomButton title={t('menu.translation')} onPress={handleTranslation} />
                <CustomButton title={t('menu.unitSettings')} onPress={handleAsyncStorage} />
                <CustomButton title={t('menu.accountInfo')} onPress={handleAccountInfo} />
                <CustomButton title={t('menu.inquiry')} onPress={handleInquiry} />
                <CustomButton title={t('menu.termsOfService')} onPress={() => handleViewTerms('service')} />
                <CustomButton title={t('menu.privacyPolicy')} onPress={() => handleViewTerms('privacy')} />
            </View>
        


            <View style={{
                backgroundColor: '#1A1C22',
                padding: 20,
                position: 'absolute', // 화면 내에서 위치 지정 가능
                bottom: 0, // 화면 하단에 고정
                left: 0,
                right: 0
            }}>
                <Image
                    source={require('../../assets/WhiteLogo.png')}
                    style={{width: 100, height: 70, marginLeft:-15, marginBottom:5}}
                />


                {!isPremium && new Date(fourWeeksLater) > new Date() && (
                    <>
                        <Text style={{ color: 'white', fontSize: 13 }}>{t('menu.freeTrialActive')}</Text>
                        <Text style={{ color: 'white', fontSize: 13 }}>{t('menu.autoAdaptAfterSubscription')}</Text>
                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 5, flexWrap: 'wrap' }}>
                            <Text style={{ color: 'white', fontSize: 13 }}>{t('menu.freeTrialEnds')}: {fourWeeksLater}</Text>

                            <Pressable 
                                onPress={() => setIsPaymentModalVisible(true)} // 버튼 누르면 모달 표시
                                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
                            >
                                <Text style={{ color: '#007AFF', fontSize: 13, fontWeight: 'bold' }}>{t('menu.subscribeNow')}</Text>
                            </Pressable>
                        </View>
                    </>
                )}

                

            </View>

            <CustomModal
                isVisible={isModalVisible}
                onClose={closeModal}
                modalY={modalY}
                title={t('menu.termsTitle')}
                type={modalType}  // 수정된 부분
            />

            <SubscriptionModal
                visible={isPaymentModalVisible}
                onClose={() => setIsPaymentModalVisible(false)}
            />
        </>
    );
};

// 커스텀 버튼 컴포넌트
const CustomButton = ({ title, onPress }) => {
    return (
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1A1C22",
        alignItems: "center",
        // paddingHorizontal: 20,
    },
    button: {
        backgroundColor: "#212328",
        paddingVertical: 15,
        paddingHorizontal: 40,
        marginVertical: 1.5,
        width: "100%",
        // alignItems: "center",
    },
    buttonPressed: {
        backgroundColor: "#3A3D44",
    },
    buttonText: {
        color: "#F0F0F0",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Menu;
