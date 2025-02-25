import React, { useState, useEffect } from 'react';
import { View, Modal, Text, StyleSheet, Pressable, Image, Platform, Animated, Dimensions } from 'react-native';
import Purchases from "react-native-purchases"; // 🚀 추가
import CustomModal from './ServiceAgree';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscriptionStatus, setPremiumStatus } from '../../modules/SubscriptionSlice';


const screenHeight = Dimensions.get('window').height;

const SubscriptionModal = ({ visible, onClose }) => {
    const dispatch = useDispatch();


    const [isModalVisible, setModalVisible] = useState(false);
    const [modalY] = useState(new Animated.Value(screenHeight)); 
    const [modalContent, setModalContent] = useState('');  
    const [offerings, setOfferings] = useState(null);  // ✅ 상품 목록 상태 추가

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
            console.log("No offerings available.");
            return;
        }
    
        try {
            const packageToBuy = offerings.availablePackages[0];
            const purchaseMade = await Purchases.purchasePackage(packageToBuy);
            const customerInfo = await Purchases.getCustomerInfo();
    
            console.log("🛒 구매 정보:", customerInfo);
            if (customerInfo.entitlements.active["Pro"]) {
                console.log("✅ 구매 성공! 프리미엄 활성화됨.");
                dispatch(setPremiumStatus(true)); // ✅ Redux 상태 업데이트
                onClose(); // 모달창 닫기
            } else {
                console.log("구매는 성공했지만, 프리미엄 활성화 안됨.");
            }
        } catch (error) {
            if (!error.userCancelled) {
                console.error("구매 실패:", error);
            } else {
                console.log("사용자가 구매 취소함.");
            }
        }
    };


    // ✅ 이용약관 / 개인정보처리방침 모달 열기
    const handleViewTerms = (type) => {
        const content = type === 'service' ? '서비스 이용약관 내용' : '개인정보 처리방침 내용';
        setModalContent(content);  
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
                        <Text style={{color:'white', margin:5, fontSize: 20}}>프리미엄 맴버십</Text>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.priceSubText}>향후 가격 변동 가능</Text>
                        <View style={{flexDirection:'row', alignItems:'center', marginBottom: 5}}>
                            <Text style={styles.priceHighlight}>출시 기념 특가!</Text>
                            <Text style={styles.priceText}>현재 <Text style={styles.priceAmount}>1,100원</Text></Text>
                        </View>
                    </View>

                    <View style={styles.payBox}>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                            <Text style={{color:'white', fontSize: 25, fontWeight:'bold'}}>1개월</Text>
                            <Text style={{color:'white', fontSize: 20}}>1100원</Text>
                        </View>

                        <View style={styles.infoTextBox}>
                            <Text style={styles.infoText}>AI 자동적응 이용가능</Text>
                            <Text style={styles.infoText}>모든 광고 제거</Text>
                        </View>
                    </View>

                    <Text style={styles.noticeText}>
                        {Platform.OS === 'ios' 
                            ? "애플 앱스토어에서 언제든지 자동 갱신을 해제할 수 있습니다." 
                            : "Google Play 스토어에서 언제든지 자동 갱신을 해제할 수 있습니다."}
                    </Text>    

                    {/* 구매하기 버튼 */}
                    <Pressable style={styles.subscribeButton} onPress={handlePurchase}>
                        <Text style={styles.subscribeButtonText}>구매하기</Text>
                    </Pressable>

                    {/* 닫기 버튼 */}
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>닫기</Text>
                    </Pressable>

                    <View style={styles.infoContainer}>
                        {Platform.OS === 'ios' ? (
                            <>
                                <Text style={styles.requiredInfoText}>
                                    구입 확정 시 Apple 계정으로 요금이 청구됩니다.
                                </Text>
                                <Text style={styles.requiredInfoText}>
                                    구독은 자동으로 갱신되며, 구독 종료 24시간 전까지 해지하지 않으면 다음 결제 주기에 요금이 청구됩니다.
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.requiredInfoText}>
                                    구입 확정 시 Google Play 계정으로 요금이 청구됩니다.
                                </Text>
                                <Text style={styles.requiredInfoText}>
                                    구독은 자동으로 갱신되며, 구독 종료 24시간 전까지 해지하지 않으면 다음 결제 주기에 요금이 청구됩니다.
                                </Text>
                            </>
                        )}
                    </View>

                    {/* 약관 / 개인정보처리방침 링크 */}
                    <View style={styles.termsContainer}>
                        <Pressable onPress={() => handleViewTerms('privacy')}>
                            <Text style={styles.termsLink}>개인정보처리방침</Text>
                        </Pressable>
                        <Text style={styles.separator}> | </Text>
                        <Pressable onPress={() => handleViewTerms('service')}>
                            <Text style={styles.termsLink}>이용약관</Text>
                        </Pressable>
                    </View>

                    {/* 커스텀 모달 (약관 내용 표시) */}
                    <CustomModal
                        isVisible={isModalVisible}
                        onClose={closeModal}
                        modalY={modalY}
                        title="약관 내용"
                        content={modalContent}
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
