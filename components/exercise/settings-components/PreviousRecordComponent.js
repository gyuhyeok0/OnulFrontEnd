import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // useDispatch 가져오기

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/Ionicons'; // Ionicons 사용

import { callFetchExercisesRecordAPI } from '../../../src/apis/ExerciseRecordAPI';

const DateChanger = ({ exercise, memberId, exerciseService }) => {
    const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD')); // 초기 날짜: 오늘
    const dispatch = useDispatch(); // useDispatch로 dispatch 초기화

    const exercisesRecord = useSelector((state) => state.exerciseRecord.exercisesRecord);

    const [recordData, setRecordData] = useState(null); // 상태에 기록 데이터를 저장

    const exerciseId = exercise.id;


    
    useEffect(() => {
        
    }, []); 
    

    useEffect(() => {
        const fetchData = async () => {
            await selectFilter(currentDate);
        };
        fetchData();
    }, [currentDate]); // currentDate가 변경될 때마다 실행

    useEffect(() => {
        // exercisesRecord가 변경될 때마다 recordData를 업데이트
        const recordKey = `${exercise.id}_${memberId}_${exerciseService}_${currentDate}`;
        if (exercisesRecord && exercisesRecord[recordKey]) {
            setRecordData(exercisesRecord[recordKey]);
        }
    }, [exercisesRecord, currentDate]); // exercisesRecord와 currentDate가 변경될 때마다 실행
    
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
        const recordDate = date;
    
        console.log(recordData);
        try {
            // 상태에서 해당 키로 데이터가 있는지 확인
            const recordKey = `${exerciseId}_${memberId}_${exerciseService}_${recordDate}`;
            if (exercisesRecord && exercisesRecord[recordKey]) {
                console.log('리듀서에 이전 기록이 등록되어 있습니다.');
                // 해당 데이터를 상태에 저장하여 화면에 표시
                setRecordData(exercisesRecord[recordKey]);
                return; // 데이터가 이미 있으면 API 호출 생략
            }
    
            // 상태에 데이터가 없으면 API 호출
            const result = await dispatch(callFetchExercisesRecordAPI(exerciseId, memberId, exerciseService, recordDate));
    
            // 빈 배열인 경우 처리
            if (Array.isArray(result) && result.length === 0) {
                console.log('운동 기록이 없습니다.');
                setRecordData(null); // 운동 기록이 없을 때
            } else {
                // 운동 기록이 있을 때
                setRecordData(result);
            }
        } catch (error) {
            console.error('selectFilter 오류 발생:', error);
        }
    };
    

    return (
        <View style={styles.container}>

            {/* 날짜 형식 */}
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


            {/* 저장된 운동 기록을 화면에 출력 */}
            {recordData ? (
                <>
                
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

                <View style={styles.recordContainer}>
                    <Text style={styles.recordText}>운동 기록: {JSON.stringify(recordData)}</Text>
                </View>

                </>
            ) : (
                <View style={styles.recordContainer}>
                    <Text style={styles.recordText}>이전 기록이 없습니다.</Text>
                </View>
            )}
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
    recordContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    recordText: {
        fontSize: 14,
        color: '#333',
    },
});

export default DateChanger;
