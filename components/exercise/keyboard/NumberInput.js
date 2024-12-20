import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

const NumberInput = ({ set, index, sets, setSets, style, deleteExerciseFilter}) => {
    const [inputValue, setInputValue] = useState(""); // km 값을 상태로 관리

    // 초기화 및 sets 변경 시 동기화
    useEffect(() => {
        if (sets[index] && sets[index].reps !== undefined) {
            setInputValue(sets[index].reps?.toString() || ""); // reps 값 초기화
        }
    }, [sets, index]);

    const handleTextChange = (text) => {
        // 숫자만 허용하고, 정수 최대값을 999로 제한
        let sanitizedText = text.replace(/[^0-9]/g, ''); // 숫자 이외 제거
    
        // 999를 초과하지 않도록 값 제한
        if (sanitizedText !== '' && parseInt(sanitizedText, 10) > 999) {
            sanitizedText = '999';
        }
    
        setInputValue(sanitizedText); // 로컬 상태 업데이트
    
        // 부모 상태 업데이트
        const updatedSets = sets.map((item, i) => {
            if (i === index) {
                // 세트 복사 후 reps 값을 업데이트하고, completed가 true일 경우 false로 변경
                const updatedItem = {
                    ...item, // 기존 세트 복사
                    reps: sanitizedText, // reps 값 업데이트
                };

                // set.completed가 true이면 false로 설정
                if (updatedItem.completed) {
                    updatedItem.completed = false; // 값이 변경되면 완료 상태를 false로 변경
                    deleteExerciseFilter(updatedSets, index+1);

                }

                return updatedItem;
            }
            return item; // 다른 세트는 그대로 유지
        });
    
        setSets(updatedSets); // 부모 상태 업데이트
    };
    
    return (
        <View>
            <TextInput
                style={[
                    style,
                    {
                        backgroundColor: set.completed ? '#4BA262' : '#525E77',
                        color: set.completed ? '#96D3A6' : 'white',
                    },
                ]}
                onChangeText={handleTextChange}
                placeholder="횟수"
                placeholderTextColor="#B0B0B0"
                keyboardType="numeric"
                value={inputValue} // 로컬 상태로부터 값 연동
            />
        </View>
    );
};

export default NumberInput;
