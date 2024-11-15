import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBar from '../../common/ProgressBar';

const Onboarding3 = ({ navigation, route }) => {
    const { selectedGender } = route.params;
    const [heightUnit, setHeightUnit] = useState('cm');
    const [weightUnit, setWeightUnit] = useState('kg');
    const [height, setHeight] = useState({ feet: '', inches: '', cm: '' });
    const [weight, setWeight] = useState({ kg: '', lbs: '' });

    useEffect(() => {
        const loadUnits = async () => {
            try {
                const [storedHeightUnit, storedWeightUnit] = await Promise.all([
                    AsyncStorage.getItem('heightUnit'),
                    AsyncStorage.getItem('weightUnit'),
                ]);
                if (storedHeightUnit) setHeightUnit(storedHeightUnit);
                if (storedWeightUnit) setWeightUnit(storedWeightUnit);
                
            } catch (e) {
                console.error('Failed to load units from storage', e);
            }
        };
        loadUnits();
    }, []);

    const handleHeightChange = (key, value) => {
        let cleanedValue = value.replace(/[^0-9.]/g, '');
        const parts = cleanedValue.split('.');
        if (parts.length > 2) return;
        if (parts.length === 2 && parts[1].length > 2) {
            cleanedValue = `${parts[0]}.${parts[1].slice(0, 2)}`;
        }
        const numericValue = parseFloat(cleanedValue);
        if (numericValue > 1000) cleanedValue = '1000'; // 최대 1000으로 제한
        setHeight((prev) => ({
            ...prev,
            [key]: cleanedValue,
        }));
    };

    const handleWeightChange = (value) => {
        let cleanedValue = value.replace(/[^0-9.]/g, '');
        const parts = cleanedValue.split('.');
        if (parts.length > 2) return;
        if (parts.length === 2 && parts[1].length > 2) {
            cleanedValue = `${parts[0]}.${parts[1].slice(0, 2)}`;
        }
        const numericValue = parseFloat(cleanedValue);
        if (numericValue > 1000) cleanedValue = '1000'; // 최대 1000으로 제한
        setWeight((prev) => ({
            ...prev,
            [weightUnit]: cleanedValue,
        }));
    };

    const handleNextStep = () => {
        const cleanHeight = heightUnit === 'feet'
            ? { feet: height.feet || undefined, inches: height.inches || undefined }
            : { cm: height.cm || undefined };

        const cleanWeight = weightUnit === 'kg'
            ? { kg: weight.kg || undefined }
            : { lbs: weight.lbs || undefined };

        navigation.navigate('Onboarding4', {
            gender: selectedGender,
            height: Object.fromEntries(Object.entries(cleanHeight).filter(([, value]) => value !== undefined)),
            weight: Object.fromEntries(Object.entries(cleanWeight).filter(([, value]) => value !== undefined)),
        });
    };

    const isNextButtonDisabled = (weightUnit === 'kg' && !weight.kg) || (weightUnit === 'lbs' && !weight.lbs)
        || (heightUnit === 'feet' && (!height.feet || !height.inches))
        || (heightUnit === 'cm' && !height.cm);

    return (
        <>
            <ProgressBar currentStep={3} navigation={navigation} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={styles.title}>현재 키와 몸무게가 몇인가요?</Text>
                    <Text style={styles.subTitle}>언제든지 변경 가능합니다.</Text>

                    <View style={styles.inputContainer}>
                        {heightUnit === 'feet' ? (
                            <View style={styles.heightInput}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={height.feet}
                                    onChangeText={(text) => handleHeightChange('feet', text)}
                                />
                                <Text style={styles.unitText}>feet</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={height.inches}
                                    onChangeText={(text) => handleHeightChange('inches', text)}
                                />
                                <Text style={styles.unitText}>inches</Text>
                            </View>
                        ) : (
                            <View style={styles.singleInput}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0"
                                    keyboardType="numeric"
                                    value={height.cm}
                                    onChangeText={(text) => handleHeightChange('cm', text)}
                                />
                                <Text style={styles.unitText}>cm</Text>
                            </View>
                        )}

                        <View style={styles.wrapContainer}>
                            <View style={styles.line} />
                            <Text style={styles.andText}>And</Text>
                            <View style={styles.line} />
                        </View>

                        <View style={styles.singleInput}>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={weight[weightUnit]}
                                onChangeText={handleWeightChange}
                            />
                            <Text style={styles.unitText}>{weightUnit}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.nextButton, isNextButtonDisabled && styles.disabledButton]}
                        onPress={handleNextStep}
                        disabled={isNextButtonDisabled}
                    >
                        <Text style={[styles.nextButtonText, isNextButtonDisabled && styles.disabledButtonText]}>다음</Text>
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
    },
    subTitle: {
        fontSize: 15,
        color: '#D8D8D8',
        marginTop: 8,
        lineHeight: 28,
        textAlign: 'left',
        marginBottom: height * 0.165,
    },
    inputContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    wrapContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        marginBottom: 28,
        width: 235,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#D8D8D8',
        marginHorizontal: 15,
    },
    andText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#D8D8D8',
        textAlign: 'center',
    },
    heightInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25,
    },
    singleInput: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#33373E',
        borderRadius: 8,
        width: 60,
        height: 45,
        fontSize: 20,
        color: '#FFFFFF',
        textAlign: 'center',
        marginHorizontal: 5,
    },
    unitText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#fff',
        marginHorizontal: 5,
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

export default Onboarding3;
