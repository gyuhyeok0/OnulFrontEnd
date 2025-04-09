import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Button, Animated, Dimensions, Image } from 'react-native';
import DefaultHeader from '../common/DefaultHeader';
import CustomModal from '../modal/ServiceAgree';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const screenHeight = Dimensions.get('window').height;

const Menu = ({ navigation }) => {
    const { t } = useTranslation();

    const [isModalVisible, setModalVisible] = useState(false);
    const [modalY] = useState(new Animated.Value(screenHeight)); 


    const [modalType, setModalType] = useState('');



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
                

            </View>

            <CustomModal
                isVisible={isModalVisible}
                onClose={closeModal}
                modalY={modalY}
                title={t('menu.termsTitle')}
                type={modalType}  // 수정된 부분
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
