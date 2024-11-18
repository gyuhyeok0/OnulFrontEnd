import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBar from '../../common/ProgressBar';

const Onboarding = ({ navigation }) => {
    const [selectedWeightUnit, setSelectedWeightUnit] = useState(null);
    const [selectedHeightUnit, setSelectedHeightUnit] = useState(null);

    // 단위를 선택할 때 로컬스토리지에 저장하는 함수
    const saveUnitSelection = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
            // weightUnit 선택 시 bodyWeightUnit도 동일하게 설정
            if (key === 'weightUnit') {
                await AsyncStorage.setItem('bodyWeightUnit', value);
            }
        } catch (e) {
            console.error('Failed to save the unit selection.', e);
        }
    };

    const handleUnitSelection = (type, value) => {
        if (type === 'weight') {
            setSelectedWeightUnit(value);
            saveUnitSelection('weightUnit', value);
        } else {
            setSelectedHeightUnit(value);
            saveUnitSelection('heightUnit', value);
        }
    };

    const handleNextStep = () => {
        if (selectedWeightUnit && selectedHeightUnit) {
            navigation.navigate('Onboarding2');
        }
    };

    const isNextButtonDisabled = !selectedWeightUnit || !selectedHeightUnit;

    const UnitButton = ({ unitType, unitValue, selectedUnit }) => (
        <TouchableOpacity
            style={[
                styles.unitButton,
                selectedUnit === unitValue && styles.selectedUnitButton,
            ]}
            onPress={() => handleUnitSelection(unitType, unitValue)}
        >
            <Text style={styles.unitButtonText}>{unitValue}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <ProgressBar currentStep={1} navigation={navigation} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={styles.title}>안녕하세요</Text>
                    <Text style={styles.subTitle}>회원님에게 맞춤 운동을 위한 몇가지 질문 입니다.</Text>

                    <Text style={styles.question}>회원님에게 맞는 단위를 선택해 주세요</Text>
                    <Text style={styles.note}>언제든지 변경 가능합니다.</Text>

                    <View style={styles.unitContainer}>
                        <UnitButton unitType="weight" unitValue="lbs" selectedUnit={selectedWeightUnit} />
                        <UnitButton unitType="weight" unitValue="kg" selectedUnit={selectedWeightUnit} />
                    </View>

                    <View style={styles.unitContainer}>
                        <UnitButton unitType="height" unitValue="feet" selectedUnit={selectedHeightUnit} />
                        <UnitButton unitType="height" unitValue="cm" selectedUnit={selectedHeightUnit} />
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

const { height } = Dimensions.get('window');

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
        fontSize: 25,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'left',
    },
    subTitle: {
        fontSize: 23,
        color: '#D8D8D8',
        marginTop: 10,
        lineHeight: 32,
    },
    question: {
        fontSize: 33,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: height * 0.03,
        textAlign: 'left',
        lineHeight: 44,
    },
    note: {
        fontSize: 15,
        color: '#999999',
        marginTop: 10,
        marginBottom: height * 0.16,
    },
    unitContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    unitButton: {
        backgroundColor: '#33373E',
        borderRadius: 15,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 8,
    },
    selectedUnitButton: {
        backgroundColor: '#525D75',
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    unitButtonText: {
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
        marginTop: 13,
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

export default Onboarding;
