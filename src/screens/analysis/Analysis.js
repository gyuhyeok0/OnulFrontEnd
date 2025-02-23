import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
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

const rewardedAd = RewardedAd.createForAdRequest(TestIds.REWARDED);

const MAX_ADS_PER_DAY = 5;
const STORAGE_KEY = 'adDisplayCount';
const DATE_KEY = 'lastAdDate';

const Analysis = ({ navigation }) => {
    const memberSignupDate = useSelector((state) => state.member.userInfo.memberSignupDate);
    console.log('memberSignupDate: ', memberSignupDate);

    const [showAd, setShowAd] = useState(false);
    const [adCount, setAdCount] = useState(0);
    const [isAdLoaded, setIsAdLoaded] = useState(false);
    const [days, setDays] = useState(0);


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

    useEffect(() => {
        if (!showAd || adCount >= MAX_ADS_PER_DAY) return;

        console.log('📢 Analysis 페이지 마운트됨 → 광고 로드 시작');
        rewardedAd.load();

        const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
            console.log('✅ 광고가 로드되었습니다.');
            setIsAdLoaded(true);
        });

        const unsubscribeClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, async () => {
            console.log('📢 광고가 닫혔습니다. 새로운 광고 로드.');
            rewardedAd.load();

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
            console.log(`❌ 광고 로딩 실패: ${error.message}`);

            await analytics().logEvent('ad_load_failed', {
                ad_type: 'rewarded',
                error_message: error.message,
            });
        });

        return () => {
            unsubscribeLoaded();
            unsubscribeClosed();
            unsubscribeRewarded();
            unsubscribeError();
        };
    }, [showAd, adCount]);

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

        if (days <= 5) {
            navigation.navigate(targetScreen);
            return;
        }

        Alert.alert(
            "이용 방법 선택",
            "광고를 보고 이용하거나, 구독하고 광고 없이 이용할 수 있습니다.",
            [
                {
                    text: "구독하고 광고 없이 이용하기",
                    onPress: async () => {
                        // 구독 로직 추가 가능 (예: in-app purchase)
                        console.log("🚀 유저가 구독을 선택했습니다.");
                        navigation.navigate(targetScreen);
                    },
                },
                {
                    text: "광고 보고 이용하기",
                    onPress: async () => {
                        if (isAdLoaded && adCount < MAX_ADS_PER_DAY) {
                            await showRewardedAd();
                        }
                        navigation.navigate(targetScreen);
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
                <View style={styles.graph}>
                    <Pressable style={styles.navButton} onPress={() => handlePress('ExerciseVolumeGraph')}>
                        <Text style={styles.navButtonText}>내 운동 상태 확인하기</Text>
                    </Pressable>
                </View>
                <View style={styles.graph}>
                    <Pressable style={styles.navButton} onPress={() => handlePress('WeightAndDietGraph')}>
                        <Text style={styles.navButtonText}>몸무게 및 식단 확인하기</Text>
                    </Pressable>
                </View>
                <View style={styles.graph}>
                    <Pressable style={styles.navButton} onPress={() => handlePress('MuscleFatigue')}>
                        <Text style={styles.navButtonText}>근육 피로도 확인하기</Text>
                    </Pressable>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
            <Footer navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    graph: {
        backgroundColor: '#222732',
        height: 300,
        borderRadius: 10,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    navButton: {
        backgroundColor: '#497CF4',
        paddingVertical: 10,
        width: 250,
        borderRadius: 10,
        position: 'absolute',
        bottom: 10,
    },
    navButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Analysis;
