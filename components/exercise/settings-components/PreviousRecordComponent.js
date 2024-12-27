import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { previousRecordDate } from '../../../src/apis/PreviousRecordDate';
import { callFetchExercisesRecordAPI } from '../../../src/apis/ExerciseRecordAPI';
import { selectExerciseRecordByDetails } from '../../../src/modules/ExerciseRecordSlice';
import moment from 'moment';

import { deleteExerciseRecordSuccess} from '../../../src/modules/ExerciseRecordSlice'
import AsyncStorage from '@react-native-async-storage/async-storage';



const DateChanger = ({ exercise, memberId, exerciseService, kmUnit, weightUnit }) => {
    const [storedDates, setStoredDates] = useState([]);
    const [renderingDate, setRenderingDate] = useState(null);
    const [disablePrev, setDisablePrev] = useState(true);
    const [disableNext, setDisableNext] = useState(true);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    const dispatch = useDispatch();
    const exerciseId = exercise.id;

    const recordData = useSelector((state) =>
        selectExerciseRecordByDetails(state, exerciseId, exerciseService, renderingDate)
    );

    const today = moment().format('YYYY-MM-DD');

    useEffect(() => {
        const fetchStoredDates = async () => {
            try {
                const dates = await previousRecordDate(memberId, exerciseId, exerciseService);
                const filteredDates = dates.filter(date => date !== today);

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
        if (renderingDate) {
            setIsLoading(true); // 로딩 시작
            if (!recordData) {
                console.log("운동기록이 디스패치 합니다.")
                dispatch(callFetchExercisesRecordAPI(exerciseId, memberId, exerciseService, renderingDate))
                    .finally(() => setIsLoading(false)); // 로딩 끝
            } else {
                setIsLoading(false); // 로딩 끝
            }
        }
    }, [recordData, renderingDate, dispatch, exerciseId, memberId, exerciseService]);

    const changeDate = (direction) => {
        if (storedDates.length === 0) return;

        const currentIndex = storedDates.indexOf(renderingDate);
        const updatedIndex =
            direction === 'next'
                ? Math.max(currentIndex - 1, 0)
                : Math.min(currentIndex + 1, storedDates.length - 1);

        setRenderingDate(storedDates[updatedIndex]);
    };

    
    const renderRow = () => {
    
        const exerciseType = recordData[0].exerciseType; // 첫 번째 데이터의 exerciseType 사용

        return (
            <View style={{flexDirection: 'row', gap:5, marginBottom: 5 }}>
                <View style={{width: 30}}>
                    <Text style={styles.headerText}>SET</Text>
                </View>
                
                
                {exerciseType === 1 && (
                    <View style={{width: '40%'}}>
                        <Text style={styles.headerText}>횟수</Text>
                    </View>
                )}
                {exerciseType === 2 && (
                    <>
                        <View style={{width: '40%'}}>
                            <Text style={styles.headerText}>{kmUnit === 'km' ? 'km' : 'mi'}</Text>
                        </View>

                        <View style={{width: '40%'}}>

                            <Text style={styles.headerText}>시간</Text>
                        </View>
                    </>
                )}
                {exerciseType === 3 && (
                    <>
                        <View style={{width: '40%'}}>
                            <Text style={styles.headerText}>{weightUnit === 'kg' ? 'kg' : 'lbs'}</Text>
                        </View>

                        <View style={{width: '40%'}}>
                            <Text style={styles.headerText}>횟수</Text>
                        </View>
                    </>
                )}
                {exerciseType === 4 && (
                    <View style={{width: '40%'}}>
                        <Text style={styles.headerText}>시간</Text>
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
                    {renderingDate || moment(today).subtract(1, 'days').format('YYYY-MM-DD')}
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

                    {Object.values(recordData).filter((set) => set.set).map((set, index) => (
                        <View key={set.id} style={styles.setContainer}>
                            <View style={styles.setSection}>
                                <Text style={styles.recordText}>{index + 1}</Text>
                            </View>

                            {/* Exercise Type 1 */}
                            {set.exerciseType === 1 && (
                                <View style={styles.recordSection}>
                                    <Text style={styles.recordText}>{set.set?.reps || '-'}</Text>
                                </View>
                            )}

                            {/* Exercise Type 2 */}
                            {set.exerciseType === 2 && (
                                <>
                                    <View style={styles.recordSection}>
                                        {kmUnit === 'km' && (
                                            <Text style={styles.recordText}>{set.set?.km || '-'}</Text>
                                        )}
                                        {kmUnit === 'mi' && (
                                            <Text style={styles.recordText}>{set.set?.mi || '-'}</Text>
                                        )}
                                    </View>

                                    <View style={styles.recordSection}>
                                        <Text style={styles.recordText}>{set.set?.time || '-'}</Text>
                                    </View>
                                </>

                            )}
                            {/* Exercise Type 3 */}
                            {set.exerciseType === 3 && (
                                <>

                                    <View style={styles.recordSection}>
                                        {weightUnit === 'kg' && (
                                            <Text style={styles.recordText}>{set.set?.kg || '-'}</Text>
                                        )}
                                        {weightUnit === 'lbs' && (
                                            <Text style={styles.recordText}>{set.set?.lbs || '-'}</Text>
                                        )}
                                    </View>
                                    
                                    <View style={styles.recordSection}>
                                        <Text style={styles.recordText}>{set.set?.reps || '-'}</Text>
                                    </View>

                                </>
                            )}
                            {/* Exercise Type 4 */}
                            {set.exerciseType === 4 && (
                                <View style={styles.recordSection}>
                                    <Text style={styles.recordText}>{set.set?.time || '없음'}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.NonContainer}>
                    <Text style={styles.recordText}>운동 기록이 없습니다.</Text>
                </View>
            )}

                  <TouchableOpacity
                onPress={async () => {
                    try {
                        const recordDateString = renderingDate; // 날짜 포맷
                        const storageKey = `${exerciseId}_${exerciseService}_${recordDateString}`;

                        // Redux에서 데이터 삭제
                        dispatch(deleteExerciseRecordSuccess({
                            exerciseId,
                            exerciseService,
                            recordDate: recordDateString,
                        }));

                        // // AsyncStorage에서 데이터 삭제
                        await AsyncStorage.removeItem(storageKey);

                    } catch (error) {
                        console.error('운동 기록 삭제 중 오류 발생:', error);
                    }
                }}
            >
                <Text>특정 리듀서 밑 스토리지 삭제</Text>
            </TouchableOpacity>
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
