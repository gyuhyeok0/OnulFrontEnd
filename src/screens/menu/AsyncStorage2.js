import 'intl-pluralrules';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DefaultHeader from '../common/DefaultHeader';
import { useTranslation } from 'react-i18next';

const AsyncStorage2 = ({ navigation }) => {
    const { t } = useTranslation();

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

    // AsyncStorage에서 저장된 단위 값을 가져오는 함수
    const loadUnitSelection = async () => {
        try {
            const weightUnit = await AsyncStorage.getItem('weightUnit');
            const heightUnit = await AsyncStorage.getItem('heightUnit');

            if (weightUnit) {
                setSelectedWeightUnit(weightUnit);
            }
            if (heightUnit) {
                setSelectedHeightUnit(heightUnit);
            }
        } catch (e) {
            console.error('Failed to load the unit selection.', e);
        }
    };

    useEffect(() => {
        loadUnitSelection();  // 컴포넌트가 마운트될 때 저장된 단위 값을 불러옴
    }, []);

    const handleUnitSelection = (type, value) => {
        if (type === 'weight') {
            setSelectedWeightUnit(value);
            saveUnitSelection('weightUnit', value);
        } else {
            setSelectedHeightUnit(value);
            saveUnitSelection('heightUnit', value);
        }
    };

    return (
        <>
            <DefaultHeader title={t('unitSettings.title')} navigation={navigation} />

            <View style={{ flex: 1, backgroundColor:'#1A1C22' }}>
                <Text style={{color:'white', fontSize: 18, marginLeft: 10, marginTop: 20,marginBottom:10}}>
                    {t('unitSettings.selectUnit')}
                </Text>

                <View style={styles.unitContainer}>
                    <UnitButton unitType="weight" unitValue="lbs" selectedUnit={selectedWeightUnit} onPress={() => handleUnitSelection('weight', 'lbs')} />
                    <UnitButton unitType="weight" unitValue="kg" selectedUnit={selectedWeightUnit} onPress={() => handleUnitSelection('weight', 'kg')} />
                </View>

                <View style={styles.unitContainer}>
                    <UnitButton unitType="height" unitValue="feet" selectedUnit={selectedHeightUnit} onPress={() => handleUnitSelection('height', 'feet')} />
                    <UnitButton unitType="height" unitValue="cm" selectedUnit={selectedHeightUnit} onPress={() => handleUnitSelection('height', 'cm')} />
                </View>
            </View>
        </>
    );
};

// UnitButton 컴포넌트 정의
const UnitButton = ({ unitType, unitValue, selectedUnit, onPress }) => {
    const isSelected = selectedUnit === unitValue;

    return (
        <Pressable
            style={[styles.unitButton, isSelected && styles.selectedUnitButton]}
            onPress={onPress}
        >
            <Text style={styles.unitButtonText}>{unitValue}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
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

export default AsyncStorage2;
