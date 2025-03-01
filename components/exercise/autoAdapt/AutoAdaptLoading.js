import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Image } from 'react-native';
import useCheckDateChange from '../../../src/hooks/useCheckDateChange';

const AutoAdaptLoading = () => {
    const { isDateChanged } = useCheckDateChange();
    const progress = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current; // 투명도 조절을 위한 애니메이션 값

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 1,
            duration: 10000, // 10초 동안 진행
            useNativeDriver: false,
        }).start();
    }, []);

    const widthInterpolated = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'], // 왼쪽에서 오른쪽으로 채워짐
    });

    const messages = [
        '최근 운동 기록을 불러오는 중...',
        '운동 피로도를 계산하는 중...',
        '운동 난이도를 설정하는 중...',
        '분할 루틴을 최적화하는 중...',
        '추천 운동을 분석하는 중...',
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

    return (
        <View style={styles.container}>
            <Text style={styles.mainText}>현재 Ai 분석중입니다</Text>
            <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, { width: widthInterpolated }]} />
            </View>
            <Text style={{color:'white', fontWeight:'bold'}}>내 몸에 맞는 최적의 운동을 찾는 중입니다</Text>

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
    progressBarContainer: {
        width: '80%',
        height: 6,
        backgroundColor: 'rgba(0, 191, 255, 0.3)', // DeepSkyBlue
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'white', // 로딩 바 색상
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
    }
});

export default AutoAdaptLoading;
