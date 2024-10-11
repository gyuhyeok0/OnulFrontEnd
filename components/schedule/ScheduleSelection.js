import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './ScheduleSelection.module';
import { deleteDataFromServer, sendDataToServer  } from '../../src/apis/ScheduleAPI';


const ScheduleSelection = ({ selectedWeekType, selectedDay, weekInfo }) => {
    const [memberId, setMemberId] = useState(null);
    const [selectedParts, setSelectedParts] = useState({});

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

    useEffect(() => {
        console.log(selectedWeekType, selectedDay, weekInfo, memberId);
    }, [selectedWeekType, selectedDay, weekInfo, memberId]);

    const bodyParts = ['가슴', '등', '하체', '어깨', '복근', '팔', '유산소', '커스텀'];

    const handlePress = (part) => {
        const isPartSelected = selectedParts[part];
        const updatedParts = { ...selectedParts, [part]: !isPartSelected };
    
        setSelectedParts(updatedParts);
    
        if (memberId) {
            if (!isPartSelected) {
                sendDataToServer(part, memberId, selectedWeekType, selectedDay);
            } else {
                deleteDataFromServer(part, memberId, selectedWeekType, selectedDay);
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
                <Text style={styles.detailTitle}>현재 등록된 운동목록입니다.</Text>

                <ScrollView style={styles.detailExerciseList}>
                    <Text>운동목록...</Text>
                </ScrollView>
            </View>
        </View>
    );
};

export default ScheduleSelection;
