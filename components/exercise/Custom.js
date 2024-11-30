import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import RegistExerciseModal from '../../src/screens/modal/scheduleModal/RegistExerciseModal';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/FontAwesome5';

// 운동 메뉴의 커스텀 코드
const Custom = () => {
    const navigation = useNavigation();
    const customExercises = useSelector((state) => state.customExercises.myExercises || []);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState('');

    const [isVisible, setIsVisible] = useState(false);
    const [animationHeight] = useState(new Animated.Value(0));

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

    const handleRefresh = () => setRefreshKey(prevKey => prevKey + 1);

    const toggleVisibility = () => {
        setIsVisible(prevState => !prevState);
        Animated.timing(animationHeight, {
            toValue: isVisible ? 0 : 75,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View style={styles.container}>

            <ScrollView contentContainerStyle={styles.customContainer}>

                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Pressable style={styles.refreshInner} onPress={handleRefresh}>
            
                            <Text style={styles.refreshLabel}>자율 운동 등록</Text>
                        </Pressable>
                        
                        <Pressable style={styles.caretButton} onPress={toggleVisibility}>
                            <Icon2 name={isVisible ? "caret-up" : "caret-down"} size={28} color="white" />
                        </Pressable>
                    </View>
                    <Animated.View style={[styles.hiddenContent, { height: animationHeight }]}>
                        {isVisible && (
                            <View style={styles.buttonContainer}>
                                
                            </View>
                        )}
                    </Animated.View>
                </View>

                <View style={{}}>
                        <Text style={{textAlign:'center', color:'white', fontSize: 15, fontWeight: '500'}}> 위의 버튼을 통해 운동을 먼저 등록해주세요 </Text>

                </View>

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

    refreshLabel: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 2,
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

export default Custom;
