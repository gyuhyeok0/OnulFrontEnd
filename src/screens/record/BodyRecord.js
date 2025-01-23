import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadBodyRecordsForDate } from '../../apis/RecordApi';
import { selectBodyDataByDate } from '../../modules/BodySlice';

const BodyRecord = ({ selectDates, memberId }) => {
    const dispatch = useDispatch();

    const dateKey = selectDates;
    const todayBodyData = useSelector((state) => selectBodyDataByDate(state, dateKey));

    const [weightUnit, setWeightUnit] = useState('kg');

    useEffect(() => {
        if (!todayBodyData || Object.keys(todayBodyData).length === 0) {
            console.log("신체 기록이 없어서 디스패치 실행");
            dispatch(loadBodyRecordsForDate(memberId, selectDates));
        }
    }, [selectDates, memberId]);

    useEffect(() => {
        console.log("업데이트된 오늘의 신체 기록:", todayBodyData);
    }, [todayBodyData]);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const unitKg = await AsyncStorage.getItem('weightUnit');
                setWeightUnit(unitKg || 'kg');
            } catch (error) {
                console.error('Error fetching units:', error);
            }
        };

        fetchUnits();
    }, []);

    const renderWeight = (weightKg, weightLbs) => {
        return weightUnit === 'kg' ? weightKg : weightLbs;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>신체기록</Text>

            <View style={styles.recordsContainer}>
                <View style={styles.bodyRecordRow}>
                    <View style={styles.bodyRecordItem}>
                        <View style={[styles.circle, { backgroundColor: '#FF9FD4' }]}></View>
                        <Text style={styles.label}>체중</Text>
                        <View style={styles.valueContainer}>
                            <Text style={styles.value}>{renderWeight(todayBodyData?.weight, todayBodyData?.weightInLbs)}</Text>
                            <Text style={styles.unit}>{weightUnit}</Text>
                        </View>
                    </View>
                    <View style={styles.bodyRecordItem}>
                        <View style={[styles.circle, { backgroundColor: '#FF92D2' }]}></View>
                        <Text style={styles.label}>골격근량</Text>
                        <View style={styles.valueContainer}>
                            <Text style={styles.value}>{renderWeight(todayBodyData?.skeletalMuscleMass, todayBodyData?.skeletalMuscleMassInLbs)}</Text>
                            <Text style={styles.unit}>{weightUnit}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.bodyRecordRow}>
                    <View style={styles.bodyRecordItem}>
                        <View style={[styles.circle, { backgroundColor: '#FF85D0' }]}></View>
                        <Text style={styles.label}>체지방률</Text>
                        <View style={styles.valueContainer}>
                            <Text style={styles.value}>{todayBodyData?.bodyFatPercentage}</Text>
                            <Text style={styles.unit}>%</Text>
                        </View>
                    </View>
                    <View style={styles.bodyRecordItem}>
                        <View style={[styles.circle, { backgroundColor: '#FFABD6' }]}></View>
                        <Text style={styles.label}>체지방량</Text>
                        <View style={styles.valueContainer}>
                            <Text style={styles.value}>{renderWeight(todayBodyData?.bodyFatMass, todayBodyData?.bodyFatMassInLbs)}</Text>
                            <Text style={styles.unit}>{weightUnit}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222732',
        borderRadius: 15,
        padding: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    title: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    recordsContainer: {
        marginTop: 10,
    },
    bodyRecordRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    bodyRecordItem: {
        flex: 1,
        backgroundColor: '#333845',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: 6,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 5,
    },
    unit: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default BodyRecord;