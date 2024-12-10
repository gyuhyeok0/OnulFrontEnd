import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, InputAccessoryView, Platform, Pressable, Text, TextInput } from 'react-native';


const KgInput = ({ set, index, sets, setSets, style, weightUnit, setWeightUnit }) => {
    const [inputValue, setInputValue] = useState(set.weightUnit); // km 값을 상태로 관리
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef(null);
    const inputAccessoryViewID = `inputKg-${index}`; // 고유 ID 설정

    const handleSelectionChange = (event) => {
        const { start, end } = event.nativeEvent.selection;
        if (!isTyping && (start !== 0 || end !== inputValue.length)) {
            inputRef.current?.setNativeProps({ selection: { start: 0, end: inputValue.length } });
        }
    };


    const handleTextChange = (text) => {        
        // 숫자와 소수점만 허용, 소수점은 최대 1개
        let sanitizedText = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    
        // 소수점으로 시작하면 "0."으로 변환
        if (sanitizedText.startsWith('.')) {
            sanitizedText = `0${sanitizedText}`;
        }
    
        // 소수점 이하 최대 2자리 제한
        const [integerPart, decimalPart] = sanitizedText.split('.');
        const formattedValue = decimalPart !== undefined
            ? `${integerPart.slice(0, 4)}.${decimalPart.slice(0, 2)}` // 정수부는 최대 4자리
            : integerPart.slice(0, 4); // 정수부는 최대 4자리
    
        setInputValue(formattedValue); // 로컬 상태 업데이트
    
        const updatedSets = [...sets];
        updatedSets[index].km = formattedValue; // 부모 상태 업데이트
        setSets(updatedSets);
    };
    
    
        const handleUnitChange = (unit) => {
            console.log(`[handleUnitChange] 단위 변경 요청됨: ${unit}`);

            setWeightUnit(unit);
        };

    const renderKgButtons = () => {
        return ['kg', 'lbs'].map((label) => (
            <Pressable
                key={label}
                style={[
                    styles.timeButton,
                    weightUnit === label && styles.selectedButton // 선택된 버튼 스타일 추가
                ]}
                onPress={() => handleUnitChange(label)}
            >
                <Text
                    style={[
                        styles.buttonText,
                        weightUnit === label && styles.selectedButtonText // 선택된 버튼 텍스트 스타일 추가
                    ]}
                >
                    {label}
                </Text>
            </Pressable>
        ));
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
                placeholder= {weightUnit}
                placeholderTextColor="#B0B0B0"
                keyboardType="numeric"
                returnKeyType="done"
                value={inputValue} // 로컬 상태로부터 값 연동
                onSelectionChange={handleSelectionChange}
                inputAccessoryViewID={inputAccessoryViewID}
            />

            {Platform.OS === 'ios' ? (
                <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <View style={styles.inputAccessoryView}>{renderKgButtons()}</View>
                </InputAccessoryView>
            ) : (
                <View style={styles.inputAccessoryView}>{renderKgButtons()}</View>
            )}
        </View>
    );
};



const styles = StyleSheet.create({
    inputAccessoryView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        backgroundColor: '#CCCFD4',
    },
    timeButton: {
        flex: 1,
        marginHorizontal: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        backgroundColor: '#fff',
        height: 35,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },

    selectedButton: {
        backgroundColor: '#497CF4', // 선택된 버튼의 배경색
    },
    selectedButtonText: {
        color: 'white', // 선택된 버튼 텍스트 색
        fontWeight: 'bold',
    },
});

export default KgInput;

