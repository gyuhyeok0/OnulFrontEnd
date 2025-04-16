import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Platform } from 'react-native';
import Footer from '../common/Footer'; 
import Header from '../common/Header';
import { Calendar } from 'react-native-calendars';
import { isMonthDataExist } from '../../apis/RecordApi';
import { useDispatch, useSelector } from 'react-redux'; 
import { useFocusEffect } from '@react-navigation/native';
import ExerciseRecord from './ExerciseRocord';
import FoodRecord from './FoodRecord';
import BodyRecord from './BodyRecord';
import { useTranslation } from 'react-i18next';

import Rate from 'react-native-rate';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REVIEW_KEY = 'last_review_shown_date';
const REVIEW_THRESHOLD_COUNT = 5;
const REVIEW_DAYS_INTERVAL = 14;

const Record = ({ navigation }) => {
    const { t, i18n } = useTranslation();

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
    const [dayPressed, setDayPressed] = useState(false);

    const showReviewPopup = () => {
        console.log('[리뷰팝업] 2.5초 뒤 팝업 실행');
    
        if (!Rate || typeof Rate.rate !== 'function') {
            console.warn('[리뷰팝업] Rate 모듈이 제대로 연결되지 않았습니다.');
            return;
        }
    
        const options = {
            AppleAppID: '6742204496', 
            preferInApp: true,
        };
    
        if (Platform.OS === 'ios') {
            console.log('[리뷰팝업] iOS - 리뷰 요청 실행');
            Rate.rate(options, (success) => {
                if (success) {
                    AsyncStorage.setItem(REVIEW_KEY, new Date().toISOString());
                    console.log('[리뷰팝업] 사용자가 리뷰 전송 완료');
                } else {
                    console.log('[리뷰팝업] 리뷰 요청 취소 또는 실패');
                }
            });
        } else {
            console.log('[리뷰팝업] Android - 리뷰 요청 생략됨');
        }
    };
    
    const checkAndShowReview = async (recordCount) => {
        console.log(`[리뷰체크] 이번 달 기록 횟수: ${recordCount}`);
    
        if (recordCount < REVIEW_THRESHOLD_COUNT) {
            console.log('[리뷰체크] 기록 횟수 부족으로 리뷰 팝업 생략');
            return;
        }
    
        const lastShown = await AsyncStorage.getItem(REVIEW_KEY);
        const today = new Date();
    
        if (!lastShown) {
            console.log('[리뷰체크] 리뷰 팝업 최초 실행 조건 만족 → 8.5초 후 실행');
            setTimeout(showReviewPopup, 8500);
            return;
        }
    
        const lastDate = new Date(lastShown);
        const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    
        console.log(`[리뷰체크] 마지막 리뷰 요청일: ${lastDate.toISOString()} → ${daysDiff}일 경과`);
    
        if (daysDiff >= REVIEW_DAYS_INTERVAL) {
            console.log('[리뷰체크] 날짜 조건 만족 → 5.5초 후 실행');
            setTimeout(showReviewPopup, 5500);
        } else {
            console.log('[리뷰체크] 날짜 조건 미달 → 리뷰 팝업 생략');
        }
    };

    useEffect(() => {
        const fetchReviewData = async () => {
          if (!dayPressed) return;
      
          const today = new Date();
          const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-01`;
      
          const responseData = await isMonthDataExist(memberId, currentMonth);
      
          const recordCount = responseData.dayDataExists.filter(d =>
            d.exerciseDataExists || d.foodDataExists || d.bodyDataExists
          ).length;
      
          checkAndShowReview(recordCount);
        };
      
        fetchReviewData();
      }, [dayPressed]);
      

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
        
                    if (day.exerciseDataExists) dots.push({ key: 'exercise', color: '#00adf5' });
                    if (day.foodDataExists) dots.push({ key: 'food', color: '#FF76CF' });
                    if (day.bodyDataExists) dots.push({ key: 'body', color: '#FAF335' });
        
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
        console.log('[디버그] 날짜 선택됨');
        setDayPressed(true);

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
        setSelectDates(day.dateString);

        const selectedDay = markedDates[day.dateString];
        const exerciseExists = selectedDay?.dots?.some(dot => dot.key === 'exercise');
        const foodExists = selectedDay?.dots?.some(dot => dot.key === 'food');
        const bodyExists = selectedDay?.dots?.some(dot => dot.key === 'body');

        setSelectedDateData({
            exerciseExists,
            foodExists,
            bodyExists,
        });
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
                    monthFormat={i18n.language === 'en' ? 'MMMM yyyy' : 'yyyy-MM'}
                />

                <View style={styles.explanation}>
                    <View style={{ marginLeft: 15, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <View style={{ width: 8, height: 8, backgroundColor: '#00adf5', borderRadius: 10 }}></View>
                            <Text style={styles.explanationText}>{t('record.exercise')}</Text>
                        </View>
                        
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <View style={{ width: 8, height: 8, backgroundColor: '#FF76CF', borderRadius: 10 }}></View>
                            <Text style={styles.explanationText}>{t('record.food')}</Text>
                        </View>

                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <View style={{ width: 8, height: 8, backgroundColor: '#FAF335', borderRadius: 10 }}></View>
                            <Text style={styles.explanationText}>{t('record.body')}</Text>
                        </View>
                    </View>
                </View>

                <View style={{ marginTop: 15 }}>
                    {selectedDateData.exerciseExists === undefined && selectedDateData.foodExists === undefined && selectedDateData.bodyExists === undefined ? (
                        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 15 }}>
                            {t('record.selectDate')}
                        </Text>
                    ) : (
                        <>
                            {selectedDateData.exerciseExists && <ExerciseRecord selectDates={selectDates} memberId={memberId} />}
                            {selectedDateData.foodExists && <FoodRecord selectDates={selectDates} memberId={memberId} />}
                            {selectedDateData.bodyExists && <BodyRecord selectDates={selectDates} memberId={memberId} />}
                        </>
                    )}
                </View>

                <View style={{height: 50}} />
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
        marginTop: 5,
        borderRadius: 13,
        justifyContent: 'center',
        padding: 5
    },

    explanationText: {
        color: 'white',
        margin: 5,
        fontWeight: 'bold',
        marginRight: 10,
    },
});

export default Record;
