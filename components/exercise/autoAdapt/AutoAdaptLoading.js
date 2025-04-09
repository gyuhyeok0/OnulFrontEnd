import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

const AutoAdaptLoading = () => {
    const progress = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current; // 투명도 조절을 위한 애니메이션 값
    const { t } = useTranslation();

    const firstProgress = useRef(new Animated.Value(0)).current;
const secondProgress = useRef(new Animated.Value(0)).current;

    
    useEffect(() => {
        // 첫 번째 바 (2초 동안 100% 채우기)
        Animated.timing(firstProgress, {
            toValue: 1,
            duration: 2200,
            useNativeDriver: false,
        }).start(() => {
            // 첫 번째 바가 끝난 후 두 번째 바 시작 (18초 동안 100% 채우기)
            Animated.timing(secondProgress, {
                toValue: 1,
                duration: 17800,
                useNativeDriver: false,
            }).start();
        });
    }, []);

    

    const messages = [
        t('autoAdaptLoading.loadingRecentRecords'),
        t('autoAdaptLoading.calculatingFatigue'),
        t('autoAdaptLoading.settingDifficulty'),
        t('autoAdaptLoading.optimizingRoutine'),
        t('autoAdaptLoading.analyzingRecommendations'),
    ];


    const [currentMessage, setCurrentMessage] = useState(messages[0]);

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0, // 점점 사라지게
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1, // 다시 나타나게
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
    
            // 텍스트 변경을 200ms 지연
            setTimeout(() => {
                if (index < messages.length - 1) {
                    index++;
                    setCurrentMessage(messages[index]);
                } else {
                    clearInterval(interval);
                }
            }, 450); // 0.2초 후 텍스트 변경
    
        }, 1900);
    
        return () => clearInterval(interval);
    }, []);
    
    const jumpAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(jumpAnim, {
                    toValue: -5, // 살짝 위로 점프
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(jumpAnim, {
                    toValue: 0, // 원래 위치로 복귀
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    // 첫 번째 진행 바의 너비 (0% → 100%)
    const firstWidthInterpolated = firstProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    // 두 번째 진행 바의 너비 (0% → 100%)
    const secondWidthInterpolated = secondProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <Text style={styles.mainText}>{t('autoAdaptLoading.analyzing')}</Text>
            {/* ✅ 진행 바 컨테이너 */}
            <View style={styles.progressBarContainer}>
                {/* 첫 번째 바 (2초) */}
                <Animated.View style={[styles.progressBarFirst, { width: firstWidthInterpolated }]} />
                {/* 두 번째 바 (18초) - 첫 번째 바 위에 덮어 씌움 */}
                <Animated.View style={[styles.progressBarSecond, { width: secondWidthInterpolated }]} />
            </View>

            <Text style={{ color: 'white', fontWeight: 'bold' }}>{t('autoAdaptLoading.findingOptimalWorkout')}</Text>

            <Animated.View style={[styles.jump, { transform: [{ translateY: jumpAnim }] }]}>
                <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.detailText}>{currentMessage}</Text>
                </Animated.View>

                <Animated.View style={[styles.dotContainer, { opacity: fadeAnim }]}>
                    <View style={styles.dot} />
                    <View style={styles.smallDot} />
                </Animated.View>

                <Image 
                    source={require('../../../src/assets/Lodding.png')} 
                    style={styles.loadingImage}
                />
            </Animated.View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    mainText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 7,
    },
    detailText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },

    messageContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 15,
    },
    dotContainer: {
        alignItems: 'center',
        marginTop: 3,
    },
    dot: {
        width: 20,
        height: 5,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    smallDot: {
        width: 5,
        height: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 3,
    },
    loadingImage: {
        width: 48,
        height: 43,
        marginTop: 10,
    },
    jump:{
        alignItems:'center',
        marginTop: 30
    },

    progressBarContainer: {
        width: '80%',
        height: 6,
        backgroundColor: 'rgba(0, 191, 255, 0.3)', 
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
        position: 'relative',
    },
    progressBarFirst: {
        position: 'absolute',
        height: '100%',
        backgroundColor: 'lightgray', 
    },
    progressBarSecond: {
        position: 'absolute',
        height: '100%',
        backgroundColor: '#4DA6FF',
    },
});

export default AutoAdaptLoading;
