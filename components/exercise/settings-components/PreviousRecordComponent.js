import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // useDispatch 가져오기

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons'; // Ionicons 사용
import AsyncStorage from '@react-native-async-storage/async-storage';

import { callFetchExercisesRecordAPI } from '../../../src/apis/ExerciseRecordAPI';

const DateChanger = ({ exercise, memberId, exerciseService }) => {
    const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD')); // 초기 날짜: 오늘
    const dispatch = useDispatch(); // useDispatch로 dispatch 초기화

    const exercisesRecord = useSelector((state) => state.exerciseRecord.exercisesRecord);

    useEffect(() => {
        if (exercisesRecord) {
            console.log("리듀서 selector", exercisesRecord);
        }
      }, [exercisesRecord]); // 데이터가 업데이트될 때마다 실행

    useEffect(() => {
        const fetchData = async () => {
            await selectFilter(currentDate);
        };
        fetchData();
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            await selectFilter(currentDate);
        };
        fetchData();
    }, []);
    
    const changeDate = (direction) => {
        const updatedDate = moment(currentDate)
            .add(direction === 'next' ? 1 : -1, 'days')
            .format('YYYY-MM-DD');

        setCurrentDate(updatedDate);
        selectFilter(updatedDate);
    };

    const handlePreviousDate = () => changeDate('prev');
    const handleNextDate = () => changeDate('next');

    const selectFilter = async (date) => {
        const exerciseId = exercise.id;
        const recordDate = date;
        const storageKey = `${exerciseId}_${memberId}_${exerciseService}_${recordDate}`;
        
        try {
            // AsyncStorage 데이터 확인
            const storedData = await AsyncStorage.getItem(storageKey);
            if (storedData) {
                console.log('Api 호출안합니다.');
                return; // API 호출 생략
            }
            
            // 스토리지에 데이터가 없으면 API 호출
            dispatch(callFetchExercisesRecordAPI(exerciseId, memberId, exerciseService, recordDate));
        } catch (error) {
            console.error('selectFilter 오류 발생:', error);
        }
    };
    
    

    return (
        <View style={styles.container}>
            <View style={styles.moment}>
                {/* 둥글둥글한 이전 날짜 아이콘 */}
                <TouchableOpacity onPress={handlePreviousDate} style={styles.iconButton}>
                    <Icon name="arrow-back-outline" size={21} color="#fff" />
                </TouchableOpacity>

                {/* 현재 날짜 */}
                <Text style={styles.dateText}>{currentDate}</Text>

                {/* 둥글둥글한 다음 날짜 아이콘 */}
                <TouchableOpacity onPress={handleNextDate} style={styles.iconButton}>
                    <Icon name="arrow-forward-outline" size={21} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, backgroundColor: 'red' }}>
                <Text
                    style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 11,
                        width: 30,
                        textAlign: 'center',
                        marginRight: 5,
                    }}
                >
                    SET
                </Text>
            </View>

            <View></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 198,
    },
    moment: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'gray'
    },
    dateText: {
        marginHorizontal: 15,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    iconButton: {
        // backgroundColor:'white',
        padding: 2, // 클릭 영역을 넓히기 위한 여백
    },
});

export default DateChanger;
