import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { previousRecordDate } from '../../../src/apis/PreviousRecordDate';
import { callFetchExercisesRecordAPI, fetchExercisesRecord } from '../../../src/apis/ExerciseRecordAPI';
import { selectExerciseRecordByDetails } from '../../../src/modules/ExerciseRecordSlice';
import moment from 'moment';

import { deleteExerciseRecordSuccess} from '../../../src/modules/ExerciseRecordSlice'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';



const DateChanger = ({ exercise, memberId, exerciseService, kmUnit, weightUnit }) => {

    const { t, i18n } = useTranslation();  // ✅ useTranslation 사용
    const [storedDates, setStoredDates] = useState([]);
    const [renderingDate, setRenderingDate] = useState(null);
    const [disablePrev, setDisablePrev] = useState(true);
    const [disableNext, setDisableNext] = useState(true);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    const [recordData, setRecordData] = useState([]); // 로딩 상태 추가


    const dispatch = useDispatch();
    const exerciseId = exercise.id;


    const today = moment();

    useEffect(() => {
        const fetchStoredDates = async () => {
            try {
                const dates = await previousRecordDate(memberId, exerciseId, exerciseService);

                // 🔥 오늘 날짜를 현재 설정된 언어에 맞춰 변환
                const todayFormatted = formatDate(moment()); 
                const filteredDates = dates.filter(date => formatDate(date) !== todayFormatted);

                setStoredDates(filteredDates);
                if (filteredDates.length > 0) {
                    setRenderingDate(filteredDates[0]);
                }
            } catch (error) {
                // console.error('previousRecordDate 호출 중 오류:', error);
            } finally {
                setIsLoading(false); // 로딩 종료
            }
        };

        fetchStoredDates();
    }, [exerciseId, memberId, exerciseService]);

    useEffect(() => {
        if (renderingDate !== null) {
            const currentIndex = storedDates.indexOf(renderingDate);
            setDisablePrev(currentIndex >= storedDates.length - 1);
            setDisableNext(currentIndex <= 0);
        }
    }, [renderingDate, storedDates]);


    useEffect(() => {
        const fetchExerciseRecord = async () => {
            try {
                const result = await fetchExercisesRecord(exerciseId, memberId, exerciseService, renderingDate);

                // console.log("운동 기록 가져온 결과:", result);
                // 결과에 대해 추가적인 로직을 여기서 처리할 수 있습니다.

                setRecordData(result);
            } catch (error) {
                console.error('운동 기록 가져오기 중 오류 발생:', error);
            }
        };

        fetchExerciseRecord();
    }, [renderingDate, exerciseId, memberId, exerciseService]);

    const changeDate = (direction) => {
        if (storedDates.length === 0) return;

        const currentIndex = storedDates.indexOf(renderingDate);
        const updatedIndex =
            direction === 'next'
                ? Math.max(currentIndex - 1, 0)
                : Math.min(currentIndex + 1, storedDates.length - 1);

        setRenderingDate(storedDates[updatedIndex]);
    };

    // 🔥 날짜 포맷 변환 함수
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(i18n.language);
    };
    

    
    const renderRow = () => {

        if (!recordData || recordData.length === 0 || !recordData[0]) {
            console.warn('recordData가 비어있거나 유효하지 않습니다.');
            return null;
        }
    
        const exerciseType = recordData[0]?.exerciseType; // 안전하게 접근
    
        return (
            <View style={{flexDirection: 'row', gap:5, marginBottom: 5 }}>
                <View style={{width: 30}}>
                    <Text style={styles.headerText}>SET</Text>
                </View>
                
                
                {exerciseType === 1 && (
                    <View style={{width: '40%'}}>
                        <Text style={styles.headerText}>{t('EachExercise.reps')}</Text>
                    </View>
                )}
                {exerciseType === 2 && (
                    <>
                        <View style={{width: '40%'}}>
                            <Text style={styles.headerText}>{kmUnit === 'km' ? 'km' : 'mi'}</Text>
                        </View>

                        <View style={{width: '40%'}}>

                            <Text style={styles.headerText}>{t('EachExercise.time')}</Text>
                        </View>
                    </>
                )}
                {exerciseType === 3 && (
                    <>
                        <View style={{width: '40%'}}>
                            <Text style={styles.headerText}>{weightUnit === 'kg' ? 'kg' : 'lbs'}</Text>
                        </View>

                        <View style={{width: '40%'}}>
                            <Text style={styles.headerText}>{t('EachExercise.reps')}</Text>
                        </View>
                    </>
                )}
                {exerciseType === 4 && (
                    <View style={{width: '40%'}}>
                        <Text style={styles.headerText}>{t('EachExercise.time')}</Text>
                    </View>
                )}
            </View>
        );
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.moment}>
                <TouchableOpacity
                    onPress={() => changeDate('prev')}
                    style={[styles.iconButton, disablePrev && styles.disabledButton]}
                    disabled={disablePrev}
                >
                    <Icon name="arrow-back-outline" size={21} color={disablePrev ? 'gray' : '#fff'} />
                </TouchableOpacity>
                <Text style={renderingDate ? styles.dateText : styles.nonDateText}>
                    {formatDate(renderingDate || today.subtract(1, 'days'))}
                </Text>
                
                <TouchableOpacity
                    onPress={() => changeDate('next')}
                    style={[styles.iconButton, disableNext && styles.disabledButton]}
                    disabled={disableNext}
                >
                    <Icon name="arrow-forward-outline" size={21} color={disableNext ? 'gray' : '#fff'} />
                </TouchableOpacity>
            </View>
            {isLoading ? (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            ) : recordData && Object.keys(recordData).length > 0 ? (
                <View style={styles.recordContainer}>

                    {renderRow()}

                    {Object.values(recordData).filter((set) => set?.set).map((set, index) => (
                        <View key={set.id} style={styles.setContainer}>
                            <View style={styles.setSection}>
                                <Text style={styles.recordText}>{index + 1}</Text>
                            </View>

                            {/* Exercise Type 1 */}
                            {set.exerciseType === 1 && (
                                <View style={styles.recordSection}>
                                    <Text style={styles.recordText}>{set?.set?.reps || '-'}</Text>
                                </View>
                            )}

                            {/* Exercise Type 2 */}
                            {set.exerciseType === 2 && (
                                <>
                                    <View style={styles.recordSection}>
                                        {kmUnit === 'km' && (
                                            <Text style={styles.recordText}>{set?.set?.km || '-'}</Text>
                                        )}
                                        {kmUnit === 'mi' && (
                                            <Text style={styles.recordText}>{set?.set?.mi || '-'}</Text>
                                        )}
                                    </View>

                                    <View style={styles.recordSection}>
                                        <Text style={styles.recordText}>{set?.set?.time || '-'}</Text>
                                    </View>
                                </>
                            )}
                            {/* Exercise Type 3 */}
                            {set.exerciseType === 3 && (
                                <>

                                    <View style={styles.recordSection}>
                                        {weightUnit === 'kg' && (
                                            <Text style={styles.recordText}>{set?.set?.kg || '-'}</Text>
                                        )}
                                        {weightUnit === 'lbs' && (
                                            <Text style={styles.recordText}>{set?.set?.lbs || '-'}</Text>
                                        )}
                                    </View>

                                    <View style={styles.recordSection}>
                                        <Text style={styles.recordText}>{set?.set?.reps || '-'}</Text>
                                    </View>

                                </>
                            )}
                            {/* Exercise Type 4 */}
                            {set.exerciseType === 4 && (
                                <View style={styles.recordSection}>
                                    <Text style={styles.recordText}>{set?.set?.time || t('exerciseRecords.none')}</Text>
                                </View>
                            )}
                        </View>
                    ))}

                </View>
            ) : (
                <View style={styles.NonContainer}>
                    <Text style={styles.recordText}>{t('exerciseRecords.noRecord')}</Text>
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
    },
    dateText: {
        marginHorizontal: 15,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    nonDateText: {
        color: 'gray',
        marginHorizontal: 15,
        fontSize: 16,
        fontWeight: 'bold',
    },
    iconButton: {
        padding: 2,
    },
    disabledButton: {
        opacity: 0.5,
    },
    recordContainer: {
        // backgroundColor:'red',
        marginTop: 5,
        flex: 1,
    },
    recordText: {
        fontSize: 14,
        color: '#B0BEC5',
        textAlign: 'center',
        fontWeight: 'bold',
        paddingLeft: 10,
        paddingRight: 10
    },

    headerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'center',
    },

    setContainer: {
        flexDirection: 'row',
        gap: 5,
    },

    setSection: {
        minWidth: 30, 
        minHeight: 30, 
        justifyContent: 'center', 
        borderRadius: 5, 
        backgroundColor: '#525E77',
        marginBottom: 5,
    },

    recordSection: {
        minWidth: '40%', 
        minHeight: 30, 
        justifyContent: 'center', 
        borderRadius: 5, 
        // marginRight: 5,
        backgroundColor: '#525E77',
        marginBottom: 5,
    },

    NonContainer: {
        marginTop: 10
    },
});




export default DateChanger;