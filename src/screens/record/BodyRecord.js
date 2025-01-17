import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import Footer from '../common/Footer'; 
import Header from '../common/Header';
import { Calendar } from 'react-native-calendars';
import { isMonthDataExist } from '../../apis/RecordApi';
import { useDispatch, useSelector } from 'react-redux'; // useDispatch 가져오기
import { useFocusEffect } from '@react-navigation/native';
import Exercise from '../exercise/Exercise';
import { selectBodyDataByDate } from '../../modules/BodySlice';


const BodyRecord = ({selectDates}) => {
    
    const dispatch = useDispatch();

    const dateKey = selectDates;
    const bodyData = useSelector((state) => selectBodyDataByDate(state, dateKey));

    // console.log(bodyData);

    return (
        <View style={styles.container}>
            <Text style={{color:'white', fontSize:17, fontWeight:'bold'}}>신체기록</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 100,
        backgroundColor:'#222732',
        borderRadius: 15,
        marginTop: 10,
        padding:10
    },
    
});

export default BodyRecord;
