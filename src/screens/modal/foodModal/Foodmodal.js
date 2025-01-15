import React, { useState, useEffect } from 'react';
import {
    Modal,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    View,
    Text,
    Animated,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RecipeEditModal from './RecipeEditModal';
import { useDispatch, useSelector } from 'react-redux'; // useDispatch 가져오기
import { deleteFoodData } from '../../../apis/FoodApi';
import { getAllFoodData } from '../../../apis/FoodApi';
import { saveTotalFoodData } from '../../../apis/FoodApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FreeFoodModal from './FreeFoodModal';


const screenHeight = Dimensions.get('window').height;

const Foodmodal = ({ isVisible, onClose, mealType }) => {

    const dispatch = useDispatch();

    const [modalY] = useState(new Animated.Value(screenHeight));
    const [overlayOpacity] = useState(new Animated.Value(0));

    const memberId = useSelector((state) => state.member?.userInfo?.memberId);

    const [isRecipeModalVisible, setRecipeModalVisible] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null); // 수정할 레시피 id 상태 관리
    const [unit, setUnit] = useState('g'); // 기본 단위는 'g'

    const [selectedRecipeIds, setSelectedRecipeIds] = useState([]); // 선택된 레시피 ID들 상태 관리
    const [selectedRecipeNames, setSelectedRecipeNames] = useState([]); // 클릭된 레시피 이름을 관리하는 상태

    const [totalNutrition, setTotalNutrition] = useState({
        grams: 0,
        kcal: 0,
        carbs: 0,
        protein: 0,
        fat: 0,
    }); // 합산된 데이터 상태 관리
    
    const [isAnyRecipeSelected, setIsAnyRecipeSelected] = useState(false); // 하나라도 선택되었는지 여부

    const [isNutritionalModalVisible, setNutritionalModalVisible] = useState(false);
    const [freeOnclose, setFreeOnclose] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const fetchUnit = async () => {
                try {
                    const storedUnit = await AsyncStorage.getItem('gOrOzUnit') || 'g';
                    setUnit(storedUnit); // 단위 상태 업데이트
                } catch (error) {
                    console.error('Failed to fetch unit:', error);
                }
            };
            fetchUnit();
        }
    }, [isVisible, isRecipeModalVisible ]);
    
    

    useEffect(() => {
        if (isVisible && memberId && !isRecipeModalVisible) {
            const fetchFoodData = async () => {
                try {
                    const unit = await AsyncStorage.getItem('gOrOzUnit') || 'g'; // 단위 가져오기, 기본값은 'g'
                    // console.log('Selected Unit:', unit); // 단위 확인 로그
    
                    const data = await getAllFoodData(memberId);
                    // console.log('Fetched Food Data:', data); // 가져온 데이터 로그
    
                    
                    const mappedRecipes = data.map((recipe) => {
                        const totalGrams = recipe.foodItems.reduce((sum, item) => {
                            const quantity = parseFloat(item.quantity || 0);
                            // console.log(`Item Quantity: ${item.quantity}, Parsed Quantity: ${quantity}`);
                            return sum + quantity;
                        }, 0);
                    
                        const totalKcal = recipe.foodItems.reduce((sum, item) => {
                            const calories = parseFloat(item.calories || 0);
                            // console.log(`Item Calories: ${item.calories}, Parsed Calories: ${calories}`);
                            return sum + calories;
                        }, 0);
                    
                        const totalCarbs = recipe.foodItems.reduce((sum, item) => {
                            const carbs = parseFloat(item.carbs || 0);
                            // console.log(`Item Carbs: ${item.carbs}, Parsed Carbs: ${carbs}`);
                            return sum + carbs;
                        }, 0);
                    
                        const totalProtein = recipe.foodItems.reduce((sum, item) => {
                            const protein = parseFloat(item.protein || 0);
                            // console.log(`Item Protein: ${item.protein}, Parsed Protein: ${protein}`);
                            return sum + protein;
                        }, 0);
                    
                        const totalFat = recipe.foodItems.reduce((sum, item) => {
                            const fat = parseFloat(item.fat || 0);
                            // console.log(`Item Fat: ${item.fat}, Parsed Fat: ${fat}`);
                            return sum + fat;
                        }, 0);
                    
                        // 변환 계수
                        const conversionFactor = unit === 'oz' ? 0.03527396 : 1;
                        // console.log('Conversion Factor:', conversionFactor);
                    
                        // 변환 함수
                        const formatValue = (value) => {
                            const convertedValue = value * conversionFactor;
                            // console.log('Original Value:', value, 'Converted Value:', convertedValue);
                            return convertedValue % 1 === 0
                                ? parseInt(convertedValue, 10)
                                : parseFloat(convertedValue.toFixed(1));
                        };
                    
                        return {
                            id: parseInt(recipe.recipeId, 10),
                            name: recipe.recipeName,
                            foodItems: recipe.foodItems,
                            grams: formatValue(totalGrams),
                            kcal: totalKcal,
                            carbs: formatValue(totalCarbs),
                            protein: formatValue(totalProtein),
                            fat: formatValue(totalFat),
                            unit,
                        };
                    });
                    
    
                    // console.log('Mapped Recipes:', mappedRecipes); // 매핑된 데이터 로그
                    setRecipes(mappedRecipes); // 상태에 저장
                } catch (error) {
                    console.error('Failed to fetch food data:', error); // 오류 로그
                }
            };
            fetchFoodData();
        }
    }, [isVisible, memberId, isRecipeModalVisible]);
    

    const handleRecipeClick = (id, recipeData) => {
        setSelectedRecipeIds(prevIds => {
            // 선택 해제 시, 기존 선택한 ID에서 해당 ID를 제거
            let newSelectedIds;
            let newRecipeNames;

            if (prevIds.includes(id)) {
                // 선택 해제 시 합산된 데이터에서 해당 값 빼기
                setTotalNutrition(prevTotal => {
                    const newTotal = {
                        grams: prevTotal.grams - convertToGrams(recipeData.grams, unit),
                        kcal: prevTotal.kcal, // kcal은 그대로
                        carbs: prevTotal.carbs - convertToGrams(recipeData.carbs, unit),
                        protein: prevTotal.protein - convertToGrams(recipeData.protein, unit),
                        fat: prevTotal.fat - convertToGrams(recipeData.fat, unit),
                    };

                    // 마지막으로 소수점 첫째 자리로 반올림
                    return {
                        grams: Math.round(newTotal.grams * 10) / 10,
                        kcal: Math.round(newTotal.kcal * 10) / 10,
                        carbs: Math.round(newTotal.carbs * 10) / 10,
                        protein: Math.round(newTotal.protein * 10) / 10,
                        fat: Math.round(newTotal.fat * 10) / 10,
                    };
                });
                newSelectedIds = prevIds.filter(recipeId => recipeId !== id); // 선택 해제
                newRecipeNames = selectedRecipeNames.filter(name => name !== recipeData.name); // 선택된 레시피 이름 제거
            } else {
                // 선택 시 합산된 데이터에 값 추가
                setTotalNutrition(prevTotal => {
                    const newTotal = {
                        grams: prevTotal.grams + convertToGrams(recipeData.grams, unit),
                        kcal: prevTotal.kcal, // kcal은 그대로
                        carbs: prevTotal.carbs + convertToGrams(recipeData.carbs, unit),
                        protein: prevTotal.protein + convertToGrams(recipeData.protein, unit),
                        fat: prevTotal.fat + convertToGrams(recipeData.fat, unit),
                    };

                    // 마지막으로 소수점 첫째 자리로 반올림
                    return {
                        grams: Math.round(newTotal.grams * 10) / 10,
                        kcal: Math.round(newTotal.kcal * 10) / 10,
                        carbs: Math.round(newTotal.carbs * 10) / 10,
                        protein: Math.round(newTotal.protein * 10) / 10,
                        fat: Math.round(newTotal.fat * 10) / 10,
                    };
                });
                newSelectedIds = [...prevIds, id]; // 선택
                newRecipeNames = [...selectedRecipeNames, recipeData.name]; // 선택된 레시피 이름 추가
            }

            // 선택된 레시피가 하나라도 있으면 true, 없으면 false로 상태 설정
            setIsAnyRecipeSelected(newSelectedIds.length > 0);

            // 선택된 레시피 이름들을 상태에 저장
            setSelectedRecipeNames(newRecipeNames);

            return newSelectedIds;
        });
    };

    
    // g 또는 oz 단위에 따라 변환하는 함수
    const convertToGrams = (value, unit) => {
        const conversionFactor = unit === 'oz' ? 28.3495 : 1; // 1oz = 28.3495g
        const convertedValue = value * conversionFactor;
        return Math.round(convertedValue * 10) / 10; // 소수점 첫째자리로 반올림
    };

    useEffect(() => {
        console.log(totalNutrition); // totalNutrition 값이 변경될 때마다 출력
    }, [totalNutrition]); // totalNutrition이 변경될 때마다 실행
    
    // 스타일 적용
    const getRecipeStyle = (id) => {
        return selectedRecipeIds.includes(id)
            ? { ...modalstyles.recipeContainer, borderColor: 'green', borderWidth: 2 }
            : modalstyles.recipeContainer;
    };
    


    const [recipes, setRecipes] = useState([
        {
            id: 1,
            name: '레시피 1',
            foodItems: [], // foodItems 초기화
            grams: 0,
            kcal: 0,
            carbs: 0,
            protein: 0,
            fat: 0,
        },
    ]);

    useEffect(() => {
        if (isVisible) {
            Animated.parallel([
                Animated.timing(modalY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(modalY, {
                    toValue: screenHeight,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => onClose());
        }
    }, [isVisible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(modalY, {
                toValue: screenHeight,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => onClose());
    };

    const addRecipe = () => {
        const newId = recipes.length > 0 ? Math.max(...recipes.map((r) => r.id)) + 1 : 1; // 고유한 ID 생성
        setRecipes((prevRecipes) => [
            ...prevRecipes,
            {
                id: newId,
                name: `레시피 ${newId}`,
                grams: 0,
                kcal: 0,
                carbs: 0,
                protein: 0,
                fat: 0,
            },
        ]);
    };

    const deleteRecipe = async (id) => {
        setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
    
        try {
            await deleteFoodData(memberId, id);
            console.log('데이터 삭제 성공!');
            // onClose(); // 성공 시 모달 닫기
        } catch (error) {
            console.error('데이터 삭제 실패:', error);
        }
    };
    

    const completeButton = async () => {

        if (isAnyRecipeSelected) {
            // 오늘 날짜 생성
            const today = new Date();
    
            // 연, 월, 일 값을 추출하고 두 자리로 포맷
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해야 합니다.
            const day = String(today.getDate()).padStart(2, '0'); // 날짜를 두 자리로 포맷
    
            // 원하는 형식 (YYYY-MM-DD)
            const formattedDate = `${year}-${month}-${day}`;
    
            // console.log(selectedRecipeNames);
            const recipeNames = selectedRecipeNames;
            // console.log(recipeNames);

            // console.log(memberId,mealType,formattedDate,totalNutrition,recipeNames);
            try {
                await saveTotalFoodData(memberId, mealType, formattedDate, totalNutrition, recipeNames, null, dispatch);
                // 데이터 저장 성공 시 모달 닫기
            } catch (error) {
                console.error('데이터 저장 실패:', error);
            }

        }
    
        // 조건에 관계없이 handleClose는 한 번만 호출
        handleClose();
    };
    
    

    const openRecipeModal = (id) => {
        const selectedRecipeData = recipes.find((recipe) => recipe.id === id);
        if (selectedRecipeData) {
            setRecipeModalVisible(true);
            setSelectedRecipe(selectedRecipeData); // 선택된 레시피 저장
        }
    };

    const openFreeFoodModal = () => {
        setNutritionalModalVisible(true); // 영양 정보 모달 띄우기
    };

    const closeRecipeModal = () => {
        setRecipeModalVisible(false);
    };

    const closeFoodModal = () => {
        setNutritionalModalVisible(false);  // 모달을 닫습니다.
    
        // freeOnclose가 true일 때만 onClose를 호출
        if (freeOnclose) {
            onClose(); // 성공 시 모달 닫기
        }
    };

    useEffect(() => {
        if (freeOnclose) {
            onClose(); // freeOnclose가 true일 때만 onClose 호출
        }
    }, [freeOnclose]); 
    

    const formatNumber = (value) => {
        if (value === undefined || value === null || isNaN(value)) {
            return 0; // 값이 없거나 유효하지 않으면 기본값 0 반환
        }
        const number = parseFloat(value);
        return Number.isInteger(number) ? number : number.toFixed(1); // 정수와 소수 구분
    };
    
    

    return (
        <Modal transparent={true} visible={isVisible} animationType="fade">
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <Animated.View style={[modalstyles.modalOverlay, { opacity: overlayOpacity }]}>
                    <Animated.View style={[modalstyles.modalContent, { transform: [{ translateY: modalY }] }]}>
                        <View style={modalstyles.titleContainer}>
                            <TouchableOpacity onPress={handleClose} style={modalstyles.backIcon}>
                                <Ionicons name="chevron-back" size={32} style={modalstyles.icon} />
                            </TouchableOpacity>
                            <Text style={modalstyles.title}>{mealType} 식단</Text>
                        </View>

                        <KeyboardAwareScrollView
                            contentContainerStyle={{ flexGrow: 1 }}
                            extraScrollHeight={20}
                            enableOnAndroid={true}
                        >
                            <ScrollView>                
                                <Text style={{color: '#F0F0F0', margin:5, marginTop:15, fontWeight: 'bold'}}>레시피를 선택한 후 완료버튼을 눌러주세요</Text>                
                                {recipes.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={getRecipeStyle(item.id)} // 선택된 레시피에만 보더 추가
                                        onPress={() => handleRecipeClick(item.id, item)} // 클릭 시 해당 레시피 데이터 전달
                                    >
                                        <View style={modalstyles.recipeHeader}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text style={modalstyles.recipeTitle}>{item.name}</Text>
                                                <TouchableOpacity
                                                    style={{
                                                        marginLeft: 8,
                                                        padding: 5,
                                                        backgroundColor: 'white',
                                                        borderRadius: 10,
                                                    }}
                                                    onPress={() => openRecipeModal(item.id)} // id 전달
                                                >
                                                    <Text style={modalstyles.editButton}>수정하기</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity onPress={() => deleteRecipe(item.id)}>
                                                <Text style={{ color: '#F87777', fontWeight: 'bold' }}>삭제</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{ marginTop: 5 }}>
                                            <Text style={modalstyles.recipeDetail}>
                                                용량: {formatNumber(item.grams)}{unit} | 
                                                칼로리: {formatNumber(item.kcal)}kcal
                                            </Text>
                                            <Text style={modalstyles.recipeDetail}>
                                                탄수화물: {formatNumber(item.carbs)}{unit} | 
                                                단백질: {formatNumber(item.protein)}{unit} | 
                                                지방: {formatNumber(item.fat)}{unit}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}



                                <TouchableOpacity onPress={addRecipe} style={modalstyles.addButton}>
                                    <Text style={modalstyles.addButtonText}>+</Text>
                                </TouchableOpacity>
                            </ScrollView>

                            <TouchableOpacity onPress={completeButton} style={modalstyles.completeButton}>
                                <Text style={modalstyles.completeButtonText}>완료</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={modalstyles.freeCompleteButton} onPress={openFreeFoodModal}>
                                <Text style={modalstyles.freeCompleteButtonText}>임시식단</Text>
                            </TouchableOpacity>
                        </KeyboardAwareScrollView>

                         {/* Recipe Modal Content */}
                        {isRecipeModalVisible && selectedRecipe && (
                            <RecipeEditModal
                                isVisible={isRecipeModalVisible}
                                onClose={closeRecipeModal}
                                id={selectedRecipe.id} // 선택된 id 전달
                                foodItems={selectedRecipe.foodItems} // foodItems 전달
                                initialRecipeName={selectedRecipe.name} // 레시피 이름 전달
                            />
                        )}

                        {/* Free Food Modal Content */}
                        {isNutritionalModalVisible && (
                            <FreeFoodModal
                                isVisible={isNutritionalModalVisible}
                                onClose={closeFoodModal}
                                setFreeOnclose = {setFreeOnclose}
                                mealType = {mealType}
                                memberId = {memberId}
                            />
                        )}

                    </Animated.View>
                </Animated.View>
            </SafeAreaView>
        </Modal>
    );
};

const modalstyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        width: '100%',
        height: screenHeight * 0.94,
        backgroundColor: '#191D22',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    titleContainer: {
        flexDirection: 'row',
        height: 35,
        alignItems: 'center',
    },
    icon: {
        color: 'gray',
    },
    title: {
        color: 'white',
        fontSize: 20,
        marginLeft: 5,
    },
    recipeContainer: {
        // marginTop: 20,
        backgroundColor: '#222732',
        padding: 15,
        borderRadius: 10,
        marginVertical: 8,
    },
    recipeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    recipeTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    editButton: {
        color: '#497CF4',
        fontSize: 13,
        fontWeight: 'bold',
    },
    recipeDetail: {
        color: 'white',
        fontSize: 14,
        marginTop: 5,
    },
    addButton: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222732',
        borderRadius: 10,
        padding: 10,
    },
    addButtonText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
    },
    completeButton: {
        height: 50,
        backgroundColor: '#497CF4',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 10,
    },
    completeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    recipeModalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    recipeModalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    recipeModalText: {
        fontSize: 18,
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#497CF4',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },

    freeCompleteButton:{
        height: 50,
        backgroundColor: '#D5E1FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom:15
    },
    
    completeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },

    freeCompleteButtonText:{
        color: '#4E4E4E',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default Foodmodal;
