import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import useCheckDateChange from '../../../src/hooks/useCheckDateChange';

const AutoAdaptLoading = () => {
    const { isDateChanged } = useCheckDateChange();
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 1,
            duration: 8000, // 8초 동안 진행
            useNativeDriver: false,
        }).start();
    }, []);

    const widthInterpolated = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'], // 왼쪽에서 오른쪽으로 채워짐
    });

    return (
        <View style={styles.container}>
            <Text style={styles.mainText}>현재 Ai 분석중입니다</Text>
            <View style={styles.progressBarContainer}>
                <Animated.View style={[styles.progressBar, { width: widthInterpolated }]} />
            </View>
            <Text style={styles.detailText}>잠시만 기다려주세요</Text>

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
        marginBottom: 15,
    },
    detailText: {
        color: 'white',
        fontSize: 15,
        margin: 5,
        textAlign: 'center',
        marginBottom: 20,
    },
    progressBarContainer: {
        width: '80%',
        height: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // 배경 바
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50', // 로딩 바 색상
    },
});

export default AutoAdaptLoading;