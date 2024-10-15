import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './ScheduleSelection.module';
import { deleteDataFromServer, sendDataToServer } from '../../src/apis/ScheduleAPI';
import { useDispatch, useSelector } from 'react-redux';  // Redux 사용
import { callFetchScheduleAPI } from '../../src/apis/ScheduleAPI';  // 서버로부터 스케줄 데이터를 다시 불러오기 위한 API

const ScheduleSelection = ({ selectedWeekType, selectedDay, weekInfo }) => {
    const [memberId, setMemberId] = useState(null);
    const [selectedParts, setSelectedParts] = useState({});
    const dispatch = useDispatch();  // dispatch 훅 사용
    const scheduleData = useSelector((state) => state.schedule);  // 스케줄 데이터 가져오기
    

    const bodyParts = ['가슴', '등', '하체', '어깨', '복근', '팔', '유산소', '커스텀'];

    useEffect(() => {
        const fetchMemberId = async () => {
            try {
                const id = await AsyncStorage.getItem('memberId');
                setMemberId(id);
            } catch (error) {
                console.error('회원 ID를 가져오는 중 오류가 발생했습니다.', error);
            }
        };

        fetchMemberId();
    }, []);

    // 요일과 주차 타입에 맞는 스케줄에 맞춰 selectedParts 상태 설정
    useEffect(() => {
        if (scheduleData && scheduleData.schedule) {
            const partsForSelectedDay = scheduleData.schedule
                .filter(item => item.day === selectedDay && item.weekType === selectedWeekType)
                .map(item => item.part);

            // 해당 부위들이 선택된 상태로 selectedParts를 설정
            const updatedSelectedParts = bodyParts.reduce((acc, part) => {
                acc[part] = partsForSelectedDay.includes(part);
                return acc;
            }, {});

            setSelectedParts(updatedSelectedParts);
        }
    }, [scheduleData, selectedDay, selectedWeekType]);

    const handlePress = async (part) => {
        const isPartSelected = selectedParts[part];
        const updatedParts = { ...selectedParts, [part]: !isPartSelected };
    
        setSelectedParts(updatedParts);
    
        if (memberId) {
            try {
                if (!isPartSelected) {
                    await sendDataToServer(part, memberId, selectedWeekType, selectedDay);
                } else {
                    await deleteDataFromServer(part, memberId, selectedWeekType, selectedDay);
                }
                
                // 서버와의 통신 후 스케줄을 다시 불러오기
                dispatch(callFetchScheduleAPI());
            } catch (error) {
                console.error('서버와의 통신 중 오류 발생:', error);
            }
        } else {
            Alert.alert('회원 ID를 찾을 수 없습니다.');
        }
    };

    return (
        <View style={styles.registration}>
            <Text style={styles.title}>{weekInfo} {selectedDay} 에 운동할 부위를 선택해 주세요.</Text>
            <View style={styles.buttonContainer}>
                {bodyParts.map((part, index) => (
                    <Pressable
                        key={index}
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

            <View style={styles.detailedType}>
                <Text style={styles.detailTitle}>등록된 운동목록입니다.</Text>

                <ScrollView style={styles.detailExerciseList}>
                    <Text>운동목록...</Text>
                </ScrollView>
            </View>
        </View>
    );
};

export default ScheduleSelection;
