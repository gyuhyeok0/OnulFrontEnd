import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    Pressable,
    Platform,
    InputAccessoryView,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';

const TimeAdjuster = () => {
    const [time, setTime] = useState('00:00'); // 초기 시간 값
    const inputRef = useRef(null);
    const inputAccessoryViewID = 'uniqueInputAccessoryID'; // iOS에서 InputAccessoryView ID

    // 버튼 클릭 시 시간 조정
    const adjustTime = (adjustment) => {
        console.log('버튼 클릭:', adjustment);
        inputRef.current?.focus(); // 키보드 유지
    };

    // 시간 조정 버튼 렌더링
    const renderButtons = () => {
        return ['-5', '-1', '+1', '+5'].map((label) => (
            <Pressable
                key={label}
                style={styles.button}
                onPress={() => adjustTime(parseInt(label, 10))}
            >
                <Text style={styles.buttonText}>{label}</Text>
            </Pressable>
        ));
    };

    return (
        <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled" // 버튼 탭 시 키보드 유지
    >

        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
    
                <Text style={styles.label}>시간 입력:</Text>
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    value={time}
                    onChangeText={setTime}
                    placeholder="00:00"
                    keyboardType="numeric"
                    returnKeyType="done"
                    inputAccessoryViewID={Platform.OS === 'ios' ? inputAccessoryViewID : undefined}
                />

            {/* iOS 전용 InputAccessoryView */}
            {Platform.OS === 'ios' && (
                <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <View style={styles.accessoryContainer}>{renderButtons()}</View>
                </InputAccessoryView>
            )}

            {/* Android 및 키보드 위의 버튼 */}
            {Platform.OS === 'android' && (
                <View style={styles.androidAccessoryContainer}>{renderButtons()}</View>
            )}
        </KeyboardAvoidingView>

        </ScrollView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        width: '80%',
        height: 50,
        borderColor: '#ced4da',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 20,
        paddingHorizontal: 10,
        fontSize: 18,
        textAlign: 'center',
        backgroundColor: '#ffffff',
    },
    accessoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#EEE',
        padding: 10,
    },
    androidAccessoryContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#EEE',
        padding: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TimeAdjuster;
