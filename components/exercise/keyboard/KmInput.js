import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, InputAccessoryView, Platform, Pressable, Text, TextInput } from 'react-native';


const KmInput = ({ set, index, sets, setSets, style, kmUnit, setKmUnit, deleteExerciseFilter }) => {
    const [inputValue, setInputValue] = useState(set.km); // km 값을 상태로 관리
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef(null);
    const inputAccessoryViewID = `inputKm-${index}`; // 고유 ID 설정

    const handleSelectionChange = (event) => {
        const { start, end } = event.nativeEvent.selection;
        if (!isTyping && (start !== 0 || end !== inputValue.length)) {
            inputRef.current?.setNativeProps({ selection: { start: 0, end: inputValue.length } });
        }
    };

    // 단위 변환 함수
    const convertDistance = (value, fromUnit, toUnit) => {
        if (fromUnit === toUnit) return value; // 동일 단위일 경우 변환 필요 없음
        if (fromUnit === 'km' && toUnit === 'mi') {
            return (value * 0.621371).toFixed(2); // km -> mi 변환
        } else if (fromUnit === 'mi' && toUnit === 'km') {
            return (value / 0.621371).toFixed(2); // mi -> km 변환
        }
        return value;
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
            ? `${integerPart.slice(0, 5)}.${decimalPart.slice(0, 2)}`
            : integerPart.slice(0, 5); // 정수부는 최대 5자리
    
        setInputValue(formattedValue); // 로컬 상태 업데이트
    
         // 상태를 복사한 후 업데이트
        const updatedSets = sets.map((item, i) => {
            if (i === index) {
                
                // 만약 set.completed가 true이면 false로 변경
                const updatedItem = {
                    ...item, // 기존 세트 복사
                    [kmUnit]: formattedValue, // 현재 단위 값 업데이트
                    [kmUnit === 'km' ? 'mi' : 'km']: convertDistance(
                        parseFloat(formattedValue || 0),
                        kmUnit,
                        kmUnit === 'km' ? 'mi' : 'km'
                    ), // 반대 단위 값 업데이트
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
    
    
    const handleUnitChange = (unit) => {
        setKmUnit(unit); // 단위 상태 업데이트
    };

    useEffect(() => {
        const updatedSets = [...sets];
        updatedSets.forEach((item, i) => {
            if (item[kmUnit === 'km' ? 'mi' : 'km'] !== undefined && item[kmUnit === 'km' ? 'mi' : 'km'] !== '') {
                const currentValue = parseFloat(item[kmUnit === 'km' ? 'mi' : 'km']);
                updatedSets[i][kmUnit] = convertDistance(currentValue, kmUnit === 'km' ? 'mi' : 'km', kmUnit);
            } else {
                updatedSets[i][kmUnit] = ''; // 값이 비어있으면 그대로 유지
            }
        });
        setSets(updatedSets); // 부모 상태 업데이트

        setInputValue(updatedSets[index][kmUnit] || ''); // 현재 세트에 맞는 값 업데이트
    }, [kmUnit]);
    
    const renderKmButtons = () => {
        return ['km', 'mi'].map((label) => (
            <Pressable
                key={label}
                style={[
                    styles.timeButton,
                    kmUnit === label && styles.selectedButton // 선택된 버튼 스타일 추가
                ]}
                onPress={() => handleUnitChange(label)}
            >
                <Text
                    style={[
                        styles.buttonText,
                        kmUnit === label && styles.selectedButtonText // 선택된 버튼 텍스트 스타일 추가
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
                placeholder= {kmUnit}
                placeholderTextColor="#B0B0B0"
                keyboardType="numeric"
                returnKeyType="done"
                value={inputValue} // 로컬 상태로부터 값 연동
                onSelectionChange={handleSelectionChange}
                inputAccessoryViewID={inputAccessoryViewID}
                selectTextOnFocus={true} // 클릭 시 전체 텍스트 선택
            />

            {Platform.OS === 'ios' ? (
                <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <View style={styles.inputAccessoryView}>{renderKmButtons()}</View>
                </InputAccessoryView>
            ) : (
                <View style={styles.inputAccessoryView}>{renderKmButtons()}</View>
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

export default KmInput;

