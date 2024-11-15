import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import RegistExerciseModal from '../../src/screens/modal/scheduleModal/RegistExerciseModal';

// 운동 메뉴의 커스텀 코드
const Custom = () => {
    const navigation = useNavigation();
    const customExercises = useSelector((state) => state.customExercises.myExercises || []);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState('');

    useEffect(() => {
        console.log("Custom Exercises:", customExercises); // 상태 변화 확인
    }, [customExercises]);

    const openModal = useCallback(() => {
        setSelectedExercise("커스텀"); // 모달에서 사용할 운동 이름 설정
        setIsModalVisible(true); // 모달 열기
    }, []);

    const closeModal = useCallback(() => {
        setIsModalVisible(false); // 모달 닫기
        setSelectedExercise(''); // 선택된 운동 이름 초기화
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.customContainer}>
                {(Array.isArray(customExercises) && customExercises.length === 0) || customExercises === null || customExercises === "None" ? (
                    <View style={styles.noSchedule}>
                        <Text style={styles.noScheduleText}>현재 커스텀 운동이 없습니다.</Text>
                        <Pressable style={styles.button} onPress={openModal}>
                            <Text style={styles.buttonText}>커스텀 등록하러 가기</Text>
                        </Pressable>
                    </View>
                ) : Array.isArray(customExercises) ? (
                    customExercises.map((exercise, index) => (
                        <View key={exercise.id || index} style={styles.exerciseItem}>
                            <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                        </View>
                    ))
                ) : null}
            </ScrollView>

            {/* RegistExerciseModal 모달 컴포넌트 */}
            <RegistExerciseModal 
                isVisible={isModalVisible} 
                onClose={closeModal} 
                exercise={selectedExercise} 
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
    },
    customContainer: {
        paddingVertical: 10,
        borderRadius: 10,
        flexGrow: 1,
    },
    noSchedule: {
        width: '100%',
        minHeight: 100,
        marginBottom: 30,
        padding: 15,
        borderRadius: 10,
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
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    exerciseItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Custom;
