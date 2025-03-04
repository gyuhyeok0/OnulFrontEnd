import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, InputAccessoryView, KeyboardAvoidingView} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { useCurrentWeekAndDay } from '../../src/hooks/useCurrentWeekAndDay';
import {resetBodyData} from '../../src/modules/BodySlice'
import {saveBodyData} from '../../src/apis/BodyApi'
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import { selectBodyDataByDate } from '../../src/modules/BodySlice';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

const Body = ({ weightUnit, setWeightUnit }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();


    const getCurrentDate = () => {
        const now = new Date();
        return now.toLocaleDateString('en-CA'); // "YYYY-MM-DD" 형식 반환
    };
    
    const today = getCurrentDate();
    

    const memberId = useSelector((state) => state.member?.userInfo?.memberId);

    // 새로운 방식: YYYY-M-D 형식
    const dateKey = new Date()
        .toLocaleDateString('en-CA', { year: 'numeric', month: 'numeric', day: 'numeric' }); // YYYY-M-D 형식

    const bodyData = useSelector((state) => selectBodyDataByDate(state, dateKey));

    const { isDateChanged } = useCurrentWeekAndDay();

    const [pressedButtons, setPressedButtons] = useState([]); // 여러 버튼의 상태 추적


    const [tempState, setTempState] = useState(() => ({
        ...bodyData || {
            weight: 0,
            weightInLbs: 0,
            skeletalMuscleMass: 0,
            skeletalMuscleMassInLbs: 0,
            bodyFatMass: 0,
            bodyFatMassInLbs: 0,
            bodyFatPercentage: 0,
        }
    }));
    
    useEffect(() => {
        if (bodyData) {
            setTempState(bodyData);
            console.log("tempState updated with bodyData:", bodyData);
        }
    }, [bodyData]);
    

    const validateAndSet = (field, value) => {
        // 숫자 형식 검증 및 최대값 제한
        if (/^\d*\.?\d{0,1}$/.test(value)) {
            let numericValue = parseFloat(value) || 0;
    
            // 최대값 제한 (9999 미만)
            if (numericValue >= 9999) {
                numericValue = 9999;
            }
    
            setTempState((prev) => {
                const updatedState = { ...prev, [field]: numericValue.toString() };
    
                // 동적으로 다른 단위를 업데이트
                switch (field) {
                    case 'weight':
                        updatedState.weightInLbs = (numericValue * 2.20462).toFixed(1);
                        break;
                    case 'weightInLbs':
                        updatedState.weight = (numericValue / 2.20462).toFixed(1);
                        break;
                    case 'skeletalMuscleMass':
                        updatedState.skeletalMuscleMassInLbs = (numericValue * 2.20462).toFixed(1);
                        break;
                    case 'skeletalMuscleMassInLbs':
                        updatedState.skeletalMuscleMass = (numericValue / 2.20462).toFixed(1);
                        break;
                    case 'bodyFatMass':
                        updatedState.bodyFatMassInLbs = (numericValue * 2.20462).toFixed(1);
                        break;
                    case 'bodyFatMassInLbs':
                        updatedState.bodyFatMass = (numericValue / 2.20462).toFixed(1);
                        break;
                    default:
                        break;
                }
    
                return updatedState;
            });
    
            // 완료 버튼 상태 해제
            setPressedButtons((prev) => prev.filter((button) => button !== field));
        }
    };
    
    
    
    useEffect(() => {
        if (isDateChanged) {
            // 날짜가 변경된 경우 tempState 초기화
            setTempState(() => ({
                weight: 0,
                weightInLbs: 0,
                skeletalMuscleMass: 0,
                skeletalMuscleMassInLbs: 0,
                bodyFatMass: 0,
                bodyFatMassInLbs: 0,
                bodyFatPercentage: 0,
            }));
    
            console.log("tempState reset due to date change");
        }
    }, [isDateChanged]);
    
    
    
 // 고유한 InputAccessoryView ID
    const inputAccessoryViewIDForWeight = 'inputAccessoryViewWeight';
    const inputAccessoryViewIDForMuscle = 'inputAccessoryViewMuscle';
    const inputAccessoryViewIDForFatMass = 'inputAccessoryViewFatMass';

    // 변환 함수
    const convertToKg = (lbs) => (lbs / 2.20462).toFixed(1);
    const convertToLbs = (kg) => (kg * 2.20462).toFixed(1);

    // 단위 변경 시 모든 값 변환
    useEffect(() => {
        if (!weightUnit) return;

        setTempState((prev) => ({
            ...prev,
            weight: weightUnit === 'kg' ? (prev.weightInLbs ? convertToKg(prev.weightInLbs) : '') : (prev.weight ? convertToLbs(prev.weight) : ''),
            skeletalMuscleMass: weightUnit === 'kg' ? (prev.skeletalMuscleMassInLbs ? convertToKg(prev.skeletalMuscleMassInLbs) : '') : (prev.skeletalMuscleMass ? convertToLbs(prev.skeletalMuscleMass) : ''),
            bodyFatMass: weightUnit === 'kg' ? (prev.bodyFatMassInLbs ? convertToKg(prev.bodyFatMassInLbs) : '') : (prev.bodyFatMass ? convertToLbs(prev.bodyFatMass) : ''),
        }));
    }, [weightUnit]);

    const handleUnitChange = (unit) => {
        setWeightUnit(unit);
    };

    const renderKgButtons = () => {
        return ['kg', 'lbs'].map((label) => (
            <Pressable
                key={label}
                style={[
                    styles.timeButton,
                    weightUnit === label && styles.selectedButton // 선택된 버튼 스타일 추가
                ]}
                onPress={() => handleUnitChange(label)}
            >
                <Text
                    style={[
                        styles.buttonText,
                        weightUnit === label && styles.selectedButtonText // 선택된 버튼 텍스트 스타일 추가
                    ]}
                >
                    {label}
                </Text>
            </Pressable>
        ));
    };

    const handleComplete = (field) => {

        setPressedButtons((prev) => {
            if (!prev.includes(field)) {
                return [...prev, field]; // 새로운 버튼을 배열에 추가
            }
            return prev; // 중복 방지
        });

        const bodyData = {
            weight: tempState.weight || '0', // kg 단위
            weightInLbs: tempState.weightInLbs || '0', // lbs 단위
            skeletalMuscleMass: tempState.skeletalMuscleMass || '0', // kg 단위
            skeletalMuscleMassInLbs: tempState.skeletalMuscleMassInLbs || '0', // lbs 단위
            bodyFatMass: tempState.bodyFatMass || '0', // kg 단위
            bodyFatMassInLbs: tempState.bodyFatMassInLbs || '0', // lbs 단위
            bodyFatPercentage: tempState.bodyFatPercentage || '0', // 퍼센트 단위
            date: today, // 오늘 날짜 포함
        };
        
        dispatch(saveBodyData(memberId, bodyData)); // Redux 액션 호출
    };
    
    

    return (
        <>
            <KeyboardAvoidingView style={styles.container}>
                <View style={styles.body}>
                        <View>
                            <Text style={styles.titleText}>{t('Body.title')}</Text>

                            <Text style={{marginLeft:10, color:'#B8BFD1', fontWeight:'bold', fontSize: 13}}>
                                {t('Body.description')}
                            </Text>
                        </View>

                        {Platform.OS === 'android' && (
                            <View style={[styles.inputAccessoryView2, { flex: 1, padding: 10 }]}>
                                {renderKgButtons()}
                            </View>
                        )}

                    <View style={[styles.rowCommon, styles.row1]}>    

                        <View style={styles.recordContainer}>
                            <Text style={styles.subTitle}>{t('Body.weight')}</Text>

                            
                            <View style={{flexDirection:'row', margin:5, marginTop: 10, alignItems: 'center'}}>

                            <TextInput
                                style={styles.weightDisplay}
                                value={String(tempState.weight)} // 숫자를 문자열로 변환
                                onChangeText={(text) => validateAndSet('weight', text, setTempState)}
                                placeholder="0.0"
                                placeholderTextColor="#A0A8BC"
                                keyboardType="numeric"
                                inputAccessoryViewID={inputAccessoryViewIDForWeight}
                                selectTextOnFocus={true}
                            />

                                <Text style={{fontSize:20, color:'#BBB', fontWeight:'250', marginLeft:5}}>{weightUnit}</Text>
                            </View>

                            <Pressable
                                style={[
                                    styles.recordButton,
                                    pressedButtons.includes('weight') && styles.pressedCompleteButton, // 포함된 버튼은 초록색
                                ]}
                                onPress={() => handleComplete('weight')}
                            >
                                <Text style={styles.recordButtonText}>{t('Body.complete')}</Text>
                            </Pressable>
                        </View>


                        <View style={styles.recordContainer}>
                            <Text style={styles.subTitle}>{t('Body.skeletalMuscleMass')}</Text>

                            <View style={{flexDirection:'row', margin:5, marginTop: 10, alignItems: 'center'}}>
                                
                            <TextInput
                                style={styles.weightDisplay}
                                value={String(tempState.skeletalMuscleMass)}
                                onChangeText={(text) => validateAndSet('skeletalMuscleMass', text, setTempState)}
                                placeholder="0.0"
                                placeholderTextColor="#A0A8BC"
                                keyboardType="numeric"
                                inputAccessoryViewID={inputAccessoryViewIDForMuscle}
                                selectTextOnFocus={true}
                            />

                                <Text style={{fontSize:20, color:'#BBB', fontWeight:'250', marginLeft:5}}>{weightUnit}</Text>
                            </View>

                            <Pressable
                                style={[
                                    styles.recordButton,
                                    pressedButtons.includes('skeletalMuscleMass') && styles.pressedCompleteButton,
                                ]}
                                onPress={() => handleComplete('skeletalMuscleMass')}
                            >
                                <Text style={styles.recordButtonText}>{t('Body.complete')}</Text>
                            </Pressable>

                        </View>
                    </View>


                    <View style={[styles.rowCommon, styles.row2]}>
                        <View style={styles.recordContainer}>
                            <Text style={styles.subTitle}>{t('Body.bodyFatPercentage')}</Text>

                            <View style={{flexDirection:'row', margin:5, marginTop: 10, alignItems: 'center'}}>
                                
                            <TextInput
                                style={styles.weightDisplay}
                                value={
                                    tempState.bodyFatPercentage !== undefined
                                        ? String(tempState.bodyFatPercentage) // 값이 있으면 그대로 사용
                                        : null // undefined일 경우 placeholder가 보이도록 설정
                                }
                                onChangeText={(text) => validateAndSet('bodyFatPercentage', text, setTempState)}
                                placeholder="0.0"
                                placeholderTextColor="#A0A8BC"
                                keyboardType="numeric"
                                selectTextOnFocus={true}
                            />


                            

                                <Text style={{fontSize:20, color:'#BBB', fontWeight:'250', marginLeft:5}}>%</Text>
                            </View>
                            <Pressable
                                style={[
                                    styles.recordButton,
                                    pressedButtons.includes('bodyFatPercentage') && styles.pressedCompleteButton,
                                ]}
                                onPress={() => handleComplete('bodyFatPercentage')}
                            >
                                <Text style={styles.recordButtonText}>{t('Body.complete')}</Text>
                            </Pressable>

                        </View>

                        <View style={styles.recordContainer}>
                            <Text style={styles.subTitle}>{t('Body.bodyFatMass')}</Text>

                            <View style={{flexDirection:'row', margin:5, marginTop: 10, alignItems: 'center'}}>
                                
                                <TextInput
                                    style={styles.weightDisplay}
                                    value={String(tempState.bodyFatMass)}
                                    onChangeText={(text) => validateAndSet('bodyFatMass', text, setTempState)}
                                    placeholder="0.0"
                                    placeholderTextColor="#A0A8BC"
                                    keyboardType="numeric"
                                    inputAccessoryViewID={inputAccessoryViewIDForFatMass}
                                    selectTextOnFocus={true}
                                />

                                <Text style={{fontSize:20, color:'#BBB', fontWeight:'250', marginLeft:5}}>{weightUnit}</Text>
                                </View>

                                <Pressable
                                    style={[
                                        styles.recordButton,
                                        pressedButtons.includes('bodyFatMass') && styles.pressedCompleteButton,
                                    ]}
                                    onPress={() => handleComplete('bodyFatMass')}
                                >
                                    <Text style={styles.recordButtonText}>{t('Body.complete')}</Text>
                                </Pressable>

                        </View>
                    </View>
                </View>

            </KeyboardAvoidingView>

            {Platform.OS === 'ios' ? (

            <>
                {/* InputAccessoryView 연결 */}
                <InputAccessoryView nativeID={inputAccessoryViewIDForWeight}>
                    <View style={styles.inputAccessoryView}>{renderKgButtons()}</View>
                </InputAccessoryView>
                <InputAccessoryView nativeID={inputAccessoryViewIDForMuscle}>
                    <View style={styles.inputAccessoryView}>{renderKgButtons()}</View>
                </InputAccessoryView>
                <InputAccessoryView nativeID={inputAccessoryViewIDForFatMass}>
                    <View style={styles.inputAccessoryView}>{renderKgButtons()}</View>
                </InputAccessoryView>
            </>
            ) : (
                <></>
            )}
    
        </>
    );
};

const styles = StyleSheet.create({
    
    
    container: {
        padding:15,
    },

    body:{
        minHeight: 150,
        backgroundColor:'#222732',
        borderRadius:15,
    },

    titleText: {
        color:'white',
        fontSize: 20,
        fontWeight:'bold',
        margin:10
    },

    rowCommon: {
        flexDirection: 'row', // 가로 방향 정렬
        justifyContent: 'space-between', // 자식 간의 간격 균등 분배
        paddingHorizontal: 10, // 좌우 여백 추가
        alignItems: 'center', // 세로 방향 정렬
        marginBottom: 10,
    },

    row1:{
        marginTop:7,
    },

    recordContainer:{
        width: '49%',
        backgroundColor:'#333845',
        minHeight: 80,
        borderRadius:15,
        justifyContent:'center',
        alignItems:'center'
    },


    subTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 13,
    },

    weightDisplay: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        // marginBottom: 5,
    },

    recordButton: {
        backgroundColor: '#497CF4',
        borderRadius: 20,
        paddingVertical: 7,
        paddingHorizontal: 20,
        marginBottom: 10,
    },

    recordButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    inputAccessoryView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        backgroundColor: '#CCCFD4',
    },

    inputAccessoryView2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
    },

    timeButton: {
        flex: 1,
        marginHorizontal: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        backgroundColor: '#fff',
        height: 30,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },

    selectedButton: {
        backgroundColor: '#497CF4', // 선택된 버튼의 배경색
    },
    selectedButtonText: {
        color: 'white', // 선택된 버튼 텍스트 색
        fontWeight: 'bold',
    },

    pressedCompleteButton: {
        backgroundColor: '#34C759', // 초록색
    },

});

export default Body;