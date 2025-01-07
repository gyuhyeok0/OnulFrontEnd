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

const screenHeight = Dimensions.get('window').height;

const Foodmodal = ({ isVisible, onClose, mealType }) => {
    
    const [modalY] = useState(new Animated.Value(screenHeight));
    const [overlayOpacity] = useState(new Animated.Value(0));

    const [isRecipeModalVisible, setRecipeModalVisible] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null); // 수정할 레시피 id 상태 관리

    const [recipes, setRecipes] = useState([
        {
            id: 1,
            name: '레시피 1',
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

    const deleteRecipe = (id) => {
        setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
    };

    const completeButton = () => {
        console.log('완료버튼입니다.');
        handleClose();
    };

    const openRecipeModal = (id) => {
        setRecipeModalVisible(true);
        setSelectedRecipe(id); // 선택된 id만 설정
    };

    const closeRecipeModal = () => {
        setRecipeModalVisible(false);
    };

    return (
        <Modal transparent={true} visible={isVisible} animationType="fade">
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <Animated.View style={[modalstyles.modalOverlay, { opacity: overlayOpacity }]}>
                    <Animated.View style={[modalstyles.modalContent, { transform: [{ translateY: modalY }] }]}>
                        <View style={modalstyles.titleContainer}>
                            <TouchableOpacity onPress={completeButton} style={modalstyles.backIcon}>
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
                                {recipes.map((item) => (
                                    <View key={item.id} style={modalstyles.recipeContainer}>
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
                                                용량: {item.grams}g | 칼로리: {item.kcal}kcal
                                            </Text>
                                            <Text style={modalstyles.recipeDetail}>
                                                탄수화물: {item.carbs}g | 단백질: {item.protein}g | 지방: {item.fat}g
                                            </Text>
                                        </View>
                                    </View>
                                ))}

                                <TouchableOpacity onPress={addRecipe} style={modalstyles.addButton}>
                                    <Text style={modalstyles.addButtonText}>+</Text>
                                </TouchableOpacity>
                            </ScrollView>

                            <TouchableOpacity onPress={completeButton} style={modalstyles.completeButton}>
                                <Text style={modalstyles.completeButtonText}>완료</Text>
                            </TouchableOpacity>
                        </KeyboardAwareScrollView>

                         {/* Recipe Modal Content */}
                        {isRecipeModalVisible && (
                            <RecipeEditModal
                                isVisible={isRecipeModalVisible}
                                onClose={closeRecipeModal}
                                id={selectedRecipe} // 선택된 id 전달
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
        marginTop: 20,
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
});

export default Foodmodal;
