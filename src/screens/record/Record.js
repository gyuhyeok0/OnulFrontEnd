import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Footer from '../common/Footer'; 
import Header from '../common/Header';
import { Calendar } from 'react-native-calendars';

const Record = ({ navigation }) => {
    const [markedDates, setMarkedDates] = useState({
        '2025-01-15': {
            dots: [
                { key: 'exercise', color: '#00adf5' }, // 운동 관련 마커
                { key: 'food', color: '#FF76CF' }, // 식단 관련 마커
                { key: 'body', color: '#FAF335' }, // 신체 관련 마커
            ],
        },
    });

    const [theme, setTheme] = useState({
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
    });

    const handleDayPress = (day) => {
        const newMarkedDates = {
            ...markedDates,
            [day.dateString]: {
                ...markedDates[day.dateString],
                selected: true,
                selectedColor: '#497CF4', // 선택된 날짜 배경색
                selectedTextColor: '#ffffff', // 선택된 날짜 텍스트 색상
            },
        };

        // 이전 선택 해제
        Object.keys(newMarkedDates).forEach((date) => {
            if (date !== day.dateString && newMarkedDates[date]?.selected) {
                delete newMarkedDates[date].selected;
                delete newMarkedDates[date].selectedColor;
                delete newMarkedDates[date].selectedTextColor;
            }
        });

        setMarkedDates(newMarkedDates);
        console.log('Selected date:', day.dateString);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: theme.backgroundColor }}>
            <Header title="Record" navigation={navigation} />
            
            <ScrollView style={{ padding: 15 }} keyboardShouldPersistTaps="handled">
                <Calendar
                    markedDates={markedDates}
                    onDayPress={handleDayPress}
                    style={styles.calendar}
                    theme={theme}
                    markingType="multi-dot" // 다중 마커 타입 사용
                    monthFormat="yyyy-MM" // 월 텍스트 형식 지정
                />
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
});

export default Record;
