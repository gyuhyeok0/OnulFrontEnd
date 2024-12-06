import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, InputAccessoryView, Platform, Pressable, Text, TextInput } from 'react-native';

const TimeInput = ({ set, index, sets, setSets, style, selectedIndex, setSelectedIndex }) => {
    const [inputValue, setInputValue] = useState(set.time);
    const [tempValue, setTempValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef(null);
    const inputAccessoryViewID = 'uniqueID';
    

    const formatTime = (value) => {
        if (value.length === 1) return `00:0${value}`;
        if (value.length === 2) return `00:${value}`;
        if (value.length === 3) return `0${value[0]}:${value.slice(1)}`;
        if (value.length === 4) return `${value.slice(0, 2)}:${value.slice(2)}`;
        if (value.length === 5) return `0${value[0]}:${value.slice(1, 3)}:${value.slice(3)}`;
        if (value.length === 6) return `${value.slice(0, 2)}:${value.slice(2, 4)}:${value.slice(4)}`;
        return value;
    };

    const handleBlur = () => {
        const finalValue = tempValue ? formatTime(tempValue) : set.time; // tempValue가 비어 있으면 기존 값 유지
        setInputValue(finalValue); // 로컬 상태 업데이트
        const updatedSets = [...sets];
        updatedSets[index].time = finalValue; // 부모 상태 업데이트
        setSets(updatedSets);
    };
    
    const handleFocus = () => {
        setSelectedIndex(index); // 현재 선택된 TextInput의 인덱스를 저장
        inputRef.current?.setNativeProps({ selection: { start: 0, end: inputValue.length } });
    };

    const handleSelectionChange = (event) => {
        const { start, end } = event.nativeEvent.selection;
        if (!isTyping && (start !== 0 || end !== inputValue.length)) {
            inputRef.current?.setNativeProps({ selection: { start: 0, end: inputValue.length } });
        }
    };

    const handleTextChange = (text) => {
        setIsTyping(true);
        const sanitizedText = text.replace(/[^\d]/g, '').slice(0, 6);
        setTempValue(sanitizedText);
        setInputValue(sanitizedText);
        setTimeout(() => setIsTyping(false), 500);
        const updatedSets = [...sets];
        updatedSets[index].time = sanitizedText; // 부모 상태 업데이트
        setSets(updatedSets);
    };

    const handleTimeAdjustment = (adjustment) => {
        if (selectedIndex === null || selectedIndex === undefined) {
            console.log('No TextInput is currently selected.');
            return;
        }
    
        // 현재 선택된 index의 time 값 가져오기
        const currentSet = sets[selectedIndex];
        console.log(`Selected Index: ${selectedIndex}`);
        console.log(`Current Time Value (raw): ${currentSet.time}`);
    
        const currentValue = currentSet.time.replace(/[^0-9]/g, ''); // 숫자만 추출
        console.log(`Sanitized Current Value: ${currentValue}`);
    
        let newTimeValue = parseInt(currentValue || '0', 10) + adjustment;
        console.log(`New Time Value (after adjustment): ${newTimeValue}`);
    
        // 값이 0보다 작아지지 않도록 설정
        if (newTimeValue < 0) {
            newTimeValue = 0;
            console.log('New Time Value adjusted to 0 (cannot be negative).');
        }
    
        // 새로운 time 값 포맷팅
        const formattedTime = formatTime(newTimeValue.toString());
        console.log(`Formatted Time Value: ${formattedTime}`);
    
        // sets 배열 업데이트
        const updatedSets = [...sets];
        updatedSets[selectedIndex].time = formattedTime;
        setSets(updatedSets);
    
        // 현재 선택된 TextInput의 값을 업데이트
        if (selectedIndex === index) {
            console.log(`Updating inputValue for index: ${index}`);
            setInputValue(formattedTime);
        }
    
        // 최종 업데이트 로그
        console.log('Updated Sets:', updatedSets);
    };
    
    

    const renderTimeButtons = () =>
        ['-1', '+1', '-5', '+5'].map((label) => (
            <Pressable
                key={label}
                style={styles.timeButton}
                onPress={() => handleTimeAdjustment(parseInt(label))}
            >
                <Text style={styles.buttonText}>{label}</Text>
            </Pressable>
        ));

    return (
        <View>
            <TextInput
                ref={inputRef}
                style={[
                    style,
                    {
                        backgroundColor: set.completed ? '#4BA262' : '#525E77',
                        color: set.completed ? '#96D3A6' : 'white',
                    },
                ]}
                onChangeText={handleTextChange}
                placeholder="00:00"
                placeholderTextColor="#B0B0B0"
                keyboardType="numeric"
                returnKeyType="done"
                value={set.time} // 부모 상태와 직접 연동
                onBlur={handleBlur}
                onFocus={handleFocus}
                onSelectionChange={handleSelectionChange}
                inputAccessoryViewID={inputAccessoryViewID}
            />


            {Platform.OS === 'ios' ? (
                <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <View style={styles.inputAccessoryView}>{renderTimeButtons()}</View>
                </InputAccessoryView>
            ) : (
                <View style={styles.inputAccessoryView}>{renderTimeButtons()}</View>
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
});

export default TimeInput;

