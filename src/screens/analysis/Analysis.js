import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Image, ImageBackground } from 'react-native';
import Footer from '../common/Footer';
import Header from '../common/Header';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';

import {
    RewardedAd,
    TestIds,
    RewardedAdEventType,
    AdEventType
} from 'react-native-google-mobile-ads';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import SubscriptionModal from '../modal/SubscriptionModal';

const rewardedAd = RewardedAd.createForAdRequest(TestIds.REWARDED);

const MAX_ADS_PER_DAY = 35;
const STORAGE_KEY = 'adDisplayCount';
const DATE_KEY = 'lastAdDate';

const Analysis = ({ navigation }) => {
    const isPremium = useSelector(state => state.subscription.isPremium);
    const memberSignupDate = useSelector((state) => state.member.userInfo.memberSignupDate);
    console.log('memberSignupDate: ', memberSignupDate);

    const [showAd, setShowAd] = useState(false);
    const [adCount, setAdCount] = useState(0);
    const [isAdLoaded, setIsAdLoaded] = useState(false);
    const [days, setDays] = useState(0);

    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false); // 결제 모달 상태


    useEffect(() => {
        analytics().logEvent('screen_view', {
            screen_name: 'Analysis',
            screen_class: 'Analysis'
        });
    }, []);

    useEffect(() => {
        if (!memberSignupDate) return;

        const today = new Date();
        const signupDate = new Date(memberSignupDate);
        const diffTime = today.getTime() - signupDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        setDays(diffDays)
        console.log('가입 후 경과 일수:', diffDays);


        if (diffDays >= 5) {
            setShowAd(true);
            const checkAdLimit = async () => {
                const todayStr = today.toISOString().split('T')[0];
                const lastAdDate = await AsyncStorage.getItem(DATE_KEY);
                let count = 0;

                if (lastAdDate === todayStr) {
                    count = parseInt(await AsyncStorage.getItem(STORAGE_KEY)) || 0;
                } else {
                    await AsyncStorage.setItem(DATE_KEY, todayStr);
                    await AsyncStorage.setItem(STORAGE_KEY, '0');
                }

                setAdCount(count);
            };
            checkAdLimit();
        }
    }, [memberSignupDate]);


    useFocusEffect(
        useCallback(() => {
            console.log('🔄 useFocusEffect 실행됨');
            console.log(`현재 광고 카운트: ${adCount}, showAd 상태: ${showAd}`);
    
            if (!showAd || adCount >= MAX_ADS_PER_DAY) {
                console.log('⛔ 광고를 표시할 조건을 충족하지 않음 → 리턴');
                return;
            }
    
            console.log('📢 Analysis 페이지 포커스 → 광고 로드 시작');
            
            if (!rewardedAd) {
                console.log('⚠️ rewardedAd 객체가 생성되지 않음. 새로 생성 시도.');
                rewardedAd = RewardedAd.createForAdRequest(TestIds.REWARDED);
            } else {
                console.log('✅ rewardedAd 객체가 이미 생성됨.');
            }
    
            console.log('📡 광고 리스너 등록 시작');
    
            const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
                console.log('✅ 광고가 로드되었습니다.');
                setIsAdLoaded(true);
            });
    
            const unsubscribeClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, async () => {
                console.log('📢 광고가 닫혔습니다. 새로운 광고 로드.');
    
                // 광고가 닫히면 다시 로드하기 전에 isLoaded 체크
                if (!rewardedAd.isLoaded) {
                    rewardedAd.load();
                } else {
                    console.log('⚠️ 광고가 이미 로드된 상태 → load() 실행하지 않음');
                }
    
                await analytics().logEvent('ad_skipped', {
                    ad_type: 'rewarded',
                });
            });
    
            const unsubscribeRewarded = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async (reward) => {
                console.log(`✅ 광고 끝까지 시청 → 보상 지급 (${reward.amount} ${reward.type})`);
                
                await analytics().logEvent('ad_rewarded', {
                    ad_type: 'rewarded',
                    reward: reward.type,
                    reward_amount: reward.amount,
                });
            });
    
            const unsubscribeError = rewardedAd.addAdEventListener(AdEventType.ERROR, async (error) => {
                console.log(`❌ 광고 로딩 실패: ${error.code} - ${error.message}`);
            
                await analytics().logEvent('ad_load_failed', {
                    ad_type: 'rewarded',
                    error_code: error.code,
                    error_message: error.message,
                });
            
                console.log('🔄 광고 로딩 실패 → 3초 후 재시도');
                setTimeout(() => {
                    if (!rewardedAd.isLoaded) {
                        console.log('📡 재시도: 광고 로드 실행');
                        rewardedAd.load();
                    } else {
                        console.log('⚠️ 광고가 이미 로드된 상태 → load() 실행하지 않음');
                    }
                }, 3000);
            });
    
            // ✅ 이미 광고가 로드되었으면 다시 로드하지 않도록 방지
            if (!rewardedAd.isLoaded) {
                console.log('📡 광고 로드 요청 실행');
                rewardedAd.load();
            } else {
                console.log('⚠️ 광고가 이미 로드된 상태 → load() 실행하지 않음');
            }
    
            console.log('⏳ 5초 후에도 LOADED 이벤트가 발생하지 않으면 강제 디버깅 로그 출력');
            setTimeout(() => {
                if (!isAdLoaded) {
                    console.log('⚠️ 5초가 지났지만 광고 LOADED 이벤트 발생 안함 → 광고 상태 확인 필요');
                }
            }, 5000);
    
            return () => {
                console.log('🔄 useFocusEffect cleanup: 이벤트 리스너 해제');
                unsubscribeLoaded();
                unsubscribeClosed();
                unsubscribeRewarded();
                unsubscribeError();
            };
        }, [showAd, adCount])
    );
    

    const showRewardedAd = async () => {
        console.log("adCount: " + adCount);
        console.log("isAdLoaded: " + isAdLoaded);

        if (isAdLoaded && adCount < MAX_ADS_PER_DAY) {
            await rewardedAd.show();
            const newCount = adCount + 1;
            setAdCount(newCount);
            await AsyncStorage.setItem(STORAGE_KEY, newCount.toString());
            setIsAdLoaded(false); // 광고가 재로드될 수 있도록 상태 초기화
        } else {
            console.log('⚠️ 하루 광고 한도를 초과했거나 광고가 아직 로드되지 않았습니다.');
        }
    };

    const handlePress = async (targetScreen) => {

        if (days <= 5 || isPremium) {
            navigation.navigate(targetScreen);
            return;
        }

        Alert.alert(
            "이용 방법 선택",
            "광고를 보고 이용하거나, 구독하고 광고 없이 이용할 수 있습니다.",
            [
                {
                    text: "광고 보고 이용하기",
                    onPress: async () => {
                        if (isAdLoaded && adCount < MAX_ADS_PER_DAY) {
                            await showRewardedAd();
                        }
                        navigation.navigate(targetScreen);
                    },
                },
                {

                    text: "구독하고 광고 없이 이용하기",
                    onPress: async () => {
                        // 구독 로직 추가 가능 (예: in-app purchase)
                        console.log("🚀 유저가 구독을 선택했습니다.");
                        setIsPaymentModalVisible(true); // 구독 모달 표시
                    },
                },
                { text: "취소", style: "cancel" },
            ]
        );
    };

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#1A1C22' }}>
            <Header title="Analysis" navigation={navigation} />
            <ScrollView style={{ flex: 1, padding: 15 }}>
                <ImageBackground 
                    style={styles.graph}
                    source={require('../../assets/ExerciseBackground.webp')}  // 생성한 이미지 경로
                    imageStyle={{ opacity: 0.3, borderRadius: 10 }} // 🔥 borderRadius 적용
                    >
                    <View style={{width: "100%"}}>
                        <Image source={require('../../assets/GraphText.png')} 
                            style={{width: 130, height: 35}}
                        />
                        <Text style={{color:'white', fontSize: 15, fontWeight:'bold'}}>나는 운동을 잘하고 있을까?</Text>

                    </View>

                    <Pressable style={styles.navButton} onPress={() => handlePress('ExerciseVolumeGraph')}>
                        <Text style={styles.navButtonText}>내 운동 상태 확인하기</Text>
                    </Pressable>
                    <Text style={{color:'white', fontSize: 10, position: 'absolute', bottom:8}}>이 이미지는 실제 데이터 시각화가 아닌 디자인 요소입니다</Text>

                </ImageBackground>

                <ImageBackground 
                    style={styles.graph}
                    source={require('../../assets/FoodBackground.webp')}  // 생성한 이미지 경로
                    imageStyle={{ opacity: 0.3, borderRadius: 10 }} // 🔥 borderRadius 적용
                    >
                    <View style={{width: "100%"}}>
                        <Image source={require('../../assets/GraphText.png')} 
                            style={{width: 130, height: 35}}
                        />
                        <Text style={{color:'white', fontSize: 15, fontWeight:'bold'}}>내 몸 상태를 제대로 관리하고 있을까?</Text>

                    </View>

                    <Pressable style={styles.navButton} onPress={() => handlePress('ExerciseVolumeGraph')}>
                        <Text style={styles.navButtonText}>몸무게 및 식단 확인하기</Text>
                    </Pressable>
                    <Text style={{color:'white', fontSize: 10, position: 'absolute', bottom:8}}>이 이미지는 실제 데이터 시각화가 아닌 디자인 요소입니다</Text>

                </ImageBackground>

                <ImageBackground 
                    style={styles.graph}
                    source={require('../../assets/MuscleBackground.webp')}  // 생성한 이미지 경로
                    imageStyle={{ opacity: 0.3, borderRadius: 10 }} // 🔥 borderRadius 적용
                    >
                    <View style={{width: "100%"}}>
                        <Image source={require('../../assets/GraphText.png')} 
                            style={{width: 130, height: 35}}
                        />
                        <Text style={{color:'white', fontSize: 15, fontWeight:'bold'}}>내 근육은 얼마나 지쳤을까?</Text>

                    </View>

                    <Pressable style={styles.navButton} onPress={() => handlePress('ExerciseVolumeGraph')}>
                        <Text style={styles.navButtonText}>근육 피로도 확인하기</Text>
                    </Pressable>
                    <Text style={{color:'white', fontSize: 10, position: 'absolute', bottom:8}}>이 이미지는 실제 데이터 시각화가 아닌 디자인 요소입니다</Text>

                </ImageBackground>
                <View style={{ height: 100 }} />
            </ScrollView>
            <Footer navigation={navigation} />

            <SubscriptionModal
                visible={isPaymentModalVisible}
                onClose={() => setIsPaymentModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    graph: {
        backgroundColor: '#222732',
        height: 230,
        borderRadius: 10,
        marginBottom: 30,
        // justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: 20
    },
    navButton: {
        backgroundColor: '#497CF4',
        paddingVertical: 10,
        width: 250,
        borderRadius: 10,
        position: 'absolute',
        bottom: 25,
    },
    navButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Analysis;
