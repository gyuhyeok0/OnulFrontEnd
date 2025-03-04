import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadExerciseRecordsForDate } from '../../apis/ExerciseRecordAPI';
import { selectExerciseRecordByDate } from '../../modules/ExerciseRecordSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import { ActivityIndicator } from 'react-native'; // 로딩 스피너
import { useTranslation } from 'react-i18next';

const ExerciseRecord = ({ selectDates, memberId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [units, setUnits] = useState({ weightUnit: 'kg', heightUnit: 'cm' });
    const [parsedExerciseData, setParsedExerciseData] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchUnits = async () => {
            setLoading(true); // 로딩 시작
            try {
                const weightUnit = await AsyncStorage.getItem('weightUnit') || 'kg';
                const heightUnit = await AsyncStorage.getItem('heightUnit') || 'cm';
                setUnits({ weightUnit, heightUnit });
            } catch (error) {
                console.error('Error fetching units:', error);
            }   finally {
                setLoading(false); // 로딩 종료
            }
        };
            fetchUnits();
    }, []);

    useEffect(() => {
        console.log("초기화 및 디스패치 한번 실행");
        setParsedExerciseData([]);
    
        const fetchStoredDates = async () => {
            try {
                const dates = await loadExerciseRecordsForDate(memberId, selectDates);

                setParsedExerciseData(dates);

                console.log(dates);
            } catch (error) {
                console.error('previousRecordDate 호출 중 오류:', error);
            }
        };
    
        fetchStoredDates();
    }, [selectDates, memberId]);

    useEffect(() => {
        console.log(parsedExerciseData);
    }, [parsedExerciseData]);


    
    const renderExerciseRecords = (exerciseService, title) => {
        if (!parsedExerciseData || parsedExerciseData.length === 0) return null;
    
        // Filter exercises by exerciseService
        const exercises = parsedExerciseData.filter(
            (exercise) => exercise.exerciseService.toString() === exerciseService.toString()
        );
    
        if (exercises.length === 0) return null;
    
        // Group sets by exercise name
        const groupedExercises = exercises.reduce((acc, exercise) => {
            const exerciseName = exercise.exercise.exerciseName;
            if (!acc[exerciseName]) {
                acc[exerciseName] = [];
            }
            acc[exerciseName].push(exercise);
            return acc;
        }, {});
    
        return (
            <View style={styles.recordContainer}>
                <Text style={styles.recordTitle}>{t(title)}</Text>
                
                {Object.keys(groupedExercises).map((exerciseName) => (
                    <View key={exerciseName} style={styles.exerciseContainer}>
                        <Text style={styles.exerciseName}>{t(`exercisNames.${exerciseName}`)}</Text>
                        {groupedExercises[exerciseName]
                            .sort((a, b) => a.setNumber - b.setNumber) // Sort by set number
                            .map((exercise) => (
                                <View key={exercise.setNumber} style={styles.setContainer}>
                                    <Text style={styles.setTitle}>{exercise.setNumber} SET</Text>
                                    <View style={styles.setDetails}>
                                        {exercise.exerciseType === 1 && exercise.set.reps != null && (
                                            <>
                                                <Icon name="times" size={17} color="yellow" style={styles.icon} />
                                                <Text style={styles.setText}>{`${exercise.set.reps} reps`}</Text>
                                            </>
                                        )}
                                        {exercise.exerciseType === 2 && (
                                            <>
                                                {exercise.set.km != null && (
                                                    <View style={styles.inlineContainer}>
                                                        <Icon2 name="directions-run" size={17} color="#BBB" />
                                                        <Text style={styles.setText}>
                                                            {`${exercise.set.km} km`}
                                                        </Text>
                                                    </View>
                                                )}
                                                {exercise.set.time && (
                                                    <View style={styles.inlineContainer}>
                                                        <Icon2 name="access-time" size={17} color="#BBB" style={styles.icon} />
                                                        <Text style={styles.setText}>{exercise.set.time}</Text>
                                                    </View>
                                                )}
                                            </>
                                        )}
                                        {exercise.exerciseType === 3 && (
                                            <>
                                                {exercise.set.kg != null && (
                                                    <Text style={styles.setText}>
                                                        {units.weightUnit === 'lbs'
                                                            ? `${exercise.set.lbs} lbs`
                                                            : `${exercise.set.kg} kg`}
                                                    </Text>
                                                )}
                                                <Icon name="times" size={17} color="yellow" style={styles.icon} />
                                                {exercise.set.reps != null && (
                                                    <Text style={styles.setText}>{`${exercise.set.reps} reps`}</Text>
                                                )}
                                            </>
                                        )}
                                        {exercise.exerciseType === 4 && exercise.set.time && (
                                            <View style={styles.inlineContainer}>
                                                <Icon2 name="access-time" size={18} color="#BBB" />
                                                <Text style={styles.setText}>{exercise.set.time}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))}
                    </View>
                ))}
            </View>
        );
    };
    
    
    
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('exerciseRecord.title')}</Text>
            {renderExerciseRecords('1', t('exerciseRecord.customSchedule'))}
            {renderExerciseRecords('2', t('exerciseRecord.freeSchedule'))}
            {renderExerciseRecords('3', t('exerciseRecord.autoAdaptSchedule'))}
        </View>
    );
};

const commonStyles = {
    inlineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 10,
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 100,
        backgroundColor: '#1c1f26',
        borderRadius: 15,
        marginTop: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    recordContainer: {
        backgroundColor: '#282c34',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },
    recordTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    exerciseContainer: {
        marginBottom: 12,
        padding: 10,
        backgroundColor: '#333845',
        borderRadius: 8,
    },
    exerciseName: {
        color: '#33b8ff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    setContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        justifyContent: 'space-between',
    },
    setTitle: {
        color: '#BBB',
        fontWeight: '500',
        textAlign: 'center',
    },
    setText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    setDetails: {
        flexDirection: 'row',
    },
    ...commonStyles,
});

export default ExerciseRecord;

