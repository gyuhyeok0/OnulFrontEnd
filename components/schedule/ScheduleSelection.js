import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './ScheduleSelection.module';
import { deleteDataFromServer, sendDataToServer } from '../../src/apis/ScheduleAPI';
import { useDispatch, useSelector } from 'react-redux';
import { callFetchScheduleAPI } from '../../src/apis/ScheduleAPI';
import RegistExerciseModal from '../../src/screens/modal/scheduleModal/RegistExerciseModal';

const ScheduleSelection = ({ selectedWeekType, selectedDay, weekInfo }) => {
    const [memberId, setMemberId] = useState(null);
    const [selectedParts, setSelectedParts] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState('');

    const dispatch = useDispatch();
    const scheduleData = useSelector((state) => state.schedule || {});

    const chestExercises = useSelector((state) => state.chestExercises.myExercises || []);
    const backExercises = useSelector((state) => state.backExercises.myExercises || []);
    const lowerBodyExercises = useSelector((state) => state.lowerBodyExercises.myExercises || []);
    const shouldersExercises = useSelector((state) => state.shouldersExercises.myExercises || []);
    const absExercises = useSelector((state) => state.absExercises.myExercises || []);
    const armsExercises = useSelector((state) => state.armsExercises.myExercises || []);
    const aerobicExercises = useSelector((state) => state.etcExercises.myExercises || []);
    const customExercises = useSelector((state) => state.customExercises.myExercises || []);

    const bodyParts = ['가슴', '등', '하체', '어깨', '복근', '팔', '기타', '커스텀'];

    const filteredExercises = useMemo(() => {
        const activeParts = Object.keys(selectedParts).filter(part => selectedParts[part]);
        return activeParts.reduce((acc, part) => {
            switch (part) {
                case '가슴':
                    if (Array.isArray(chestExercises) && chestExercises.length > 0) acc.push(...chestExercises);
                    break;
                case '등':
                    if (Array.isArray(backExercises) && backExercises.length > 0) acc.push(...backExercises);
                    break;
                case '하체':
                    if (Array.isArray(lowerBodyExercises) && lowerBodyExercises.length > 0) acc.push(...lowerBodyExercises);
                    break;
                case '어깨':
                    if (Array.isArray(shouldersExercises) && shouldersExercises.length > 0) acc.push(...shouldersExercises);
                    break;
                case '복근':
                    if (Array.isArray(absExercises) && absExercises.length > 0) acc.push(...absExercises);
                    break;
                case '팔':
                    if (Array.isArray(armsExercises) && armsExercises.length > 0) acc.push(...armsExercises);
                    break;
                case '기타':
                    if (Array.isArray(aerobicExercises) && aerobicExercises.length > 0) acc.push(...aerobicExercises);
                    break;
                case '커스텀':
                    if (Array.isArray(customExercises) && customExercises.length > 0) acc.push(...customExercises);
                    break;
                default:
                    break;
            }
            return acc;
        }, []);
    }, [selectedParts, chestExercises, backExercises, lowerBodyExercises, shouldersExercises, absExercises, armsExercises, aerobicExercises, customExercises]);

    useEffect(() => {
        const fetchMemberId = async () => {
            try {
                const id = await AsyncStorage.getItem('memberId');
                if (id) setMemberId(id);
            } catch (error) {
                console.error('회원 ID를 가져오는 중 오류가 발생했습니다.', error);
            }
        };
        fetchMemberId();
    }, []);

    useEffect(() => {
        if (scheduleData.schedule) {
            const partsForSelectedDay = scheduleData.schedule
                .filter(item => item.day === selectedDay && item.weekType === selectedWeekType)
                .map(item => item.part);

            const updatedSelectedParts = bodyParts.reduce((acc, part) => {
                acc[part] = partsForSelectedDay.includes(part);
                return acc;
            }, {});

            setSelectedParts(updatedSelectedParts);
        }
    }, [scheduleData, selectedDay, selectedWeekType]);

    const openModal = useCallback((exercise) => {
        setSelectedExercise(exercise);
        setIsModalVisible(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setSelectedExercise('');
    }, []);

    const handlePress = useCallback(async (part) => {
        const isPartSelected = selectedParts[part];
        const updatedParts = { ...selectedParts, [part]: !isPartSelected };

        setSelectedParts(updatedParts);

        let hasExercisesForPart = false;

        switch (part) {
            case '가슴':
                hasExercisesForPart = Array.isArray(chestExercises) && chestExercises.length > 0;
                break;
            case '등':
                hasExercisesForPart = Array.isArray(backExercises) && backExercises.length > 0;
                break;
            case '하체':
                hasExercisesForPart = Array.isArray(lowerBodyExercises) && lowerBodyExercises.length > 0;
                break;
            case '어깨':
                hasExercisesForPart = Array.isArray(shouldersExercises) && shouldersExercises.length > 0;
                break;
            case '복근':
                hasExercisesForPart = Array.isArray(absExercises) && absExercises.length > 0;
                break;
            case '팔':
                hasExercisesForPart = Array.isArray(armsExercises) && armsExercises.length > 0;
                break;
            case '기타':
                hasExercisesForPart = Array.isArray(aerobicExercises) && aerobicExercises.length > 0;
                break;
            case '커스텀':
                hasExercisesForPart = Array.isArray(customExercises) && customExercises.length > 0;
                break;
            default:
                hasExercisesForPart = false;
        }

        if (memberId) {
            try {
                if (!isPartSelected) {
                    if (!hasExercisesForPart) {
                        Alert.alert(`${part} 운동 등록 필요`, `먼저 ${part} 운동을 등록해주세요.`, [
                            { text: "확인", onPress: () => console.log("확인 버튼 눌림") }
                        ]);
                        openModal(part);
                        setSelectedParts((prevParts) => ({ ...prevParts, [part]: false }));
                        return;
                    }
                    await sendDataToServer(part, memberId, selectedWeekType, selectedDay);
                } else {
                    await deleteDataFromServer(part, memberId, selectedWeekType, selectedDay);
                }
                dispatch(callFetchScheduleAPI());
            } catch (error) {
                console.error('서버와의 통신 중 오류 발생:', error);
            }
        } else {
            Alert.alert('회원 ID를 찾을 수 없습니다.');
        }
    }, [selectedParts, memberId, chestExercises, backExercises, lowerBodyExercises, shouldersExercises, absExercises, armsExercises, aerobicExercises, customExercises, selectedWeekType, selectedDay, dispatch, openModal]);

    return (
        <View style={styles.registration}>
            <Text style={styles.title}>{weekInfo} {selectedDay} 에 운동할 부위를 선택해 주세요.</Text>
            <View style={styles.buttonContainer}>
                {bodyParts.map((part) => (
                    <Pressable
                        key={part}
                        style={[
                            styles.button,
                            selectedParts[part] && styles.selectedButton
                        ]}
                        onPress={() => handlePress(part)}
                    >
                        <Text style={[
                            styles.buttonText,
                            selectedParts[part] && styles.selectedButtonText
                        ]}>
                            {part}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {filteredExercises.length > 0 && (
                <View style={styles.detailedType}>
                    <Text style={styles.detailTitle}>
                        등록된 운동목록입니다. ({filteredExercises.length}개)
                    </Text>

                    <View style={styles.detailExerciseList}>
                        {filteredExercises.map((exercise, index) => (
                            <Pressable key={exercise.id || index} style={styles.exerciseButton}>
                                <Text style={styles.exerciseButtonText}>{exercise.exerciseName}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <View style={{ width: 285, marginTop: 5 }}>
                        <Text style={{ fontSize: 11, color: '#F0F0F0', fontWeight: 'bold', textAlign: 'left' }}>
                            * 운동 수정은 아래의 운동 등록 섹션에서 변경해 주세요.
                        </Text>
                    </View>
                </View>
            )}

            <RegistExerciseModal isVisible={isModalVisible} onClose={closeModal} exercise={selectedExercise} />
        </View>
    );
};

export default ScheduleSelection;
