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

import {saveFoodData} from '../../../apis/FoodApi'
import { useSelector } from 'react-redux';


const RecipeEditModal = ({ isVisible, onClose, id, foodItems = [], initialRecipeName = '' }) => {
    const [rows, setRows] = useState([
        {
            id: Date.now(), // 기본 상태
            foodName: '',
            quantity: '',
            calories: '',
            protein: '',
            carbs: '',
            fat: '',
        },
    ]);
        
    const [unit, setUnit] = useState('g');
    const [recipeName, setRecipeName] = useState('');
    const [foodName, setFoodName] = useState('');

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const memberId = useSelector((state) => state.member?.userInfo?.memberId);


    const maxLength = 40; // 최대 50자 제한

    useEffect(() => {

        console.log("이펙트 실행")
        const initializeRows = async () => {
            try {
                const storedUnit = await AsyncStorage.getItem('gOrOzUnit') || 'g'; // 단위 가져오기, 기본값은 'g'
    
                if (foodItems && foodItems.length > 0) {
                    console.log("뭔가있어")
                    const mappedRows = foodItems.map((item) => ({
                        id: Date.now() + Math.random(), // 고유 ID 생성
                        foodName: item.foodName || '',
                        quantity: storedUnit === 'oz' ? (parseFloat(item.quantity) / 28.3495).toFixed(1) : item.quantity || '',
                        calories: item.calories || '',
                        protein: storedUnit === 'oz' ? (parseFloat(item.protein) / 28.3495).toFixed(1) : item.protein || '',
                        carbs: storedUnit === 'oz' ? (parseFloat(item.carbs) / 28.3495).toFixed(1) : item.carbs || '',
                        fat: storedUnit === 'oz' ? (parseFloat(item.fat) / 28.3495).toFixed(1) : item.fat || '',
                    }));
                    setRows(mappedRows); // 변환된 값 설정
                } else {
                    console.log("없어")
                }
    
                setRecipeName(initialRecipeName); // 레시피 이름 설정
            } catch (error) {
                console.error('Failed to initialize rows:', error);
            }
        };
    
        initializeRows();
    }, []);
    

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

    const addRow = () => {
        setRows([...rows, { id: Date.now(), foodName: '', quantity: '', calories: '', protein: '', carbs: '', fat: '' }]);
    };

    const deleteRow = (rowId) => {
        setRows(rows.filter((row) => row.id !== rowId));
    };

    const handleNumericInput = (text) => {
        const numericValue = text.replace(/[^0-9.]/g, '') // 숫자와 소수점만 허용
                                 .replace(/(\..*?)\..*/g, '$1') // 소수점 하나만 허용
                                 .replace(/^0+(?=\d)/, ''); // 숫자 앞의 불필요한 0 제거
        const parsedValue = parseFloat(numericValue);
        return !isNaN(parsedValue) && parsedValue > 99999 ? '99999' : numericValue;
    };
    

    const convertUnits = (value, toUnit) => {
        if (!value) return '';
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) return '';
        return toUnit === 'oz' ? (numericValue / 28.3495).toFixed(1) : (numericValue * 28.3495).toFixed(1);
    };

    const handleUnitChange = async (newUnit) => {

        // 현재 단위와 동일하면 아무 작업도 하지 않음
        if (newUnit === unit) {
            return;
        }

        const conversionFactor = newUnit === 'oz' ? 1 / 28.3495 : 28.3495; // g ↔ oz 변환 계수
        const updatedRows = rows.map((row) => ({
            ...row,
            quantity: convertUnits(row.quantity, newUnit),
            // calories: row.calories ? (parseFloat(row.calories) * conversionFactor).toFixed(1) : '',
            protein: row.protein ? (parseFloat(row.protein) * conversionFactor).toFixed(1) : '',
            carbs: row.carbs ? (parseFloat(row.carbs) * conversionFactor).toFixed(1) : '',
            fat: row.fat ? (parseFloat(row.fat) * conversionFactor).toFixed(1) : '',
        }));
        setRows(updatedRows);
        setUnit(newUnit);
        await AsyncStorage.setItem('gOrOzUnit', newUnit);
    };
    

    const sanitizeInput = (text) => {
        return text.replace(/[^\p{L}\p{N}\s]/gu, ''); // 특수문자 제외, 유니코드 지원
    };

    const validateInputs = () => {
        const isRecipeNameValid = recipeName.trim().length > 0;
        const areRowsValid = rows.every((row) => row.foodName.trim().length > 0);
        setIsSubmitDisabled(!(isRecipeNameValid && areRowsValid));
    };

    useEffect(() => {
        validateInputs();
    }, [recipeName, rows]);

    const handleSubmit = async () => {
        const foodItems = rows.map(({ foodName, quantity, calories, protein, carbs, fat }) => ({
            foodName: foodName || "Unknown", // 음식 이름이 없으면 "Unknown"으로 설정
            quantity: unit === 'oz'
                ? (parseFloat(quantity) * 28.3495 || 0).toFixed(1) // oz → g 변환 후 값이 없으면 0
                : quantity || "0", // 값이 없으면 0
            calories: calories || "0", // 칼로리는 변환 없이 그대로 사용
            protein: unit === 'oz'
                ? (parseFloat(protein) * 28.3495 || 0).toFixed(1)
                : protein || "0",
            carbs: unit === 'oz'
                ? (parseFloat(carbs) * 28.3495 || 0).toFixed(1)
                : carbs || "0",
            fat: unit === 'oz'
                ? (parseFloat(fat) * 28.3495 || 0).toFixed(1)
                : fat || "0",
        }));
    
        try {
            await saveFoodData(memberId, id, recipeName, foodItems);
            console.log('데이터 저장 성공!');
            onClose(); // 성공 시 모달 닫기
        } catch (error) {
            console.error('데이터 저장 실패:', error);
        }
    };
    
    

    return (
        <Modal transparent={true} visible={isVisible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>레시피 등록</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#999" style={styles.closeIcon} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <Text style={[styles.label, {color:'red'} ]}>식단 이름</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="레시피 이름"
                            maxLength={maxLength}
                            value={recipeName} // recipeName이 있으면 표시
                            onChangeText={(text) => setRecipeName(sanitizeInput(text))}
                        />

                        <View style={{ flexDirection: 'row', gap: 5 }}>
                            <TouchableOpacity
                                style={[
                                    {
                                        padding: 7,
                                        flex: 1,
                                        borderRadius: 5,
                                        backgroundColor: unit === 'g' ? '#A29BFE' : '#D4D4D8',
                                    },
                                ]}
                                onPress={() => handleUnitChange('g')}
                            >
                                <Text style={{ fontWeight: 'bold', textAlign: 'center', color: unit === 'g' ? '#FFF' : '#000' }}>g</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    {
                                        padding: 7,
                                        flex: 1,
                                        borderRadius: 5,
                                        backgroundColor: unit === 'oz' ? '#A29BFE' : '#D4D4D8',
                                    },
                                ]}
                                onPress={() => handleUnitChange('oz')}
                            >
                                <Text style={{ fontWeight: 'bold', textAlign: 'center', color: unit === 'oz' ? '#FFF' : '#000' }}>oz</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.sectionTitle}>음식 등록</Text>
                        <Text style={styles.subtitle}>반드시 음식 이름과 용량을 먼저 입력해주세요</Text>

                        {rows.map((row) => (
                            <View key={row.id} style={styles.row}>
                                <View style={{ width: '30%', backgroundColor: 'white', height: 100, borderRadius: 15, padding: 5 }}>
                                    <Text style={{ fontSize: 12, margin: 1, color:'#F52121', fontWeight:'bold' }}>음식 이름</Text>
                                    <TextInput
                                        style={styles.inputDetail}
                                        placeholder="음식 이름"
                                        maxLength={maxLength}
                                        value={row.foodName} // 개별 row 상태와 연동
                                        onChangeText={(text) => {
                                            const updatedRows = rows.map((r) => (r.id === row.id ? { ...r, foodName: sanitizeInput(text) } : r));
                                            setRows(updatedRows);
                                        }}
                                    />

                                    <Text style={{ fontSize: 12, marginTop: 5, margin: 1 }}>용량</Text>
                                    <TextInput
                                        style={styles.inputDetail}
                                        value={row.quantity}
                                        placeholder="00.0"
                                        keyboardType="numeric"
                                        maxLength={6}
                                        onChangeText={(text) => {
                                            const updatedRows = rows.map((r) => (r.id === row.id ? { ...r, quantity: handleNumericInput(text) } : r));
                                            setRows(updatedRows);
                                        }}
                                        selectTextOnFocus={true}
                                    />
                                </View>

                                <View style={{ width: '70%', backgroundColor: 'white', height: 100, borderRadius: 15, flexDirection: 'row', padding: 5, justifyContent: 'space-between' }}>
                                    <View style={{ width: '87%', flexDirection: 'row', gap: 15 }}>
                                        <View style={{ width: '48%' }}>
                                            <Text style={{ fontSize: 12, margin: 1 }}>칼로리</Text>
                                            <TextInput
                                                style={styles.inputDetail}
                                                value={row.calories}
                                                placeholder="00.0"
                                                keyboardType="numeric"
                                                maxLength={6}
                                                onChangeText={(text) => {
                                                    const updatedRows = rows.map((r) => (r.id === row.id ? { ...r, calories: handleNumericInput(text) } : r));
                                                    setRows(updatedRows);
                                                }}
                                                selectTextOnFocus={true}
                                            />

                                            <Text style={{ fontSize: 12, marginTop: 5, margin: 1 }}>단백질</Text>
                                            <TextInput
                                                style={styles.inputDetail}
                                                value={row.protein}
                                                placeholder="00.0"
                                                keyboardType="numeric"
                                                maxLength={6}
                                                onChangeText={(text) => {
                                                    const updatedRows = rows.map((r) => (r.id === row.id ? { ...r, protein: handleNumericInput(text) } : r));
                                                    setRows(updatedRows);
                                                }}
                                                selectTextOnFocus={true}
                                            />
                                        </View>

                                        <View style={{ width: '48%' }}>
                                            <Text style={{ fontSize: 12, margin: 1 }}>탄수화물</Text>
                                            <TextInput
                                                style={styles.inputDetail}
                                                value={row.carbs}
                                                placeholder="00.0"
                                                keyboardType="numeric"
                                                maxLength={6}
                                                onChangeText={(text) => {
                                                    const updatedRows = rows.map((r) => (r.id === row.id ? { ...r, carbs: handleNumericInput(text) } : r));
                                                    setRows(updatedRows);
                                                }}
                                                selectTextOnFocus={true}
                                            />

                                            <Text style={{ fontSize: 12, marginTop: 5, margin: 1 }}>지방</Text>
                                            <TextInput
                                                style={styles.inputDetail}
                                                value={row.fat}
                                                placeholder="00.0"
                                                keyboardType="numeric"
                                                maxLength={6}
                                                onChangeText={(text) => {
                                                    const updatedRows = rows.map((r) => (r.id === row.id ? { ...r, fat: handleNumericInput(text) } : r));
                                                    setRows(updatedRows);
                                                }}
                                                selectTextOnFocus={true}
                                            />
                                        </View>
                                    </View>

                                    <TouchableOpacity onPress={() => deleteRow(row.id)}>
                                        <Ionicons name="close" size={20} color="#999" style={{ marginRight: 5 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}

                        <TouchableOpacity style={styles.addButton} onPress={addRow}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <TouchableOpacity
                        style={[
                            styles.completeButtonFixed,
                            isSubmitDisabled && { backgroundColor: '#CCC' }, // 비활성화 상태 색상
                        ]}
                        disabled={isSubmitDisabled} // 비활성화 상태 적용
                        onPress={handleSubmit} // handleSubmit 호출
                    >
                        <Text style={styles.completeButtonText}>완료</Text>
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
        width: '95%',
        height: '65%',
        backgroundColor: '#F4F4F4',
        borderRadius: 15,
        padding: 15,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        fontSize: 16,
        color: '#999',
    },
    content: {
        flex: 1,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 5,
        backgroundColor: '#FFF',
    },
    inputDetail: {
        backgroundColor: '#EFEFEF',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        position: 'relative',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
        marginTop: 12,
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
        marginTop: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 5,
    },
    completeButtonFixed: {
        backgroundColor: '#A29BFE',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        left: '5%',
        right: '5%',
    },
    completeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom: 100,
    },
    addButtonText: {
        color: 'black',
        fontSize: 25,
        fontWeight: 'bold',
    },
});

export default RecipeEditModal;
