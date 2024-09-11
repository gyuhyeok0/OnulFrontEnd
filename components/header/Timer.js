import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from 'react-native-background-timer';
import IconTimer from 'react-native-vector-icons/Feather';  // 타이머 아이콘
import IconPlay from 'react-native-vector-icons/FontAwesome';  // 시작 아이콘
import IconStop from 'react-native-vector-icons/FontAwesome';  // 정지 아이콘
import IconPause from 'react-native-vector-icons/FontAwesome';  // 일시정지 아이콘

const MAX_TIME = 99 * 60000 + 59 * 1000 + 990; // 99:59.99 밀리초로 계산 (약 100분)

function Timer({ timerTime, isTimerRunning, setTimerTime, setIsTimerRunning }) {
    useEffect(() => {
        const handleAppStateChange = async (nextAppState) => {
            if (nextAppState === 'active') {
                const [storedTimerTime, storedTimerRunning, lastStoredTime] = await Promise.all([
                    AsyncStorage.getItem('timerTime'),
                    AsyncStorage.getItem('timerRunning'),
                    AsyncStorage.getItem('lastTime')
                ]);

                // 타이머 관련 데이터가 존재하지 않으면 복원하지 않음
                if (!storedTimerTime || !storedTimerRunning || !lastStoredTime) {
                    setTimerTime(0); // 초기화 상태로 설정
                    setIsTimerRunning(false);
                    return;
                }
    
                const parsedTimerTime = storedTimerTime ? parseInt(storedTimerTime, 10) : 0;
                const parsedLastTime = lastStoredTime ? parseInt(lastStoredTime, 10) : Date.now();
                const currentTime = Date.now();
                const elapsedTime = currentTime - parsedLastTime;
                const updatedTime = parsedTimerTime + elapsedTime;
    
                if (!isNaN(updatedTime)) {
                    setTimerTime(Math.min(updatedTime, MAX_TIME));
                }
    
                setIsTimerRunning(storedTimerRunning === 'true');
            } else if (nextAppState.match(/inactive|background/)) {
                // 1초 단위로 상태 저장하도록 제한
                if (isTimerRunning) {
                    await AsyncStorage.multiSet([
                        ['timerTime', timerTime.toString()],
                        ['timerRunning', isTimerRunning.toString()],
                        ['lastTime', Date.now().toString()]
                    ]);
                }
            }
        };
    
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription.remove();
    }, [isTimerRunning, timerTime]);  // 필요 상태에만 의존

    useEffect(() => {
        let id;
        let startTime = Date.now();  // 타이머 시작 시점 기록

        if (isTimerRunning && timerTime < MAX_TIME) {
            id = BackgroundTimer.setInterval(() => {
                const elapsed = Date.now() - startTime;  // 시작 시점부터 경과한 시간 계산
                setTimerTime((prevTime) => {
                    const newTime = prevTime + elapsed;
                    if (newTime >= MAX_TIME) {
                        BackgroundTimer.clearInterval(id);
                        return MAX_TIME;
                    }
                    return newTime;
                });
                startTime = Date.now();  
            }, 1000);

            return () => BackgroundTimer.clearInterval(id);  // 언마운트 시 타이머 정리
        }
    }, [isTimerRunning, timerTime]);

    const resetTimer = async () => {
        setIsTimerRunning(false);
        setTimerTime(0);
        await AsyncStorage.multiRemove(['timerTime', 'timerRunning', 'lastTime']);
    };

    // NaN 처리: timerTime이 NaN일 경우 0으로 초기화
    const displayTime = (time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);

        return isNaN(minutes) || isNaN(seconds)
            ? '00:00' // NaN일 경우 기본값으로 표시
            : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.timer}>
            <View style={{ flexDirection: 'row' }}>
                <IconTimer name="clock" size={21} color="white" />
                <Text style={{ color: 'white', fontSize: 18, marginHorizontal: 10, fontWeight: 'bold' }}>
                    {displayTime(timerTime)}
                </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={resetTimer} style={{ marginRight: 35 }}>
                    <IconStop name="stop" size={20} color={isTimerRunning || timerTime > 0 ? 'white' : 'gray'} />
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => setIsTimerRunning(!isTimerRunning)} 
                    style={{ marginRight: 5 }}
                >
                    {isTimerRunning ? (
                        <IconPause name="pause" size={20} color="white" />
                    ) : (
                        <IconPlay name="play" size={20} color={timerTime > 0 ? "white" : "gray"} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    timer: {
        backgroundColor: '#1A1C22',
        height: 53,
        padding: 15,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderTopColor: '#FFFFFF',
        borderBottomColor: '#FFFFFF',
    },
});

export default Timer;
