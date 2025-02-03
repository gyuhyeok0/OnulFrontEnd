import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';

const AiSettingsModal = ({ 
    modalVisible, setModalVisible,
    difficulty, setDifficulty,
    exerciseTime, setExerciseTime,
    exerciseStyle, setExerciseStyle,
    excludedParts, setExcludedParts,
    includeCardio, setIncludeCardio,
    onClose,
}) => {
    
    
    // 운동 스타일 선택 핸들러 (최소 1개 이상 유지)
    const toggleWorkoutStyle = (style) => {
        setExerciseStyle((prev) => {
            if (prev.includes(style)) {
                if (prev.length === 1) return prev; // 최소 1개는 남겨야 함
                return prev.filter((s) => s !== style);
            } else {
                return [...prev, style];
            }
        });
    };

    const handleClose = () => {
        if (onClose) {
            onClose(); // ✅ 부모의 `closeModal` 실행 (console.log("안녕")도 실행됨)
        }
    };

    return (
        <Modal transparent={true} visible={modalVisible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>상세 설정</Text>

                    {/* 운동 난이도 */}
                    <Text style={styles.sectionTitle}>운동 난이도</Text>
                    <View style={styles.buttonRow}>
                        {['초급', '중급', '고급'].map((level) => (
                            <Pressable 
                                key={level} 
                                style={[styles.optionButton, difficulty === level && styles.selected]}
                                onPress={() => setDifficulty(level)}
                            >
                                <Text style={styles.optionText}>{level}</Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* 운동 시간 설정 */}
                    <Text style={styles.sectionTitle}>운동 시간</Text>
                    <View style={styles.buttonRow}>
                        {['30분 이하', '60분 이하', '60분 이상'].map((time) => (
                            <Pressable 
                                key={time} 
                                style={[styles.optionButton, exerciseTime === time && styles.selected]}
                                onPress={() => setExerciseTime(time)}
                            >
                                <Text style={styles.optionText}>{time}</Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* 운동 스타일 */}
                    <Text style={styles.sectionTitle}>운동 스타일</Text>
                    <View style={styles.buttonRow}>
                        {['머신', '프리웨이트', '맨몸'].map((style) => (
                            <Pressable 
                                key={style} 
                                style={[styles.optionButton, exerciseStyle.includes(style) && styles.selected]}
                                onPress={() => toggleWorkoutStyle(style)}
                            >
                                <Text style={styles.optionText}>{style}</Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* 특정 부위 제외 */}
                    <Text style={styles.sectionTitle}>특정 부위 제외</Text>
                    <View style={styles.buttonRow}>
                        {['등', '가슴', '하체', '어깨', '팔', '복근'].map((part) => (
                            <Pressable 
                                key={part} 
                                style={[styles.optionButton, excludedParts.includes(part) && styles.selected]}
                                onPress={() => setExcludedParts((prev) =>
                                    prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
                                )}
                            >
                                <Text style={styles.optionText}>{part}</Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* 유산소 운동 포함 여부 */}
                    <Pressable 
                        style={styles.checkboxContainer} 
                        onPress={() => setIncludeCardio(!includeCardio)}
                    >
                        <Text style={[styles.checkbox, includeCardio && styles.checked]}>✔</Text>
                        <Text style={styles.label}>유산소 운동 포함</Text>
                    </Pressable>

                    {/* 닫기 버튼 */}
                    <Pressable style={styles.closeButton} onPress={() => handleClose()}>
                        <Text style={styles.closeButtonText}>닫기</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

// 스타일 정의
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '95%',
        backgroundColor: '#2A2F3C',
        borderRadius: 15,
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#AAB2C8',
        marginTop: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    optionButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#2A2F3C',
        alignItems: 'center',
        marginBottom: 10,
        marginHorizontal: 4,
    },
    selected: {
        backgroundColor: '#4682B4',
    },
    optionText: {
        color: 'white',
        fontSize: 14,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#AAB2C8',
        textAlign: 'center',
        color: 'transparent',
        marginRight: 10,
    },
    checked: {
        color: 'white',
        backgroundColor: '#4682B4',
        borderColor: '#4682B4',
    },
    label: {
        fontSize: 14,
        color: 'white',
    },
    closeButton: {
        backgroundColor: '#4682B4',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AiSettingsModal;
