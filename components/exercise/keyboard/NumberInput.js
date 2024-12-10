import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

const NumberInput = ({ set, index, sets, setSets, style }) => {
    const [inputValue, setInputValue] = useState(""); // km 값을 상태로 관리

    const handleTextChange = (text) => {
        // 숫자만 허용하고, 정수 최대값을 999로 제한
        let sanitizedText = text.replace(/[^0-9]/g, ''); // 숫자 이외 제거

        // 999를 초과하지 않도록 값 제한
        if (sanitizedText !== '' && parseInt(sanitizedText, 10) > 999) {
            sanitizedText = '999';
        }

        setInputValue(sanitizedText); // 로컬 상태 업데이트

        // 부모 상태 업데이트
        const updatedSets = [...sets];
        updatedSets[index].km = sanitizedText;
        setSets(updatedSets);
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
