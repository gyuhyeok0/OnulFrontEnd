import React, { useState, useEffect } from 'react';
import { View, Modal, Text, StyleSheet, Pressable, Image, Platform, Animated, Dimensions } from 'react-native';
import Purchases from "react-native-purchases"; 
import CustomModal from './ServiceAgree';
import { useDispatch } from 'react-redux';
import { setPremiumStatus } from '../../modules/SubscriptionSlice';
import { useTranslation } from 'react-i18next';


const screenHeight = Dimensions.get('window').height;

const SubscriptionModal = ({ visible, onClose }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();


    const [isModalVisible, setModalVisible] = useState(false);
    const [modalY] = useState(new Animated.Value(screenHeight)); 
    const [offerings, setOfferings] = useState(null);  
    const [modalType, setModalType] = useState('');


    useEffect(() => {
        const fetchOfferings = async () => {
            try {
                const offeringsData = await Purchases.getOfferings();
                if (offeringsData.current) {
                    setOfferings(offeringsData.current);
                }
            } catch (error) {
                console.error("RevenueCat 상품 정보 가져오기 오류:", error);
            }
        };
    
        fetchOfferings();
    }, []);
    

    const handlePurchase = async () => {
        if (!offerings || !offerings.availablePackages.length) {
            return;
        }
    
        try {
            const packageToBuy = offerings.availablePackages[0];
            const purchaseMade = await Purchases.purchasePackage(packageToBuy);
            const customerInfo = await Purchases.getCustomerInfo();
    
            if (customerInfo.entitlements.active["Pro"]) {
                dispatch(setPremiumStatus(true)); // ✅ Redux 상태 업데이트
                onClose(); // 모달창 닫기
            } 
        } catch (error) {
            if (!error.userCancelled) {
                console.error("구매 실패:", error);
            } 
        }
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
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    
                    <View style={styles.logoBox}>
                        <Image
                            source={require('../../assets/WhiteLogo.png')}
                            style={styles.logo}
                        />
                        <Text style={{ color: 'white', margin: 5, fontSize: 20 }}>{t('subscription.title')}</Text>

                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.priceSubText}>{t('subscription.priceChangeNotice')}</Text>

                        <View style={{flexDirection:'row', alignItems:'center', marginBottom: 5}}>
                            <Text style={styles.priceHighlight}>{t('subscription.launchOffer')}</Text>

                            {/* <Text style={styles.priceText}>{t('subscription.currentPrice')}</Text> */}
                        </View>
                    </View>

                    <View style={styles.payBox}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold' }}>{t('subscription.oneMonthPlan')}</Text>
                            <Text style={{ color: 'white', fontSize: 20 }}>1,100원</Text>
                        </View>

                        <View style={styles.infoTextBox}>
                            <Text style={styles.infoText}>{t('subscription.aiFeature')}</Text>
                            <Text style={styles.infoText}>{t('subscription.removeAds')}</Text>
                        </View>
                    </View>

                    <Text style={styles.noticeText}>
                        {Platform.OS === 'ios' ? t('subscription.cancelNoticeIos') : t('subscription.cancelNoticeAndroid')}
                    </Text>


                    {/* 구매하기 버튼 */}
                    <Pressable style={styles.subscribeButton} onPress={handlePurchase}>
                        <Text style={styles.subscribeButtonText}>{t('subscription.purchase')}</Text>
                    </Pressable>

                    {/* 닫기 버튼 */}
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>{t('subscription.close')}</Text>
                    </Pressable>

                    <View style={styles.infoContainer}>
                        <Text style={styles.requiredInfoText}>
                            {Platform.OS === 'ios' ? t('subscription.purchaseNoticeIos') : t('subscription.purchaseNoticeAndroid')}
                        </Text>
                        <Text style={styles.requiredInfoText}>
                            {Platform.OS === 'ios' ? t('subscription.renewalNoticeIos') : t('subscription.renewalNoticeAndroid')}
                        </Text>
                    </View>

                    <View style={styles.termsContainer}>
                        <Pressable onPress={() => handleViewTerms('privacy')}>
                            <Text style={styles.termsLink}>{t('subscription.privacyPolicy')}</Text>
                        </Pressable>
                        <Text style={styles.separator}> | </Text>
                        <Pressable onPress={() => handleViewTerms('service')}>
                            <Text style={styles.termsLink}>{t('subscription.termsOfService')}</Text>
                        </Pressable>
                    </View>


                    <CustomModal 
                        isVisible={isModalVisible} 
                        onClose={closeModal} 
                        modalY={modalY} 
                        title={t('subscription.termsOfService')} 
                        type={modalType}  // 수정된 부분
                    />

                </View>
            </View>
        </Modal>
    );
};

// ----------------------- 스타일 -----------------------
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: "95%",
        padding: 20,
        backgroundColor: '#16181D',
        borderRadius: 10,
        alignItems: 'center',
    },
    subscribeButton: {
        backgroundColor: '#3F97EF',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    subscribeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#9E9E9E',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    logoBox:{
        alignItems:'center',
        marginTop: 10
    },
    logo:{
        width: 100,
        height: 80,
        marginLeft: -7
    },
    payBox:{
        padding: 15,
        borderColor:'#3F97EF',
        borderWidth: 1.5,
        borderRadius: 5,
        width : "100%"
    },
    infoTextBox: {
        marginTop: 15
    },
    infoText: {
        color:'white',
        fontSize: 15,
        marginBottom: 2
    },
    termsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    termsLink: {
        fontSize: 13,
        color: '#3F97EF',
        textDecorationLine: 'underline',
    },
    separator: {
        fontSize: 14,
        color: 'white',
        marginHorizontal: 5,
    },
    priceContainer:{
        justifyContent:'space-between',
        width: "95%",
        marginTop: 20
    },
    priceHighlight: {
        color: '#FFD700', // 골드 색상 (강조)
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5
    },
    priceText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    priceAmount: {
        color: '#3F97EF', // 파란색 강조
        fontSize: 18,
        fontWeight: 'bold',
    },
    priceSubText: {
        color: '#B0B0B0',
        fontSize: 13,
        marginTop: 2,
    },
    noticeText: {
        color: 'white',
        fontSize: 12,
        margin: 5,
        marginTop: 30,
        textAlign: 'center',
    },
    infoContainer: {
        marginTop: 10,
    },
    requiredInfoText: {
        color: '#999999',
        fontSize: 12,
        marginBottom: 3,
        lineHeight: 16,
    },
});

export default SubscriptionModal;
