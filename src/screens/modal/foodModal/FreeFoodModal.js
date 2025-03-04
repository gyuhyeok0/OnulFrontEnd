import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux'; // useDispatch 가져오기
import { saveTotalFoodData } from '../../../apis/FoodApi';
import { useTranslation } from 'react-i18next';

const FreeFoodModal = ({ isVisible, onClose, setFreeOnclose, memberId, mealType }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [unit, setUnit] = useState('g');
    const [calories, setCalories] = useState('');
    const [carbs, setCarbs] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const gOrOzUnit = await AsyncStorage.getItem('gOrOzUnit');
                if (gOrOzUnit === null) {
                    await AsyncStorage.setItem('gOrOzUnit', 'g');
                    setUnit('g');
                } else {
                    setUnit(gOrOzUnit);
                }
            } catch (error) {
                console.error('Error fetching units:', error);
            }
        };

        fetchUnits();
    }, []);

    const handleUnitChange = async (newUnit) => {
        if (newUnit === unit) return;

        const conversionFactor = newUnit === 'oz' ? 1 / 28.3495 : 28.3495; // g ↔ oz 변환 계수

        // 단위가 변경되면 모든 입력값을 변환
        setQuantity(convertUnits(quantity, newUnit));
        setCarbs(convertUnits(carbs, newUnit));
        setProtein(convertUnits(protein, newUnit));
        setFat(convertUnits(fat, newUnit));

        setUnit(newUnit);
        await AsyncStorage.setItem('gOrOzUnit', newUnit);
    };

    const convertUnits = (value, toUnit) => {
        if (!value) return '';
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) return '';
        return toUnit === 'oz' ? (numericValue / 28.3495).toFixed(1) : (numericValue * 28.3495).toFixed(1);
    };

    // 유효성 검사 함수: 숫자와 소수점만 허용
    const handleNumericInput = (text) => {
        let numericValue = text
            .replace(/[^0-9.]/g, '')  // 숫자와 소수점만 허용
            .replace(/(\..*?)\..*/g, '$1')  // 소수점 하나만 허용
            .replace(/^0+(?=\d)/, '');  // 숫자 앞의 불필요한 0 제거
    
        // 숫자가 99999를 초과하면 99999로 제한
        const parsedValue = parseFloat(numericValue);
        return !isNaN(parsedValue) && parsedValue > 99999 ? '99999' : numericValue;
    };
    


    const handleSubmit = async () => {
        const recipeNames = ["Free"];
    
        // 소수점 1자리로 반올림하는 함수
        const roundToOneDecimal = (value) => {
            return Math.round(value * 10) / 10;
        };
    
        // 단위에 따른 변환 처리
        const totalNutrition = {
            grams: unit === 'oz'
                ? roundToOneDecimal(parseFloat(quantity) * 28.3495 || 0) // oz → g 변환 후 반올림
                : roundToOneDecimal(parseFloat(quantity) || 0),  // g이면 그대로 사용 후 반올림
            kcal: roundToOneDecimal(parseFloat(calories) || 0), // 칼로리 반올림
            protein: unit === 'oz'
                ? roundToOneDecimal(parseFloat(protein) * 28.3495 || 0) // oz → g 변환 후 반올림
                : roundToOneDecimal(parseFloat(protein) || 0),  // g이면 그대로 사용 후 반올림
            carbs: unit === 'oz'
                ? roundToOneDecimal(parseFloat(carbs) * 28.3495 || 0) // oz → g 변환 후 반올림
                : roundToOneDecimal(parseFloat(carbs) || 0),  // g이면 그대로 사용 후 반올림
            fat: unit === 'oz'
                ? roundToOneDecimal(parseFloat(fat) * 28.3495 || 0) // oz → g 변환 후 반올림
                : roundToOneDecimal(parseFloat(fat) || 0),  // g이면 그대로 사용 후 반올림
        };

        const getCurrentDate = () => {
            const now = new Date();
            return now.toLocaleDateString('en-CA'); // "YYYY-MM-DD" 형식 반환
        };
        
        const formattedDate = getCurrentDate();

    

        try {
            await saveTotalFoodData(memberId, mealType, formattedDate, totalNutrition, recipeNames, null, dispatch);
            // 데이터 저장 성공 시 모달 닫기
        } catch (error) {
            console.error('데이터 저장 실패:', error);
        }

        setFreeOnclose(true);
        onClose(); // 성공 시 모달 닫기
    };
    

    return (
        <Modal transparent={true} visible={isVisible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{t('FreeFoodModal.title')}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#999" style={styles.closeIcon} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <Text style={{fontSize: 15, fontWeight:'bold', marginBottom: 5}}>
                            {t('FreeFoodModal.unitSelection')}
                        </Text>
                        <View style={styles.unitSelection}>
                            <TouchableOpacity
                                style={unit === 'g' ? styles.selectedUnit : styles.unitButton}
                                onPress={() => handleUnitChange('g')}
                            >
                                <Text style={styles.unitText}>g</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={unit === 'oz' ? styles.selectedUnit : styles.unitButton}
                                onPress={() => handleUnitChange('oz')}
                            >
                                <Text style={styles.unitText}>oz</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{fontSize: 15, fontWeight:'bold', marginBottom: 5}}>
                            {t('FreeFoodModal.nutritionInput')}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder={t('FreeFoodModal.quantity')}
                            value={quantity}
                            onChangeText={(text) => setQuantity(handleNumericInput(text))}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={t('FreeFoodModal.calories')}
                            value={calories}
                            onChangeText={(text) => setCalories(handleNumericInput(text))}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={t('FreeFoodModal.carbs')}
                            value={carbs}
                            onChangeText={(text) => setCarbs(handleNumericInput(text))}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={t('FreeFoodModal.protein')}
                            value={protein}
                            onChangeText={(text) => setProtein(handleNumericInput(text))}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={t('FreeFoodModal.fat')}
                            value={fat}
                            onChangeText={(text) => setFat(handleNumericInput(text))}
                            keyboardType="numeric"
                        />

                    </ScrollView>

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>{t('FreeFoodModal.complete')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        minHeight: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeIcon: {
        marginRight: 10,
    },
    content: {
        marginTop: 20,
    },
    unitSelection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 10,
        marginBottom: 20
    },
    unitButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#D4D4D8',
        flex: 1,
    },
    selectedUnit: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#A29BFE',
        flex: 1,
    },
    unitText: {
        fontWeight: 'bold',
        color: '#000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: '#497CF4',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FreeFoodModal;