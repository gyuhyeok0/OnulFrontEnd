import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBar from '../../common/ProgressBar';

const Onboarding2 = ({ navigation }) => {
    const [selectedGender, setSelectedGender] = useState(null);

    // 성별을 저장하는 함수
    const saveGenderSelection = async (gender) => {
        try {
            await AsyncStorage.setItem('gender', gender);
        } catch (e) {
            console.error('성별 선택 저장에 실패했습니다.', e);
        }
    };

    const handleGenderSelection = (gender) => {
        setSelectedGender(gender);
        saveGenderSelection(gender); // 성별 저장 함수 호출
    };

    const handleNextStep = () => {
        if (selectedGender) {
            navigation.navigate('Onboarding3', { selectedGender });
        }
    };

    const isNextButtonDisabled = !selectedGender;

    const GenderButton = ({ gender }) => (
        <TouchableOpacity
            style={[
                styles.genderButton,
                selectedGender === gender && styles.selectedGenderButton,
            ]}
            onPress={() => handleGenderSelection(gender)}
        >
            <Text style={styles.genderButtonText}>{gender}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <ProgressBar currentStep={2} navigation={navigation} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={styles.title}>회원님의 성별은 무엇인가요?</Text>
                    <Text style={styles.subTitle}>회원님만을 위한 운동 프로그램</Text>

                    <View style={styles.genderContainer}>
                        <GenderButton gender="남자" />
                        <GenderButton gender="여자" />
                    </View>

                    <View style={styles.genderContainer}>
                        <GenderButton gender="기타" />
                        <GenderButton gender="무응답" />
                    </View>

                    <TouchableOpacity
                        style={[styles.nextButton, isNextButtonDisabled && styles.disabledButton]}
                        onPress={handleNextStep}
                        disabled={isNextButtonDisabled}
                    >
                        <Text style={[styles.nextButtonText, isNextButtonDisabled && styles.disabledButtonText]}>
                            다음
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#1A1C22',
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 33,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'left',
        lineHeight: 44,
        marginBottom: 5,
    },
    subTitle: {
        fontSize: 15,
        color: '#D8D8D8',
        marginTop: 8,
        lineHeight: 28,
        textAlign: 'left',
        marginBottom: height * 0.23,
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    genderButton: {
        backgroundColor: '#33373E',
        borderRadius: 15,
        paddingVertical: 18,
        paddingHorizontal: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 8,
    },
    selectedGenderButton: {
        backgroundColor: '#525D75',
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    genderButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    nextButton: {
        backgroundColor: '#5E56C3',
        borderRadius: 30,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#433D8B',
    },
    disabledButtonText: {
        color: '#343055',
    },
});

export default Onboarding2;
