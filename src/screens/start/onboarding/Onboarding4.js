import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBar from '../../common/ProgressBar';
import styles from './Onboarding4.module';
import { registrationOnboarding } from '../../../hooks/HendleOnboarding';
import { useSelector } from 'react-redux';

const Onboarding4 = ({ navigation, route }) => {
    const { gender, height, weight } = route.params;

    const userId = useSelector((state) => state.member.userInfo.memberId);
    const accessToken = useSelector((state) => state.member.userInfo.accessToken);

    const [basicUnit, setBasicUnit] = useState(''); 
    const [benchPress, setBenchPress] = useState('');
    const [deadlift, setDeadlift] = useState('');
    const [squat, setSquat] = useState('');
    const [unknownValues, setUnknownValues] = useState({
        benchPress: false,
        deadlift: false,
        squat: false
    });
    const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
    const [heightUnit, setHeightUnit] = useState('feet');
    const [weightUnit, setWeightUnit] = useState('lbs');

    useEffect(() => {
        const loadUnits = async () => {
            try {
                const savedWeightUnit = await AsyncStorage.getItem('weightUnit') || 'lbs';
                const savedHeightUnit = await AsyncStorage.getItem('heightUnit') || 'feet';
                setWeightUnit(savedWeightUnit);
                setHeightUnit(savedHeightUnit);
                setBasicUnit(savedWeightUnit);
            } catch (error) {
                console.error('Failed to load units from storage.', error);
            }
        };

        loadUnits();
    }, []);

    useEffect(() => {
        const allFieldsCompleted =  (benchPress || unknownValues.benchPress) &&
                                    (deadlift || unknownValues.deadlift) &&
                                    (squat || unknownValues.squat);
        setIsNextButtonDisabled(!allFieldsCompleted);
    }, [benchPress, deadlift, squat, unknownValues]);

    const handleNextStep = () => {
        if (!isNextButtonDisabled) {
            const onboardingData = {
                gender,
                height,
                weight,
                heightUnit,
                weightUnit,
                basicUnit,

                benchPress1rm: unknownValues.benchPress ? -1 : benchPress,  
                deadlift1rm: unknownValues.deadlift ? -1 : deadlift,  
                squat1rm: unknownValues.squat ? -1 : squat,  

                memberId: userId,  
                accessToken: accessToken   
            };

            registrationOnboarding(onboardingData, navigation);
        }
    };

    const toggleUnit = async () => {
        const newUnit = basicUnit === 'lbs' ? 'kg' : 'lbs';
        setBasicUnit(newUnit);
        try {
            await AsyncStorage.setItem('basicUnit', newUnit);
        } catch (error) {
            console.error('Failed to save the weight unit to storage.', error);
        }
    };

    const handleInputChange = (type, value) => {
        const cleanedValue = value.replace(/[^0-9]/g, '');
        const numericValue = parseInt(cleanedValue, 10);
        
        // 최대 1000으로 제한
        if (numericValue > 1000) {
            if (type === 'benchPress') setBenchPress('1000');
            else if (type === 'deadlift') setDeadlift('1000');
            else if (type === 'squat') setSquat('1000');
        } else {
            if (type === 'benchPress') setBenchPress(cleanedValue);
            else if (type === 'deadlift') setDeadlift(cleanedValue);
            else if (type === 'squat') setSquat(cleanedValue);
        }
    };

    const handleUnknownToggle = (type) => {
        setUnknownValues(prevState => ({
            ...prevState,
            [type]: !prevState[type]
        }));
    };

    return (
        <>
            <ProgressBar currentStep={4} navigation={navigation} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={styles.title}>한 번에 들 수 있는 최대 무게를 입력해주세요</Text>
                    <Text style={styles.subTitle}>회원님만을 위한 운동 프로그램</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 30 }}>
                        <Text style={[styles.unitText, basicUnit === 'lbs' && styles.activeUnit]}>lbs</Text>
                        <TouchableOpacity style={styles.toggleSwitch} onPress={toggleUnit}>
                            <View
                                style={[
                                    styles.toggleCircle,
                                    basicUnit === 'kg' ? styles.toggleRight : styles.toggleLeft,
                                ]}
                            />
                        </TouchableOpacity>
                        <Text style={[styles.unitText, basicUnit === 'kg' && styles.activeUnit]}>kg</Text>
                    </View>

                    {/* Bench Press */}
                    <View style={styles.inputRow}>
                        <Text style={styles.label}>벤치프레스</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={unknownValues.benchPress ? '' : benchPress}
                                editable={!unknownValues.benchPress}
                                onChangeText={(text) => handleInputChange('benchPress', text)}
                            />
                            <Text style={styles.unitText}>{basicUnit}</Text>
                            <TouchableOpacity
                                style={[styles.unknownButton, unknownValues.benchPress && styles.selectedUnknownButton]}
                                onPress={() => handleUnknownToggle('benchPress')}
                            >
                                <Text style={styles.unknownButtonText}>몰라요</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Deadlift */}
                    <View style={styles.inputRow}>
                        <Text style={styles.label}>데드리프트</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={unknownValues.deadlift ? '' : deadlift}
                                editable={!unknownValues.deadlift}
                                onChangeText={(text) => handleInputChange('deadlift', text)}
                            />
                            <Text style={styles.unitText}>{basicUnit}</Text>
                            <TouchableOpacity
                                style={[styles.unknownButton, unknownValues.deadlift && styles.selectedUnknownButton]}
                                onPress={() => handleUnknownToggle('deadlift')}
                            >
                                <Text style={styles.unknownButtonText}>몰라요</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Squat */}
                    <View style={styles.inputRow}>
                        <Text style={styles.label}>스쿼트</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                keyboardType="numeric"
                                value={unknownValues.squat ? '' : squat}
                                editable={!unknownValues.squat}
                                onChangeText={(text) => handleInputChange('squat', text)}
                            />
                            <Text style={styles.unitText}>{basicUnit}</Text>
                            <TouchableOpacity
                                style={[styles.unknownButton, unknownValues.squat && styles.selectedUnknownButton]}
                                onPress={() => handleUnknownToggle('squat')}
                            >
                                <Text style={styles.unknownButtonText}>몰라요</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Next Button */}
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

export default Onboarding4;
