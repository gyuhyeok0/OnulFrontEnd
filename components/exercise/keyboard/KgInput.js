import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, InputAccessoryView, Platform, Pressable, Text, TextInput } from 'react-native';


const KgInput = ({ set, index, sets, setSets, style, weightUnit, setWeightUnit, deleteExerciseFilter }) => {
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

    useEffect(() => {
        const currentSet = sets[index];
        if (currentSet && currentSet[weightUnit] !== undefined) {
            setInputValue(currentSet[weightUnit]?.toString() || ''); // kg 또는 lbs 값 설정
        }
    }, [sets, index, weightUnit]);
    

     // 단위 변환 함수
    const convertWeight = (value, fromUnit, toUnit) => {
        if (fromUnit === toUnit) return value; // 동일 단위일 경우 변환 필요 없음
        if (fromUnit === 'kg' && toUnit === 'lbs') {
            return (value * 2.20462).toFixed(2); // kg -> lbs 변환
        } else if (fromUnit === 'lbs' && toUnit === 'kg') {
            return (value / 2.20462).toFixed(2); // lbs -> kg 변환
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
            ? `${integerPart.slice(0, 4)}.${decimalPart.slice(0, 2)}` // 정수부는 최대 4자리
            : integerPart.slice(0, 4); // 정수부는 최대 4자리
    
        setInputValue(formattedValue); // 로컬 상태 업데이트
        
   
        // 상태를 복사한 후 업데이트
    const updatedSets = sets.map((item, i) => {
        if (i === index) {
            // 세트 복사 후 값을 업데이트하고, completed가 true일 경우 false로 변경
            const updatedItem = {
                ...item, // 기존 세트 복사
                [weightUnit]: formattedValue, // 현재 단위 값 업데이트
                [weightUnit === 'kg' ? 'lbs' : 'kg']: convertWeight(
                    parseFloat(formattedValue || 0),
                    weightUnit,
                    weightUnit === 'kg' ? 'lbs' : 'kg'
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

    
    
    useEffect(() => {
        const updatedSets = [...sets];
        updatedSets.forEach((item, i) => {
            if (item[weightUnit === 'kg' ? 'lbs' : 'kg'] !== undefined && item[weightUnit === 'kg' ? 'lbs' : 'kg'] !== '') {
                const currentValue = parseFloat(item[weightUnit === 'kg' ? 'lbs' : 'kg']);
                updatedSets[i][weightUnit] = convertWeight(currentValue, weightUnit === 'kg' ? 'lbs' : 'kg', weightUnit);
            } else {
                updatedSets[i][weightUnit] = ''; // 값이 비어있으면 그대로 유지
            }
        });
        setSets(updatedSets); // 부모 상태 업데이트
        setInputValue(updatedSets[index][weightUnit] || ''); // 현재 세트에 맞는 값 업데이트
    }, [weightUnit]); // 단위가 변경될 때 실행
    
    const handleUnitChange = (unit) => {
        // console.log(`[handleUnitChange] 단위 변경 요청됨: ${unit}`);
        setWeightUnit(unit); // 단위 상태 업데이트
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
                        backgroundColor: set.completed ? '#1EAE98' : '#525E77',
                        color: set.completed ? '#55E3C1' : 'white',
                        padding: 0,
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
                selectTextOnFocus={true} // 클릭 시 전체 텍스트 선택
            />

            {Platform.OS === 'ios' ? (
                <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <View style={styles.inputAccessoryView}>{renderKgButtons()}</View>
                </InputAccessoryView>
            ) : (
                // <View style={styles.inputAccessoryView}>{renderKgButtons()}</View>
                <></>
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

