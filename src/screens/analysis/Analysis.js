import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Footer from '../common/Footer';
import Header from '../common/Header';
import { RewardedAd, TestIds } from 'react-native-google-mobile-ads';

// 테스트용 리워디드 광고 인스턴스 생성
const rewardedAd = RewardedAd.createForAdRequest(TestIds.REWARDED);

const Analysis = ({ navigation }) => {
    useEffect(() => {
        // 이벤트 타입을 문자열 "closed"로 직접 전달해봅니다.
        const unsubscribe = rewardedAd.addAdEventListener("closed", () => {
        rewardedAd.load(); // 광고가 닫히면 새로운 광고 로드
        });
        rewardedAd.load();

        return () => unsubscribe();
    }, []);

    const showRewardedAd = async () => {
        if (rewardedAd.loaded) {
        await rewardedAd.show();
        } else {
        console.log('광고가 아직 로드되지 않았습니다.');
        }
    };

    const handlePress = async (targetScreen) => {
        await showRewardedAd();
        navigation.navigate(targetScreen);
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
