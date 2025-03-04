import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressBar from '../../common/ProgressBar';
import styles from './Onboarding4.module';
import { registrationOnboarding } from '../../../hooks/HendleOnboarding';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';


const Onboarding4 = ({ navigation, route }) => {
    const { t } = useTranslation();
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
                console.error('저장된 단위를 불러오는 데 실패했습니다.', error);
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

    const handleNextStep = async () => {
        if (!isNextButtonDisabled) {
            // lbs -> kg 변환
            const convertToKg = (value) => (basicUnit === 'lbs' && value !== '' && value !== -1) ? Math.round(value * 0.453592) : value;
    
            const onboardingData = {
                gender,
                height,
                weight,
                heightUnit,
                weightUnit,
                basicUnit,
    
                benchPress1rm: unknownValues.benchPress ? -1 : convertToKg(benchPress),  
                deadlift1rm: unknownValues.deadlift ? -1 : convertToKg(deadlift),  
                squat1rm: unknownValues.squat ? -1 : convertToKg(squat),  
    
                memberId: userId,  
                accessToken: accessToken   
            };
    
            // 다음 단계로 진행
            registrationOnboarding(onboardingData, navigation);
        }
    };

    const toggleUnit = async () => {
        const newUnit = basicUnit === 'lbs' ? 'kg' : 'lbs';
        setBasicUnit(newUnit);
        try {
            await AsyncStorage.setItem('basicUnit', newUnit);
        } catch (error) {
            console.error('무게 단위를 저장하는 데 실패했습니다.', error);
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
                
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    extraScrollHeight={20} // 키보드 위 여백
                    enableOnAndroid={true} // Android에서도 작동하도록 설정
                >

                    <View style={styles.container}>
                        <Text style={styles.title}>{t("onboarding4.title")}</Text>
                        <Text style={styles.subTitle}>{t("onboarding4.subtitle")}</Text>

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
                        <Text style={styles.label}>{t("onboarding4.benchPress")}</Text>
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
                                    <Text style={styles.unknownButtonText}>{t("onboarding4.unknown")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Deadlift */}
                        <View style={styles.inputRow}>
                            <Text style={styles.label}>{t("onboarding4.deadlift")}</Text>
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
                                    <Text style={styles.unknownButtonText}>{t("onboarding4.unknown")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Squat */}
                        <View style={styles.inputRow}>
                            <Text style={styles.label}>{t("onboarding4.squat")}</Text>
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
                                    <Text style={styles.unknownButtonText}>{t("onboarding4.unknown")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Next Button */}
                        <TouchableOpacity
                            style={[styles.nextButton, isNextButtonDisabled && styles.disabledButton]}
                            onPress={handleNextStep}
                            disabled={isNextButtonDisabled}
                        >
                            <Text style={[styles.nextButtonText, isNextButtonDisabled && styles.disabledButtonText]}>                                
                                {t("onboarding4.next")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </>
    );
};

export default Onboarding4;