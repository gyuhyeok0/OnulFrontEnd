import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, InputAccessoryView, Platform, Pressable, Text, TextInput } from 'react-native';

const TimeInput = ({ set, index, sets, setSets, style, selectedIndex, setSelectedIndex, deleteExerciseFilter}) => {
    const [inputValue, setInputValue] = useState(set.time);
    const [tempValue, setTempValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const inputRef = useRef(null);
    const inputAccessoryViewID = `inputTime-${index}`; // 고유 ID 설정
    const selectedIndexRef = useRef(null);
    const [adjustedTime, setAdjustedTime] = useState(null); // handleTimeAdjustment에서 변경된 값 저장

    // 포커스 상태 확인
    const isFocused = selectedIndex === index;

    useEffect(() => {
        if (set.time !== inputValue && adjustedTime === null) {
            // console.log(`[useEffect] set.time 업데이트 감지: ${set.time}`);
            setInputValue(set.time);
        }
    }, [set.time, adjustedTime, inputValue]);

    useEffect(() => {
        selectedIndexRef.current = selectedIndex;
        // console.log(`selectedIndexRef가 업데이트됨: ${selectedIndex}`);
    }, [selectedIndex]);
    

    const formatTime = (value = '') => {
        if (!value || isNaN(Number(value))) return '00:00';
        if (value.length === 1) return `00:0${value}`;
        if (value.length === 2) return `00:${value}`;
        if (value.length === 3) return `0${value[0]}:${value.slice(1)}`;
        if (value.length === 4) return `${value.slice(0, 2)}:${value.slice(2)}`;
        if (value.length === 5) return `0${value[0]}:${value.slice(1, 3)}:${value.slice(3)}`;
        if (value.length === 6) return `${value.slice(0, 2)}:${value.slice(2, 4)}:${value.slice(4)}`;
        return '00:00';
    };

    const handleBlur = () => {
    
        // 최종 값 결정: 항상 inputValue를 기반으로 포맷팅
        const finalValue = formatTime(inputValue.replace(/[^\d]/g, ''));
    
        // 로컬 상태와 부모 상태를 업데이트
        setInputValue(finalValue);


         // 리듀서 복제
        const updatedSets = sets.map((item, i) => {
            if (i === index) {
                return {
                    ...item, // 기존 세트 복사
                    time: finalValue, // time 값 업데이트
                };
            }
            return item; // 다른 세트는 그대로 유지
        });

        setSets(updatedSets);
    
        // 상태 초기화
        setAdjustedTime(null);
        setTempValue('');

        // selectedIndexRef 초기화
        if (selectedIndexRef.current === index) {
            selectedIndexRef.current = null;
        }
    };
    
    
    const handleFocus = () => {

        selectedIndexRef.current = index; // Ref에 현재 인덱스 저장
        setSelectedIndex(index); // 상태도 업데이트
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
    
        // 리듀서 복제
        const updatedSets = sets.map((item, i) => {
            if (i === index) {
                // 세트 복사 후 time 값을 업데이트하고, completed가 true일 경우 false로 변경
                const updatedItem = {
                    ...item, // 기존 세트 복사
                    time: sanitizedText, // time 값 업데이트
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
    
        setSets(updatedSets);
        setTimeout(() => setIsTyping(false), 500);
    };
    

    

    const handleTimeAdjustment = (adjustment) => {
        if (!isFocused) {
            return;
        }
    
    
        if (selectedIndexRef.current === null || selectedIndexRef.current === undefined) {
            return;
        }
    
        // 현재 선택된 index의 time 값 가져오기
        const currentSet = sets[selectedIndex];    
        const currentValue = currentSet.time.replace(/[^0-9]/g, ''); // 숫자만 추출
    
        let newTimeValue = parseInt(currentValue || '0', 10) + adjustment;
    
        // 값이 0보다 작아지지 않도록 설정
        if (newTimeValue < 0) {
            newTimeValue = 0;
        }
    
        // 새로운 time 값 포맷팅
        const formattedTime = formatTime(newTimeValue.toString());
    
        setAdjustedTime(formattedTime);
    
        // sets 배열 업데이트 (Array.map 사용)
        const updatedSets = sets.map((item, i) => {
            if (i === selectedIndex) {
                // 만약 set.completed가 true이면 false로 변경
                const updatedItem = {
                    ...item, // 기존 세트 복사
                    time: formattedTime, // 선택된 세트의 time 값 업데이트
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
    
        setSets(updatedSets);
    
        // 현재 선택된 TextInput의 값을 업데이트
        if (selectedIndex === index) {
            setInputValue(formattedTime);
        }
    
        // 최종 업데이트 로그
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
                        backgroundColor: set.completed ? '#1EAE98' : '#3A4357',
                        color: set.completed ? '#55E3C1' : 'white',
                        padding: 0
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
                selectTextOnFocus={true}
            />


            {Platform.OS === 'ios' ? (
                <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <View style={styles.inputAccessoryView}>{renderTimeButtons()}</View>
                </InputAccessoryView>
            ) : (
                // <View style={styles.inputAccessoryView}>{renderTimeButtons()}</View>
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
        backgroundColor: '#131418',
    },
    timeButton: {
        flex: 1,
        marginHorizontal: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        backgroundColor: '#3A4357',
        height: 35,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TimeInput;