import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, Pressable, Animated, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
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
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/FontAwesome5';

import { deleteDataFromServer, sendDataToServer } from '../../src/apis/ScheduleAPI'; 
import { callFetchScheduleAPI } from '../../src/apis/ScheduleAPI';

import AsyncStorage from '@react-native-async-storage/async-storage'; 
import RegistExerciseModal from '../../src/screens/modal/scheduleModal/RegistExerciseModal';

const OnSchedule = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [memberId, setMemberId] = useState(null);
    const scheduleData = useSelector(state => state.schedule?.schedule || []);
    const { isSwapped, todayIndex } = useCurrentWeekAndDay();
    const today = ['Su', 'Mn', 'Tu', 'Ws', 'Th', 'Fr', 'Sa'][todayIndex];
    const todayKorean = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][todayIndex];

    const chestExercises = useSelector(selectChestExercises);
    const backExercises = useSelector(selectBackExercises);
    const lowerBodyExercises = useSelector(selectLowerBodyExercises);
    const shouldersExercises = useSelector(selectShouldersExercises);
    const absExercises = useSelector(selectAbsExercises);
    const armsExercises = useSelector(selectArmsExercises);
    const aerobicExercises = useSelector(selectAerobicExercises);
    const customExercises = useSelector(selectCustomExercises);

    const [scheduleHeight, setScheduleHeight] = useState(0);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [animationHeight] = useState(new Animated.Value(0));

    const [selectedParts, setSelectedParts] = useState({});
    const [selectedWeekType, setSelectedWeekType] = useState();
    const [selectedDay, setSelectedDay] = useState();
    const [selectedExercise, setSelectedExercise] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        if (!scheduleData || scheduleData.needsUpdate) {
            dispatch(callFetchScheduleAPI());
        }

        const initialSelectedParts = scheduleData.reduce((acc, item) => {
            if (item.day === today) acc[item.part] = true;
            return acc;
        }, {});

        setSelectedParts(initialSelectedParts);
    }, [dispatch, scheduleData, today]);

    useEffect(() => {
        const fetchMemberId = async () => {
            try {
                const id = await AsyncStorage.getItem('memberId');
                if (id) setMemberId(id);
            } catch (error) {
                console.error('Error fetching memberId:', error);
            }
        };
        fetchMemberId();
    }, []);

    useEffect(() => {
        const currentWeekType = isSwapped ? 'twoWeek' : 'oneWeek';
        const today = ['Su', 'Mn', 'Tu', 'Ws', 'Th', 'Fr', 'Sa'][todayIndex];
        setSelectedWeekType(currentWeekType);
        setSelectedDay(today);
    }, [isSwapped, todayIndex]);

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
        if (!Array.isArray(exercises) || exercises.length === 0) return null;
        return exercises.map((exercise, index) => (
            <EachExercise key={exercise.id || index} exercise={exercise} />
        ));
    };

    const todaySchedules = React.useMemo(() => {
        const currentWeekType = isSwapped ? 'twoWeek' : 'oneWeek';
        return scheduleData.filter(item => item.day === today && item.weekType === currentWeekType);
    }, [scheduleData, today, isSwapped, refreshKey]);

    const handleRefresh = () => setRefreshKey(prevKey => prevKey + 1);

    const toggleVisibility = () => {
        setIsVisible(prevState => !prevState);
        Animated.timing(animationHeight, {
            toValue: isVisible ? 0 : 75,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const handlePress = useCallback(async (part) => {
        const isPartSelected = selectedParts[part];
        const updatedParts = { ...selectedParts, [part]: !isPartSelected };
        setSelectedParts(updatedParts);

        const exercises = exerciseMap[part];
        const hasExercisesForPart = Array.isArray(exercises) && exercises.length > 0;

        if (memberId) {
            try {
                if (!isPartSelected) {
                    if (!hasExercisesForPart) {
                        Alert.alert(`${part} 운동 등록 필요`, `먼저 ${part} 운동을 등록해주세요.`, [
                            { text: "확인", onPress: () => openModal(part) }
                        ]);
                        setSelectedParts(prev => ({ ...prev, [part]: false }));
                        return;
                    }
                    await sendDataToServer(part, memberId, selectedWeekType, selectedDay);
                } else {
                    await deleteDataFromServer(part, memberId, selectedWeekType, selectedDay);
                }
                dispatch(callFetchScheduleAPI());
            } catch (error) {
                console.error('Error communicating with the server:', error);
            }
        } else {
            Alert.alert('회원 ID를 찾을 수 없습니다.');
        }
    }, [selectedParts, memberId, chestExercises, backExercises, lowerBodyExercises, shouldersExercises, absExercises, armsExercises, aerobicExercises, customExercises, dispatch]);

    const openModal = useCallback((exercise) => {
        setSelectedExercise(exercise);
        setIsModalVisible(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setSelectedExercise('');
    }, []);

    return (
        <View style={[styles.container, { height: scheduleHeight + 250 }]}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Pressable style={styles.refreshButton} onPress={handleRefresh}>
                        <View style={styles.refreshInner}>
                            <Text style={styles.refreshText}>{todayKorean}</Text>
                            <Icon name="rotate-cw" size={15} color="white" style={styles.refreshIcon} />
                        </View>
                        <Text style={styles.refreshLabel}>운동</Text>
                    </Pressable>
                    <Pressable style={styles.caretButton} onPress={toggleVisibility}>
                        <Icon2 name={isVisible ? "caret-up" : "caret-down"} size={28} color="white" />
                    </Pressable>
                </View>
                <Animated.View style={[styles.hiddenContent, { height: animationHeight }]}>
                    {isVisible && (
                        <View style={styles.buttonContainer}>
                            {['가슴', '등', '하체', '어깨', '복근', '팔', '기타', '커스텀'].map(part => (
                                <Pressable
                                    key={part}
                                    style={[styles.button, selectedParts[part] && styles.selectedButton]}
                                    onPress={() => handlePress(part)}
                                >
                                    <Text style={[styles.buttonText, selectedParts[part] && styles.selectedButtonText]}>
                                        {part}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </Animated.View>
            </View>

            {todaySchedules.length > 0 ? (
                <View style={styles.schedule} onLayout={(event) => setScheduleHeight(event.nativeEvent.layout.height)}>
                    {todaySchedules.map((item, index) => (
                        <View key={index}>
                            {renderExerciseList(item.part)}
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.noSchedule}>
                    <Text style={styles.noScheduleText}>현재 스케쥴에 등록된 운동이 없습니다.</Text>
                    <Pressable style={styles.noScheduleButton} onPress={() => navigation.navigate('Schedule')}>
                        <Text style={styles.noScheduleButtonText}>스케쥴 등록하러 가기</Text>
                    </Pressable>
                </View>
            )}

            <RegistExerciseModal isVisible={isModalVisible} onClose={closeModal} exercise={selectedExercise} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
    },
    header: {
        minHeight: 40,
        backgroundColor: '#222732',
        borderRadius: 10,
        padding: 8,
        marginBottom: 15,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    refreshButton: {
        height: 30,
        flexDirection: 'row',
    },
    refreshInner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4A5569',
        padding: 6,
        borderRadius: 5,
    },
    refreshText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },
    refreshIcon: {
        marginLeft: 3,
    },
    refreshLabel: {
        color: '#C4C4C4',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 11,
        marginLeft: 4,
    },
    caretButton: {
        maxWidth: 200,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flex: 1,
    },
    hiddenContent: {
        overflow: 'hidden',
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        maxWidth: 350,
    },
    button: {
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 4,
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: '#fff',
    },
    selectedButton: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
    selectedButtonText: {
        color: '#000',
    },
    noSchedule: {
        width: '100%',
        marginBottom: 30,
        padding: 15,
    },
    noScheduleText: {
        fontSize: 13,
        color: '#F0F0F0',
    },
    noScheduleButton: {
        marginTop: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: '#4A7BF6',
        borderRadius: 10,
    },
    noScheduleButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default OnSchedule;

