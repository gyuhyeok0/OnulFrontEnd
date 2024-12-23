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
            console.log(`[useEffect] set.time 업데이트 감지: ${set.time}`);
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
        console.log(`[handleBlur] 실행: inputValue=${inputValue}, tempValue=${tempValue}, adjustedTime=${adjustedTime}, set.time=${set.time}`);
    
        // 최종 값 결정: 항상 inputValue를 기반으로 포맷팅
        const finalValue = formatTime(inputValue.replace(/[^\d]/g, ''));
        console.log(`[handleBlur] 최종 값: ${finalValue}`);
    
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
            console.log(`[handleBlur] selectedIndexRef 초기화됨: ${selectedIndexRef.current}`);
        }
    };
    
    
    const handleFocus = () => {
        console.log(`TextInput 포커스: ${index}번 입력창이 선택되었습니다.`);

        selectedIndexRef.current = index; // Ref에 현재 인덱스 저장
        setSelectedIndex(index); // 상태도 업데이트
        // console.log(`selectedIndexRef 업데이트됨: ${selectedIndexRef.current}`);
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
    
        console.log("TextInput 내에서 업데이트 완료");
        setSets(updatedSets);
        setTimeout(() => setIsTyping(false), 500);
    };
    

    

    const handleTimeAdjustment = (adjustment) => {
        if (!isFocused) {
            console.log('현재 포커스된 TextInput이 아닙니다.');
            return;
        }
    
        console.log('handleTimeAdjustment 호출됨');
        console.log('현재 selectedIndexRef 상태:', selectedIndexRef.current);
    
        if (selectedIndexRef.current === null || selectedIndexRef.current === undefined) {
            console.log('선택된 TextInput이 없습니다.');
            return;
        }
    
        // 현재 선택된 index의 time 값 가져오기
        const currentSet = sets[selectedIndex];
        console.log(`선택된 인덱스: ${selectedIndex}`);
        console.log(`현재 시간 값 (원본): ${currentSet.time}`);
    
        const currentValue = currentSet.time.replace(/[^0-9]/g, ''); // 숫자만 추출
        console.log(`숫자만 추출한 현재 값: ${currentValue}`);
    
        let newTimeValue = parseInt(currentValue || '0', 10) + adjustment;
        console.log(`조정 후 새로운 시간 값: ${newTimeValue}`);
    
        // 값이 0보다 작아지지 않도록 설정
        if (newTimeValue < 0) {
            newTimeValue = 0;
            console.log('새로운 시간 값이 0으로 조정되었습니다. (음수는 허용되지 않음)');
        }
    
        // 새로운 time 값 포맷팅
        const formattedTime = formatTime(newTimeValue.toString());
        console.log(`포맷된 시간 값: ${formattedTime}`);
    
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
            console.log(`인덱스 ${index}의 inputValue를 업데이트합니다.`);
            setInputValue(formattedTime);
        }
    
        // 최종 업데이트 로그
        console.log('업데이트된 세트:', updatedSets);
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