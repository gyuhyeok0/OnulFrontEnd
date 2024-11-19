import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useCurrentWeekAndDay } from '../../src/hooks/useCurrentWeekAndDay';
import { 
    selectChestExercises, 
    selectBackExercises, 
    selectLowerBodyExercises, 
    selectShouldersExercises, 
    selectAbsExercises, 
    selectArmsExercises, 
    selectAerobicExercises, 
    selectCustomExercises 
} from '../../src/selectors/selectors';

import EachExercise from './EachExercise';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


// 운동메뉴의 맞춤일정 코드
const OnSchedule = () => {
    const navigation = useNavigation();
    
    const scheduleData = useSelector((state) => state.schedule?.schedule || []);
    const { isSwapped, todayIndex } = useCurrentWeekAndDay();
    const days = ['Su', 'Mn', 'Tu', 'Ws', 'Th', 'Fr', 'Sa'];

    const chestExercises = useSelector(selectChestExercises);
    const backExercises = useSelector(selectBackExercises);
    const lowerBodyExercises = useSelector(selectLowerBodyExercises);
    const shouldersExercises = useSelector(selectShouldersExercises);
    const absExercises = useSelector(selectAbsExercises);
    const armsExercises = useSelector(selectArmsExercises);
    const aerobicExercises = useSelector(selectAerobicExercises);
    const customExercises = useSelector(selectCustomExercises);
    

    const todaySchedules = useMemo(() => {
        const today = days[todayIndex];
        const currentWeekType = isSwapped ? 'twoWeek' : 'oneWeek';
        return scheduleData.filter(
            (item) => item.day === today && item.weekType === currentWeekType
        );
    }, [scheduleData, days, todayIndex, isSwapped]);

    const [selectedExerciseId, setSelectedExerciseId] = useState(null); // 선택된 운동 ID 상태 추가

    useEffect(() => {
        if (todaySchedules.length > 0) {
            const currentWeekType = isSwapped ? 'twoWeek' : 'oneWeek';
            console.log(`오늘은 ${days[todayIndex]}요일이며, ${currentWeekType}에 속합니다.`);
        }
    }, [todaySchedules.length, days, todayIndex, isSwapped]);

    const exerciseMap = {
        '가슴': chestExercises,
        '등': backExercises,
        '하체': lowerBodyExercises,
        '어깨': shouldersExercises,
        '복근': absExercises,
        '팔': armsExercises,
        '기타': aerobicExercises,
        '커스텀': customExercises,
    };

    const renderExerciseList = (part) => {
        const exercises = exerciseMap[part];
        
        if (!Array.isArray(exercises) || exercises.length === 0) {
            return null; // 부위별 데이터가 없으면 null 반환
        }
    
        return exercises.map((exercise, index) => (
            <EachExercise 
                key={exercise.id || index} 
                exercise={exercise} 
                isSelected={selectedExerciseId === exercise.id} // 선택된 상태 전달
                onPress={() => setSelectedExerciseId(exercise.id)} // 선택된 운동 ID 설정
            />
        ));
    };

    const hasExercises = todaySchedules.some(item => {
        const exercises = exerciseMap[item.part];
        return Array.isArray(exercises) && exercises.length > 0;
    });

    return (
        <View style={styles.container}>
            {todaySchedules.length > 0 && hasExercises ? (
                <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                extraScrollHeight={20} // 키보드 위 여백
                enableOnAndroid={true} // Android에서도 작동하도록 설정
                >

                    <View style={styles.Schedule}>
                        {todaySchedules.map((item, index) => {
                            const exerciseList = renderExerciseList(item.part);
                            return exerciseList ? (
                                <View key={index}>
                                    {exerciseList}
                                </View>
                            ) : null; 
                        })}
                    </View>

                </KeyboardAwareScrollView>
            ) : (
                <View style={styles.noSchedule}>
                    <Text style={styles.noScheduleText}>현재 스케쥴에 등록된 운동이 없습니다.</Text>
                    <Pressable style={styles.button} onPress={() => navigation.navigate('Schedule')}>
                        <Text style={styles.buttonText}>스케쥴 등록하러 가기</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
    },

    noSchedule: {
        width: '100%',
        minHeight: 100,
        marginBottom: 30,
        padding: 15,
    },
    noScheduleText: {
        fontSize: 13,
        color: '#F0F0F0',
    },

    button: {
        marginTop: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: '#4A7BF6',
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    scheduleText: {
        fontSize: 15,
        color: '#333',
    },
});

export default OnSchedule;
