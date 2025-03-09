import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadFoodRecordsForDate } from '../../apis/RecordApi';
import { selectTodayFoodData } from '../../modules/TotalFoodSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const FoodRecord = ({ selectDates, memberId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const dateKey = selectDates;
    const [unit, setUnit] = useState('g'); // 기본 단위는 'g'

    // Redux에서 오늘 날짜 기준 데이터를 조회
    const todayFoodData = useSelector((state) => selectTodayFoodData(state, dateKey));

    useEffect(() => {
        const isToday = (date) => {
            const today = new Date();
            const selectedDate = new Date(date);

            return (
                today.getFullYear() === selectedDate.getFullYear() &&
                today.getMonth() === selectedDate.getMonth() &&
                today.getDate() === selectedDate.getDate()
            );
        };

        if (isToday(selectDates)) {
            if (!todayFoodData || Object.keys(todayFoodData).length !== 4) {
                dispatch(loadFoodRecordsForDate(memberId, selectDates));
            }
        } else {
            if (!todayFoodData || Object.keys(todayFoodData).length === 0) {
                dispatch(loadFoodRecordsForDate(memberId, selectDates));
            }
        }
    }, [selectDates, memberId]);

    useFocusEffect(
        useCallback(() => {
            const fetchUnit = async () => {
                try {
                    let storedUnit = await AsyncStorage.getItem('gOrOzUnit');

                    if (!storedUnit) {
                        const weightUnit = await AsyncStorage.getItem('weightUnit');
                        storedUnit = weightUnit === 'lbs' ? 'oz' : 'g';
                        await AsyncStorage.setItem('gOrOzUnit', storedUnit);
                    }

                    setUnit(storedUnit);
                } catch (error) {
                    console.error('Failed to fetch unit:', error);
                }
            };

            fetchUnit();
        }, []) // 빈 배열이므로 종속성 변화 없이 매번 실행
    );


    const convertValue = (value, unit) => {
        if (unit === 'oz') {
            return parseFloat((value / 28.3495).toFixed(2)); // g -> oz 변환 후 소수점 뒤 0 제거
        }
        return parseFloat(value); // 기본 g 단위 그대로 반환 (소수점 뒤 0 제거)
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('foodRecord.title')}</Text>
    
            {todayFoodData && todayFoodData.length > 0 ? (
                todayFoodData.map((food, index) => (
                    <View key={index} style={styles.foodRecord}>
                        <Text style={styles.mealType}>{t(`foodRecord.${food.mealType}`)}</Text>
                        <Text style={styles.recipeNames}>• {t('foodRecord.recipe')}: {food.recipeNames.join(', ')}</Text>
                        <View style={styles.nutritionContainer}>
                            <Text style={styles.nutritionLabel}>{t('foodRecord.totalQuantity')}:</Text>
                            <Text style={styles.nutritionValue}>{convertValue(food.totalNutrition.grams, unit)} {unit}</Text>
                        </View>
                        <View style={styles.nutritionContainer}>
                            <Text style={styles.nutritionLabelPlus}>{t('foodRecord.calories')}:</Text>
                            <Text style={styles.nutritionValuePlus}>{food.totalNutrition.kcal} kcal</Text>
                        </View>
                        <View style={styles.nutritionContainer}>
                            <Text style={styles.nutritionLabelPlus}>{t('foodRecord.protein')}:</Text>
                            <Text style={styles.nutritionValuePlus}>{convertValue(food.totalNutrition.protein, unit)} {unit}</Text>
                        </View>
                        <View style={styles.nutritionContainer}>
                            <Text style={styles.nutritionLabel}>{t('foodRecord.carbs')}:</Text>
                            <Text style={styles.nutritionValue}>{convertValue(food.totalNutrition.carbs, unit)} {unit}</Text>
                        </View>
                        <View style={styles.nutritionContainer}>
                            <Text style={styles.nutritionLabel}>{t('foodRecord.fat')}:</Text>
                            <Text style={styles.nutritionValue}>{convertValue(food.totalNutrition.fat, unit)} {unit}</Text>
                        </View>
                    </View>
                ))
            ) : (
                <Text style={styles.noDataText}>{t('foodRecord.noRecords')}</Text>
            )}
        </View>
    );
};    

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 100,
        backgroundColor: '#222732',
        borderRadius: 15,
        marginTop: 10,
        padding: 15,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        paddingBottom: 5,
    },
    foodRecord: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#333845',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    mealType: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    recipeNames: {
        color: 'white',
        fontSize: 16,
        marginBottom: 10,
    },
    nutritionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    nutritionLabel: {
        color: '#BBB',
        fontSize: 14,
    },
    nutritionValue: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    noDataText: {
        color: 'gray',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },

    nutritionLabelPlus: {
        color: 'white',
        fontWeight:'bold',
        fontSize: 14,
    },

    nutritionValuePlus: {
        color: '#FFECB3',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default FoodRecord;
