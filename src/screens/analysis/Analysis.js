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
import { useTranslation } from 'react-i18next';

const rewardedAd = RewardedAd.createForAdRequest(TestIds.REWARDED);

const MAX_ADS_PER_DAY = 5;
const STORAGE_KEY = 'adDisplayCount';
const DATE_KEY = 'lastAdDate';

const Analysis = ({ navigation }) => {
    const { t } = useTranslation();
    const isPremium = useSelector(state => state.subscription.isPremium);
    const [showAd, setShowAd] = useState(false);
    const [adCount, setAdCount] = useState(0);
    const [isAdLoaded, setIsAdLoaded] = useState(false);

    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false); // 결제 모달 상태


    useEffect(() => {
        analytics().logEvent('screen_view', {
            screen_name: 'Analysis',
            screen_class: 'Analysis'
        });
    }, []);

    useEffect(() => {


            setShowAd(true);
            const checkAdLimit = async () => {
                const today = new Date(); 
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
    }, []);


    useFocusEffect(
        useCallback(() => {

            if (!showAd || adCount >= MAX_ADS_PER_DAY) {
                return;
            }
    
            
            if (!rewardedAd) {
                rewardedAd = RewardedAd.createForAdRequest(TestIds.REWARDED);
            } else {
                // console.log('✅ rewardedAd 객체가 이미 생성됨.');
            }
    
    
            const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
                setIsAdLoaded(true);
            });
    
            const unsubscribeClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, async () => {
    
                // 광고가 닫히면 다시 로드하기 전에 isLoaded 체크
                if (!rewardedAd.isLoaded) {
                    rewardedAd.load();
                } else {
                    // console.log('⚠️ 광고가 이미 로드된 상태 → load() 실행하지 않음');
                }
    
                await analytics().logEvent('ad_skipped', {
                    ad_type: 'rewarded',
                });
            });
    
            const unsubscribeRewarded = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async (reward) => {
                
                await analytics().logEvent('ad_rewarded', {
                    ad_type: 'rewarded',
                    reward: reward.type,
                    reward_amount: reward.amount,
                });
            });
    
            const unsubscribeError = rewardedAd.addAdEventListener(AdEventType.ERROR, async (error) => {
            
                await analytics().logEvent('ad_load_failed', {
                    ad_type: 'rewarded',
                    error_code: error.code,
                    error_message: error.message,
                });
            
                setTimeout(() => {
                    if (!rewardedAd.isLoaded) {
                        rewardedAd.load();
                    } else {
                        // console.log('⚠️ 광고가 이미 로드된 상태 → load() 실행하지 않음');
                    }
                }, 3000);
            });
    
            // ✅ 이미 광고가 로드되었으면 다시 로드하지 않도록 방지
            if (!rewardedAd.isLoaded) {
                rewardedAd.load();
            } else {
                // console.log('⚠️ 광고가 이미 로드된 상태 → load() 실행하지 않음');
            }
    
            setTimeout(() => {
                if (!isAdLoaded) {
                    // console.log('⚠️ 5초가 지났지만 광고 LOADED 이벤트 발생 안함 → 광고 상태 확인 필요');
                }
            }, 5000);
    
            return () => {
                unsubscribeLoaded();
                unsubscribeClosed();
                unsubscribeRewarded();
                unsubscribeError();
            };
        }, [showAd, adCount])
    );
    

    const showRewardedAd = async () => {

        if (isAdLoaded && adCount < MAX_ADS_PER_DAY) {
            await rewardedAd.show();
            const newCount = adCount + 1;
            setAdCount(newCount);
            await AsyncStorage.setItem(STORAGE_KEY, newCount.toString());
            setIsAdLoaded(false); // 광고가 재로드될 수 있도록 상태 초기화
        } else {
            // console.log('⚠️ 하루 광고 한도를 초과했거나 광고가 아직 로드되지 않았습니다.');
        }
    };

    const handlePress = async (targetScreen) => {

        if (isPremium) {
            navigation.navigate(targetScreen);
            return;
        }

        Alert.alert(
            t('analysis.chooseMethod'),
            t('analysis.adMessage'),
            [
                {
                    text: t('analysis.watchAd'),
                    onPress: async () => {
                        if (isAdLoaded && adCount < MAX_ADS_PER_DAY) {
                            await showRewardedAd();
                        }
                        navigation.navigate(targetScreen);
                    },
                },
                {
                    text: t('analysis.subscribe'),
                    onPress: async () => {
                        setIsPaymentModalVisible(true);
                    },
                },
                { text: t('analysis.cancel'), style: "cancel" },
            ]
        );
        
    };

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#1A1C22' }}>
            <Header title="Analysis" navigation={navigation} />
            <ScrollView style={{ flex: 1, padding: 15 }}>
                <Text style={{color:'white', textAlign:'center', padding: 30, fontSize:15, fontWeight:'bold'}}>
                    {t('analysis.infoAnalysis')}
                </Text>
                <ImageBackground 
                    style={styles.graph}
                    source={require('../../assets/ExerciseBackground.webp')}  // 생성한 이미지 경로
                    imageStyle={{ opacity: 0.3, borderRadius: 10 }} // 🔥 borderRadius 적용
                    >
                    <View style={{width: "100%"}}>
                        <Image source={require('../../assets/GraphText.png')} 
                            style={{width: 130, height: 35}}
                        />
                        <Text style={{color:'white', fontSize: 15, fontWeight:'bold'}}>{t('analysis.exerciseQuestion')}</Text>

                    </View>

                    <Pressable style={styles.navButton} onPress={() => handlePress('ExerciseVolumeGraph')}>
                        <Text style={styles.navButtonText}>{t('analysis.checkExercise')}</Text>

                    </Pressable>
                    <Text style={{color:'white', fontSize: 12, position: 'absolute', bottom:5, textAlign:'center'}}>
                    {t('analysis.imageNote')}
                    </Text>

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
                        <Text style={{color:'white', fontSize: 15, fontWeight:'bold'}}>{t('analysis.bodyManagementQuestion')}</Text>

                    </View>

                    <Pressable style={styles.navButton} onPress={() => handlePress('WeightAndDietGraph')}>
                        <Text style={styles.navButtonText}>{t('analysis.checkDiet')}</Text>
                    </Pressable>
                    <Text style={{color:'white', fontSize: 12, position: 'absolute', bottom:5, textAlign:'center'}}>
                    {t('analysis.imageNote')}
                    </Text>

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
                        <Text style={{color:'white', fontSize: 15, fontWeight:'bold'}}>{t('analysis.muscleFatigueQuestion')}</Text>
                        
                    </View>

                    <Pressable style={styles.navButton} onPress={() => handlePress('MuscleFatigue')}>
                        <Text style={styles.navButtonText}>{t('analysis.checkFatigue')}</Text>
                    </Pressable>
                    <Text style={{color:'white', fontSize: 12, position: 'absolute', bottom:5, textAlign:'center'}}>
                    {t('analysis.imageNote')}
                    </Text>

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
        bottom: 40,
    },
    navButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Analysis;
