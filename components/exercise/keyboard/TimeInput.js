import React, { useRef, useState } from 'react';
import { StyleSheet, View, InputAccessoryView, Platform, Pressable, Text, TextInput } from 'react-native';

const TimeInput = ({ set, index, sets, setSets, style }) => {
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
        const finalValue = formatTime(tempValue);
        setInputValue(finalValue);
        const updatedSets = [...sets];
        updatedSets[index].time = finalValue;
        setSets(updatedSets);
    };

    const handleFocus = () => {
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
    };

    const renderTimeButtons = () =>
        ['-1', '+1', '-5', '+5'].map((label) => (
            <Pressable key={label} style={styles.timeButton} onPress={() => console.log(`Button pressed: ${label}`)}>
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
                placeholder="00:00"
                placeholderTextColor="#B0B0B0"
                keyboardType="numeric"
                returnKeyType="done"
                value={inputValue}
                onChangeText={handleTextChange}
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

