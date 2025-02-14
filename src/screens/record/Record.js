import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import Footer from '../common/Footer'; 
import Header from '../common/Header';
import { Calendar } from 'react-native-calendars';
import { isMonthDataExist } from '../../apis/RecordApi';
import { useDispatch, useSelector } from 'react-redux'; // useDispatch 가져오기
import { useFocusEffect } from '@react-navigation/native';
import Exercise from '../exercise/Exercise';
import ExerciseRecord from './ExerciseRocord';
import FoodRecord from './FoodRecord';
import BodyRecord from './BodyRecord';

const Record = ({ navigation }) => {
    const dispatch = useDispatch();
    const memberId = useSelector((state) => state.member?.userInfo?.memberId);

    const [markedDates, setMarkedDates] = useState({});
    const [selectDates, setSelectDates] = useState({});
    const [mountMonth, setMountMonth] = useState();
    const [selectedDateData, setSelectedDateData] = useState({
        exerciseExists: undefined,
        foodExists: undefined,
        bodyExists: undefined,
    });

    // useFocusEffect에서 호출
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                if (mountMonth === undefined) {

                    
                    const today = new Date();
                    const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-01`;
                    
                    
                    setMountMonth(currentMonth);
                }
    
                if (mountMonth !== undefined) {
                    const responseData = await isMonthDataExist(memberId, mountMonth);
                    const updatedMarkedDates = {};
    
                    responseData.dayDataExists.forEach((day) => {
                        const date = day.date;
                        const dots = [];
    
                        if (day.exerciseDataExists) {
                            dots.push({ key: 'exercise', color: '#00adf5' });
                        }
    
                        if (day.foodDataExists) {
                            dots.push({ key: 'food', color: '#FF76CF' });
                        }
    
                        if (day.bodyDataExists) {
                            dots.push({ key: 'body', color: '#FAF335' });
                        }
    
                        if (dots.length > 0) {
                            updatedMarkedDates[date] = { dots };
                        }
                    });
    
                    setMarkedDates(updatedMarkedDates);
                }
            };
            fetchData();
        }, [mountMonth])
    );

    const handleDayPress = (day) => {
        const newMarkedDates = {
            ...markedDates,
            [day.dateString]: {
                ...markedDates[day.dateString],
                selected: true,
                selectedColor: '#497CF4',
                selectedTextColor: '#ffffff',
            },
        };

        Object.keys(newMarkedDates).forEach((date) => {
            if (date !== day.dateString && newMarkedDates[date]?.selected) {
                delete newMarkedDates[date].selected;
                delete newMarkedDates[date].selectedColor;
                delete newMarkedDates[date].selectedTextColor;
            }
        });

        setMarkedDates(newMarkedDates);
        // console.log('Selected date:', day.dateString);

        setSelectDates(day.dateString);

        // 선택한 날짜에 대한 운동기록, 식단기록, 신체기록의 존재 여부 확인
        const selectedDay = markedDates[day.dateString];
        const exerciseExists = selectedDay?.dots?.some(dot => dot.key === 'exercise');
        const foodExists = selectedDay?.dots?.some(dot => dot.key === 'food');
        const bodyExists = selectedDay?.dots?.some(dot => dot.key === 'body');

        // 상태 업데이트
        setSelectedDateData({
            exerciseExists,
            foodExists,
            bodyExists,
        });

        // console.log('운동기록 존재:', exerciseExists);
        // console.log('식단기록 존재:', foodExists);
        // console.log('신체기록 존재:', bodyExists);
    };

    const handleMonthChange = (month) => {
        const yearMonth = `${month.year}-${month.month < 10 ? '0' + month.month : month.month}-01`;
        setMountMonth(yearMonth);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#1A1C22' }}>
            <Header title="Record" navigation={navigation} />
            
            <ScrollView style={{ padding: 15 }} keyboardShouldPersistTaps="handled">
                <Calendar
                    markedDates={markedDates}
                    onDayPress={handleDayPress}
                    onMonthChange={handleMonthChange}
                    style={styles.calendar}
                    theme={{
                        backgroundColor: '#1A1C22', 
                        calendarBackground: '#222732',
                        dayTextColor: '#ffffff',
                        monthTextColor: '#ffffff',
                        textDisabledColor: '#5d616c',
                        todayTextColor: '#16D548',
                        arrowColor: '#ffffff',
                        selectedDayBackgroundColor: '#00adf5',
                        selectedDayTextColor: '#ffffff',
                        textDayFontWeight: 'bold',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: 'bold',
                    }}
                    markingType="multi-dot"
                    monthFormat="yyyy-MM"
                />

                <View style={styles.explanation}>
                    <View style={{ marginLeft: 15, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 8, height: 8, backgroundColor: '#00adf5', borderRadius: 10 }}></View>
                        <Text style={styles.explanationText}>운동기록</Text>
                        <View style={{ width: 8, height: 8, backgroundColor: '#FAF335', borderRadius: 10 }}></View>
                        <Text style={styles.explanationText}>식단기록</Text>
                        <View style={{ width: 8, height: 8, backgroundColor: '#FF76CF', borderRadius: 10 }}></View>
                        <Text style={styles.explanationText}>신체기록</Text>
                    </View>
                </View>

                <View style={{ marginTop: 15 }}>
                    {selectedDateData.exerciseExists === undefined && selectedDateData.foodExists === undefined && selectedDateData.bodyExists === undefined ? (
                        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 15 }}>
                            기록을 확인할 날짜를 선택해 주세요
                        </Text>
                    ) : (
                        <>
                            {selectedDateData.exerciseExists && <ExerciseRecord selectDates={selectDates} memberId={memberId} />}
                            {selectedDateData.foodExists && <FoodRecord selectDates={selectDates} memberId={memberId} />}
                            {selectedDateData.bodyExists && <BodyRecord selectDates={selectDates} memberId={memberId} />}
                        </>
                    )}
                </View>

                <View style={{height: 50}}>
                                
                </View>
            </ScrollView>

            <Footer navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    calendar: {
        borderRadius: 15,
        padding: 5,
        paddingBottom: 10,
    },

    explanation: {
        backgroundColor: '#222732',
        height: 30,
        marginTop: 5,
        borderRadius: 13,
        justifyContent: 'center',
    },

    explanationText: {
        color: 'white',
        margin: 5,
        fontWeight: 'bold',
        marginRight: 10,
    },
});

export default Record;