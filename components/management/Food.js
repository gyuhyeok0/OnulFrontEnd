import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput ,TouchableOpacity} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useCurrentWeekAndDay } from '../../src/hooks/useCurrentWeekAndDay';
import { resetBodyData } from '../../src/modules/BodySlice';
import { saveBodyData } from '../../src/apis/BodyApi';

import { selectBodyDataByDate } from '../../src/modules/BodySlice';
import Foodmodal from '../../src/screens/modal/foodModal/Foodmodal';
import { fetchTotalFoodSuccess } from '../../src/modules/TotalFoodSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Food = () => {
    const dispatch = useDispatch();

    const { isDateChanged } = useCurrentWeekAndDay();
    
    // 새로운 방식: YYYY-M-D 형식
    const dateKey = new Date()
        .toLocaleDateString('en-CA', { year: 'numeric', month: 'numeric', day: 'numeric' }); // YYYY-M-D 형식

    // Redux에서 오늘 날짜 기준 데이터를 조회
    const todayFoodData = useSelector((state) => state.totalFood.foodRecords[dateKey] || {});

    const [unit, setUnit] = useState('g'); // 기본 단위는 'g'

    const [mealType, setMealType] = useState(''); // 현재 선택된 식사 타입

    const [isModalVisible, setModalVisible] = useState(false);

    const memberId = useSelector((state) => state.member?.userInfo?.memberId);


    useEffect(() => {
        const fetchUnit = async () => {
            try {
                const storedUnit = await AsyncStorage.getItem('gOrOzUnit') || 'g';
                setUnit(storedUnit); // 단위 상태 업데이트
            } catch (error) {
                console.error('Failed to fetch unit:', error);
            }
        };

        fetchUnit(); // 비동기 함수 호출
    }, [isModalVisible]); // 빈 배열: 컴포넌트가 마운트될 때만 실행

    useEffect(() => {


        const conversionFactor = 0.03527396; // g to oz 변환 계수

        // 상태 업데이트
        setMealData((prevData) => {
            const updatedData = { ...prevData };

            Object.keys(todayFoodData).forEach((mealType) => {
                const nutrition = todayFoodData[mealType]?.totalNutrition;

                if (nutrition) {
                    // 단위가 oz라면 변환하고 소수점 1자리까지 반올림
                    updatedData[mealType] = {
                        totalNutrition: {
                            carbs: unit === 'oz' ? roundToOneDecimal(nutrition.carbs * conversionFactor) : nutrition.carbs,
                            fat: unit === 'oz' ? roundToOneDecimal(nutrition.fat * conversionFactor) : nutrition.fat,
                            grams: unit === 'oz' ? roundToOneDecimal(nutrition.grams * conversionFactor) : nutrition.grams,
                            kcal: nutrition.kcal, // kcal은 변환하지 않음
                            protein: unit === 'oz' ? roundToOneDecimal(nutrition.protein * conversionFactor) : nutrition.protein,
                        },
                    };
                }
            });

            return updatedData;
        });
    }, [todayFoodData, unit]); // unit도 의존성에 추가

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
        }
    }, [isDateChanged]); // isDateChanged 의존성 추가

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

                        {['breakfast', 'lunch', 'dinner', 'snack'].map((meal, index) => (
                            <TouchableOpacity
                                key={meal}
                                style={styles.recordContainer}
                                onPress={() => openFindPasswordModal(meal)}
                            >
                                <Text style={styles.subTitle}>{meal === 'breakfast' ? '아침' : meal === 'lunch' ? '점심' : meal === 'dinner' ? '저녁' : '간식'}</Text>

                                <View style={styles.rowCenter}>

                                    <View style={styles.recordBox}>
                                        <View style={styles.rowFlexStart}>
                                            <Text style={styles.valueText}>{mealData[meal].totalNutrition.kcal}</Text>
                                            <Text style={styles.unitText}>kcal</Text>
                                        </View>
                                        <View style={styles.divider} />
                                        <View style={styles.rowFlexStart}>
                                            <Text style={styles.valueText}>{mealData[meal].totalNutrition.grams}</Text>
                                            <Text style={styles.unitText}>{unit}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.marginLeft8}>
                                        <View style={styles.recordStatusContainer}>
                                            <Text style={styles.recordStatusText}>아직 기록이 없습니다</Text>
                                        </View>

                                        <View style={styles.macroContainer}>
                                            <View style={styles.macroItem}>
                                                <Text style={styles.macroLabel}>탄수화물</Text>
                                                <Text style={styles.macroValue}>{mealData[meal].totalNutrition.carbs} {unit}</Text>
                                            </View>

                                            <View style={styles.divider2} />

                                            <View style={styles.macroItem}>
                                                <Text style={styles.macroLabel}>단백질</Text>
                                                <Text style={styles.macroValue}>{mealData[meal].totalNutrition.protein} {unit}</Text>
                                            </View>

                                            <View style={styles.divider2} />

                                            <View style={styles.macroItem}>
                                                <Text style={styles.macroLabel}>지방</Text>
                                                <Text style={styles.macroValue}>{mealData[meal].totalNutrition.fat} {unit}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}

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
        backgroundColor: '#515C78',
        minHeight: 80,
        borderRadius: 15,
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
        borderRadius: 10,
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
        backgroundColor: '#497CF4',
        padding: 3,
        borderRadius: 5,
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
