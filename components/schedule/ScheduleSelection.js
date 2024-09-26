import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';

const ScheduleSelection = ({ selectedWeekType, selectedDay }) => {
    // 운동 부위 리스트 정의
    const bodyParts = ['가슴', '등', '하체', '어깨', '복근', '팔', '유산소', '커스텀'];
    
    // 선택된 운동 부위를 저장할 상태 정의 (배열)
    const [selectedParts, setSelectedParts] = useState([]);

    // 운동부위 선택
    const handlePress = (part) => {
        // 이미 선택된 부위이면 배열에서 제거하고, 아니면 추가
        if (selectedParts.includes(part)) {
            setSelectedParts(selectedParts.filter(item => item !== part));
        } else {
            setSelectedParts([...selectedParts, part]);
        }
    };

    //완료버튼
    const handleComplete = () => {
        if (selectedParts.length === 0) {
            Alert.alert('운동 부위를 선택해주세요.');
        } else {
            // 여기에서 선택된 운동 부위 처리 (예: 서버로 전송 또는 상태 저장)
            Alert.alert(`선택된 운동 부위: ${selectedParts.join(', ')}`);
        }
    };

    return (
        <View style={styles.registration}>
            <Text style={styles.title}>실행할 운동 부위를 선택해주세요</Text>
            <View style={styles.buttonContainer}>
                {bodyParts.map((part, index) => (
                    <Pressable
                        key={index}
                        style={[
                            styles.button,
                            selectedParts.includes(part) && styles.selectedButton
                        ]}
                        onPress={() => handlePress(part)}
                    >
                        <Text style={[
                            styles.buttonText,
                            selectedParts.includes(part) && styles.selectedButtonText
                        ]}>
                            {part}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <View style={styles.detailedType}>
                <Text style={styles.detailTitle}>현재 등록된 세부종류입니다</Text>
            </View>

            {/* 완료 버튼 */}
            <Pressable style={styles.completeButton} onPress={handleComplete}>
                <Text style={styles.completeButtonText}>완료</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    registration: {
        margin: 15,
        padding: 10,
        marginBottom: 20,
        borderRadius: 15,
        minHeight: 60,
        backgroundColor: '#505E78',
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        marginTop: 10,
        fontSize: 13,
        color: '#fff',
        marginBottom: 12,
    },

    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // 여러 줄로 버튼을 정렬
        maxWidth: 300,
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
        backgroundColor: '#1B2D76',
        borderColor: '#1B2D76',
    },
    
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },

    selectedButtonText: {
        color: '#fff',
    },

    completeButton: {
        margin:8,
        marginTop: 13,

        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 20,
        paddingRight: 20,

        backgroundColor: '#183B95',
        borderRadius: 20,
    },

    completeButtonText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
    },

    detailedType: {
        width: 290,
        minHeight: 70,
        // backgroundColor: 'gray'
    },

    detailTitle: {
        marginTop: 15,
        color: 'white',
        fontSize: 12,

    }


});

export default ScheduleSelection;
