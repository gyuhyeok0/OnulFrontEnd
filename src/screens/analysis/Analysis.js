import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Image, ImageBackground } from 'react-native';
import Footer from '../common/Footer';
import Header from '../common/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import {
  RewardedAdEventType,
  AdEventType
} from 'react-native-google-mobile-ads';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import rewardedAd from '../../ads/rewardedAdInstance'; // ✅ 전역 인스턴스 사용

const MAX_ADS_PER_DAY = 5;
const STORAGE_KEY = 'adDisplayCount';
const DATE_KEY = 'lastAdDate';

const Analysis = ({ navigation }) => {
  const { t } = useTranslation();
  const rewardedAdRef = useRef(rewardedAd);

  const [showAd, setShowAd] = useState(false);
  const [adCount, setAdCount] = useState(0);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

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
      console.log(`[광고] 오늘 날짜: ${todayStr}, 오늘의 광고 횟수: ${count}`);
    };
    checkAdLimit();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!showAd || adCount >= MAX_ADS_PER_DAY) {
        console.log('[광고] 광고 조건 불충분 - showAd:', showAd, 'adCount:', adCount);
        return;
      }

      const ad = rewardedAdRef.current;

      // ✅ 광고가 이미 로드된 경우 수동으로 반영
      if (ad.loaded) {
        console.log('[광고] 이미 로딩된 상태 → isAdLoaded 수동 true');
        setIsAdLoaded(true);
      }

      const unsubscribeLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log('[광고] LOADED 이벤트 발생 → 상태 true');
        setIsAdLoaded(true);
      });

      const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, async () => {
        console.log('[광고] 닫힘 → 재로드 시도');
        setIsAdLoaded(false);
        ad.load();
        await analytics().logEvent('ad_skipped', { ad_type: 'rewarded' });
      });

      const unsubscribeRewarded = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, async (reward) => {
        console.log('[광고] 보상 획득:', reward);
        await analytics().logEvent('ad_rewarded', {
          ad_type: 'rewarded',
          reward: reward.type,
          reward_amount: reward.amount,
        });
      });

      const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, async (error) => {
        console.warn('[광고] 로딩 실패:', error.message);
        setIsAdLoaded(false);
        await analytics().logEvent('ad_load_failed', {
          ad_type: 'rewarded',
          error_code: error.code,
          error_message: error.message,
        });

        setTimeout(() => {
          console.log('[광고] 에러 후 재로드 시도');
          ad.load();
        }, 3000);
      });

      console.log('[광고] 로딩 시작');
      ad.load();

      return () => {
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeRewarded();
        unsubscribeError();
      };
    }, [showAd, adCount])
  );

  const showRewardedAd = async () => {
    const ad = rewardedAdRef.current;

    if (isAdLoaded) {
      console.log('[광고] 광고 시청 시작');
      await ad.show();
      const newCount = adCount + 1;
      setAdCount(newCount);
      await AsyncStorage.setItem(STORAGE_KEY, newCount.toString());
      setIsAdLoaded(false);
    } else {
      console.log('[광고] 광고 아직 준비 안됨');
      Alert.alert(t('analysis.adNotReadyTitle'), t('analysis.adNotReadyMessage'));
      ad.load();
    }
  };

  const handlePress = (targetScreen) => {
    Alert.alert(
      t('analysis.chooseMethod'),
      `${t('analysis.adMessage')}\n\n${t('analysis.dailyLimitNotice')}`,
      [
        {
          text: t('analysis.watchAd'),
          
          onPress: async () => {
            if (adCount >= MAX_ADS_PER_DAY) {
              Alert.alert(t('analysis.limitReachedTitle'), t('analysis.limitReachedMessage'));
              return;
            }
        
          
            if (!isAdLoaded) {
              Alert.alert(t('analysis.adNotReadyTitle'), t('analysis.adNotReadyMessage'));
              return;
            }
          
            await showRewardedAd();
            navigation.navigate(targetScreen);
          },

          
        },
        { text: t('analysis.cancel'), style: 'cancel' },
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
