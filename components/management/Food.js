import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput ,TouchableOpacity} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useCurrentWeekAndDay } from '../../src/hooks/useCurrentWeekAndDay';
import { resetBodyData } from '../../src/modules/BodySlice';
import { saveBodyData } from '../../src/apis/BodyApi';

import { selectBodyDataByDate } from '../../src/modules/BodySlice';
import Foodmodal from '../../src/screens/modal/foodModal/Foodmodal';
import { fetchTotalFoodSuccess, selectTodayFoodData } from '../../src/modules/TotalFoodSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Food = () => {
    const dispatch = useDispatch();

    const { isDateChanged } = useCurrentWeekAndDay();
    
    // 오늘 날짜 계산 (YYYY-MM-DD 형식)
    const today = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'numeric', day: 'numeric' });

    // Redux에서 오늘 날짜 기준 데이터를 조회
    const todayFoodData = useSelector((state) => selectTodayFoodData(state, today));
    
    const totalFoodState2 = useSelector((state) => state.totalFood);

    const [unit, setUnit] = useState('g'); // 기본 단위는 'g'

    const [mealType, setMealType] = useState(''); // 현재 선택된 식사 타입

    const [isModalVisible, setModalVisible] = useState(false);


    useEffect(() => {

        const fetchUnit = async () => {
            try {
                let storedUnit = await AsyncStorage.getItem('gOrOzUnit');
    
                if (!storedUnit) {
                    // gOrOzUnit이 없으면 weightUnit을 확인
                    const weightUnit = await AsyncStorage.getItem('weightUnit');
                    
                    // weightUnit에 따라 gOrOzUnit 설정
                    if (weightUnit === 'kg') {
                        storedUnit = 'g';
                    } else if (weightUnit === 'lbs') {
                        storedUnit = 'oz';
                    } else {
                        storedUnit = 'g'; // 기본값으로 'g' 설정
                    }
    
                    // gOrOzUnit에 값 설정
                    await AsyncStorage.setItem('gOrOzUnit', storedUnit);
                }
    
                setUnit(storedUnit); // 단위 상태 업데이트
            } catch (error) {
                console.error('Failed to fetch unit:', error);
            }
        };
    
        fetchUnit(); // 비동기 함수 호출
    }, [isModalVisible]); // isModalVisible이 변경될 때마다 실행
    


    // 변환 함수 추가
    const convertValue = (value, unit) => {
        if (unit === 'oz') {
            return parseFloat((value / 28.3495).toFixed(2)); // g -> oz 변환 후 소수점 뒤 0 제거
        }
        return parseFloat(value); // 기본 g 단위 그대로 반환 (소수점 뒤 0 제거)
    };

    // todayFoodData와 unit 변경 시 mealData 업데이트
    useEffect(() => {
        console.log("실행")
        if (todayFoodData && unit) {
            setMealData((prevData) => {
                const updatedData = { ...prevData };
                ['breakfast', 'lunch', 'dinner', 'snack'].forEach((mealType) => {
                    const nutrition = todayFoodData[mealType]?.totalNutrition;
                    if (nutrition) {
                        updatedData[mealType] = {
                            totalNutrition: {
                                carbs: convertValue(nutrition.carbs, unit),
                                fat: convertValue(nutrition.fat, unit),
                                grams: convertValue(nutrition.grams, unit),
                                kcal: nutrition.kcal, // kcal은 변환하지 않음
                                protein: convertValue(nutrition.protein, unit),
                            },
                        };
                    }
                });
                return updatedData;
            });
        }
    }, [todayFoodData, unit]);


    
    

    // 소수점 1자리까지 반올림하는 함수
    const roundToOneDecimal = (value) => {
        return Math.round(value * 10) / 10;
    };

    // 기본 상태 (기본값 0)
    const [mealData, setMealData] = useState({
        breakfast: {
            totalNutrition: { carbs: 0, fat: 0, grams: 0, kcal: 0, protein: 0 },
        },
        lunch: {
            totalNutrition: { carbs: 0, fat: 0, grams: 0, kcal: 0, protein: 0 },
        },
        dinner: {
            totalNutrition: { carbs: 0, fat: 0, grams: 0, kcal: 0, protein: 0 },
        },
        snack: {
            totalNutrition: { carbs: 0, fat: 0, grams: 0, kcal: 0, protein: 0 },
        },
    });

    useEffect(() => {
        if (isDateChanged) {
            // 날짜가 변경된 경우 상태 초기화
            setMealData({
                breakfast: { totalNutrition: { carbs: 0, fat: 0, grams: 0, kcal: 0, protein: 0 } },
                lunch: { totalNutrition: { carbs: 0, fat: 0, grams: 0, kcal: 0, protein: 0 } },
                dinner: { totalNutrition: { carbs: 0, fat: 0, grams: 0, kcal: 0, protein: 0 } },
                snack: { totalNutrition: { carbs: 0, fat: 0, grams: 0, kcal: 0, protein: 0 } },
            });
        }
    }, [isDateChanged]);

    const openFindPasswordModal = (type) => {
        setMealType(type); // 선택된 타입 설정
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setMealType(''); // 초기화
    };

    return (
        <>
        <View style={styles.container}>
            <View style={styles.body}>
                <Text style={styles.titleText}>식단</Text>

                <Text style={styles.subtitle}>오늘의 식단을 추가해주세요</Text>

                <View style={[styles.rowCommon, styles.row1]}>    

                    {['breakfast', 'lunch', 'dinner', 'snack'].map((meal, index) => {
                        const mealData = todayFoodData.find((data) => data.mealType === meal);

                        return (
                            <TouchableOpacity
                                key={meal}
                                style={styles.recordContainer}
                                onPress={() => openFindPasswordModal(meal)}
                            >
                                <Text style={styles.subTitle}>
                                    {meal === 'breakfast' ? '아침' : meal === 'lunch' ? '점심' : meal === 'dinner' ? '저녁' : '간식'}
                                </Text>

                                <View style={styles.rowCenter}>

                                    <View style={styles.recordBox}>
                                        <View style={styles.rowFlexStart}>
                                            <Text style={styles.valueText}>
                                                {mealData?.totalNutrition.kcal || 0}
                                            </Text>
                                            <Text style={styles.unitText}>kcal</Text>
                                        </View>
                                        <View style={styles.divider} />
                                        <View style={styles.rowFlexStart}>
                                            <Text style={styles.valueText}>
                                                {convertValue(mealData?.totalNutrition.grams || 0, unit)}
                                            </Text>
                                            <Text style={styles.unitText}>{unit}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.marginLeft8}>
                                        
                                        <View style={styles.recordStatusContainer}>
                                            {mealData?.recipeNames && mealData.recipeNames.length > 0 ? (
                                                <Text style={styles.recordStatusText}>
                                                    {mealData.recipeNames.join(", ")}
                                                </Text> // 레시피 이름 표시
                                            ) : (
                                                <Text style={styles.recordStatusText}>아직 기록이 없습니다</Text>
                                            )}
                                        </View>

                                        <View style={styles.macroContainer}>
                                            <View style={styles.macroItem}>
                                                <Text style={styles.macroLabel}>탄수화물</Text>
                                                <Text style={styles.macroValue}>
                                                    {convertValue(mealData?.totalNutrition.carbs || 0, unit)} {unit}
                                                </Text>
                                            </View>

                                            <View style={styles.divider2} />

                                            <View style={styles.macroItem}>
                                                <Text style={styles.macroLabel}>단백질</Text>
                                                <Text style={styles.macroValue}>
                                                    {convertValue(mealData?.totalNutrition.protein || 0, unit)} {unit}
                                                </Text>
                                            </View>

                                            <View style={styles.divider2} />

                                            <View style={styles.macroItem}>
                                                <Text style={styles.macroLabel}>지방</Text>
                                                <Text style={styles.macroValue}>
                                                    {convertValue(mealData?.totalNutrition.fat || 0, unit)} {unit}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                </View>
            </View>
        </View>


                

            {/* isModalVisible이 true일 때만 Foodmodal 렌더링 */}
            {isModalVisible && (
                <Foodmodal isVisible={isModalVisible} onClose={closeModal} mealType={mealType} />
            )}                            
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    body: {
        minHeight: 150,
        backgroundColor: '#222732',
        borderRadius: 15,
    },
    titleText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
    },
    subtitle: {
        marginLeft: 10,
        color: '#B8BFD1',
        fontWeight: 'bold',
        fontSize: 13,
    },
    rowCommon: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    recordContainer: {
        padding: 5,
        backgroundColor: '#333845',
        minHeight: 80,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 3
    },
    subTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 8,
        marginBottom: 5
    },
    weightDisplay: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    weightUnit: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    recordButton: {
        backgroundColor: '#497CF4',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 30,
        marginBottom: 10,
    },
    recordButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    divider: {
        width: 70,
        height: 0.5,
        backgroundColor: '#fff',
        marginVertical: 4,
    },
    divider2: {
        height: 45,
        borderRadius: 50,
        width: 1,
        backgroundColor: '#fff',
        marginVertical: 2,
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    recordBox: {
        width: 85,
        height: 75,
        padding: 8,
        backgroundColor: '#222732',
        borderRadius: 5,
        justifyContent: 'center',
    },
    rowFlexStart: {
        flexDirection: 'row',
    },
    valueText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    unitText: {
        fontSize: 11,
        marginTop: 9,
        marginLeft: 3,
        color: '#fff',
        fontWeight: 'bold',
    },
    marginLeft8: {
        marginLeft: 8,
        justifyContent: 'center',
    },
    
    recordStatusContainer: {
        borderBottomWidth: 2, // Add a bottom border
        borderBottomColor: '#fff', // Set the border color
        padding: 3,
        marginBottom: 3,
    },

    recordStatusText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    macroContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        gap: 3,
        minWidth: 20,
    },
    macroItem: {
        justifyContent: 'center',
        width: 65,
        alignItems: 'center',
    },
    macroLabel: {
        color: 'white',
        fontWeight: 'medium',
    },
    macroValue: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 3,
    },
    flexRowMargin5: {
        flexDirection: 'row',
        margin: 5,
    },
    percentSymbol: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5,
    },
});

export default Food;
