import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import Footer from '../common/Footer'; 
import Header from '../common/Header';
import { Calendar } from 'react-native-calendars';
import { isMonthDataExist } from '../../apis/RecordApi';
import { useDispatch, useSelector } from 'react-redux'; // useDispatch 가져오기
import { useFocusEffect } from '@react-navigation/native';
import Exercise from '../exercise/Exercise';
import { selectTodayFoodData } from '../../modules/TotalFoodSlice';

const FoodRecord = ({selectDates}) => {

    const dateKey = selectDates;
    // Redux에서 오늘 날짜 기준 데이터를 조회
    const todayFoodData = useSelector((state) => selectTodayFoodData(state, dateKey));
    
    // console.log(todayFoodData);
    
    return (
        <View style={styles.container}>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 100,
        backgroundColor:'#222732',
        borderRadius: 15,
        marginTop: 10
    },
    
});

export default FoodRecord;
