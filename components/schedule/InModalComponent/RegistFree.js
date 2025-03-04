import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Animated, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { callFetchExercisesAPI, callToggleLikeAPI } from '../../../src/apis/ExerciseAPICalls'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { styles } from './RegistModal.module';
import { deleteExerciseFromServer, sendExerciseToServer, fetchMyExercises as fetchMyExercisesAction } from '../../../src/apis/MyExerciseAPI';
import Icon from 'react-native-vector-icons/Feather'; // Feather 아이콘 사용
import { useTranslation } from 'react-i18next';


const RegistFree = () => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const { exercises } = useSelector((state) => state.exercises);
    const { myExercises: myFree } = useSelector((state) => state.freeExercises || {}); // 사용자 정의 운동 상태 가져오기

    const categories = [
        '전체', '좋아요', '맨몸', '덤벨', '바벨', '스미스머신', '머신', '밴드', '케이블', '케틀벨', '이지바', '로프', '플레이트', '랜드마인', '폼롤러', '벨트', '짐볼'
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { height } = Dimensions.get('window');
    const [heightAnimation] = useState(new Animated.Value(80));
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [displayCount, setDisplayCount] = useState(20);
    const [likedExercises, setLikedExercises] = useState({});
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [scheduleExercises, setScheduleExercises] = useState([]);
    const [memberId, setMemberId] = useState(null);
    
    const [searchMessage, setSearchMessage] = useState(''); // 검색 메시지 상태 추가

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const savedLikes = await AsyncStorage.getItem('likedExercises');
                if (savedLikes) {
                    setLikedExercises(JSON.parse(savedLikes));
                }
                const id = await AsyncStorage.getItem('memberId');
                setMemberId(id);
    
                // 운동 데이터 요청
                if (id) {
                    const muscleGroup = "자유"; // 근육 그룹 설정
                    await dispatch(fetchMyExercisesAction(id, muscleGroup)); // 액션 디스패치
                }
    
                // 운동 리스트 가져오기
                if (exercises.length === 0) {
                    dispatch(callFetchExercisesAPI());
                }
                
            } catch (error) {
                console.error('초기 데이터를 로드하는 중 오류 발생:', error);
            }
        };
    
        loadInitialData();
    }, [dispatch, exercises.length]);
    
    useEffect(() => {
        if (Array.isArray(myFree) && myFree.length > 0) { // 사용자 정의 운동 상태 사용
            const exerciseIds = myFree.map(exercise => exercise.id);
            setScheduleExercises(exerciseIds);
    
            // 만약 운동 스케쥴이 있다면 chevron-up 상태로 설정
            if (exerciseIds.length > 0) {
                setIsCollapsed(false);
                Animated.timing(heightAnimation, {
                    toValue: height * 0.47,
                    duration: 300,
                    useNativeDriver: false,
                }).start();
            }
        }
    }, [myFree]); // 사용자 정의 운동 상태가 변경될 때 업데이트

    

    const handleButtonPress = (index) => setSelectedIndex(index);

    const toggleHeight = () => {
        heightAnimation.stopAnimation((currentHeight) => {
            const newHeight = currentHeight === 80 ? height * 0.47 : 80;
            setIsCollapsed(newHeight === 80);
            Animated.timing(heightAnimation, {
                toValue: newHeight,
                duration: 300,
                useNativeDriver: false,
            }).start();
        });
    };

    const loadMoreExercises = () => {
        if (displayCount < exercises.length) {
            setDisplayCount(prevCount => prevCount + 20);
        }
    };

    const toggleExerciseSelect = (exerciseId) => {
        setSelectedExercises((prevSelected) =>
            prevSelected.includes(exerciseId)
                ? prevSelected.filter(id => id !== exerciseId)
                : [...prevSelected, exerciseId]
        );
    };

    const addToSchedule = async () => {
        try {
            const newExercises = selectedExercises.filter(exerciseId => !scheduleExercises.includes(exerciseId));
            const muscleGroup = "자유";
    
            console.log("보내는 운동 데이터:", { newExercises, muscleGroup, memberId });
    
            await sendExerciseToServer(newExercises, muscleGroup, memberId);
    
            console.log("운동 데이터 전송 성공!");
    
            setScheduleExercises((prevSchedule) => [...prevSchedule, ...newExercises]);
            setSelectedExercises([]);
    
            if (isCollapsed) {
                toggleHeight();
            }
    
            dispatch(fetchMyExercisesAction(memberId, muscleGroup));
        } catch (error) {
            console.error('운동 전송 중 오류 발생:', error);
        }
    };
    
    const toggleLike = async (exerciseId) => {
        const currentLikeStatus = likedExercises[exerciseId] || false;
        const newLikeStatus = !currentLikeStatus;

        try {
            await callToggleLikeAPI(exerciseId, newLikeStatus);
            setLikedExercises((prev) => ({
                ...prev,
                [exerciseId]: newLikeStatus,
            }));

            await AsyncStorage.setItem('likedExercises', JSON.stringify({
                ...likedExercises,
                [exerciseId]: newLikeStatus,
            }));
        } catch (error) {
            console.error('좋아요 상태 업데이트 실패:', error);
        }
    };

    const filteredExercises = useMemo(() => {
        return exercises
            .filter((exercise) => {
                if (selectedIndex === 1) return likedExercises[exercise.id] === true;
                if (selectedIndex === 0) return true;
                return exercise.exerciseType === categories[selectedIndex];
            })
            .filter((exercise) => {
                const translatedName = t(`exerciseNames.${exercise.exerciseName}`); // 번역된 운동 이름
                return translatedName && translatedName.toLowerCase().includes(searchQuery.toLowerCase());
            })
            .slice(0, displayCount)
            .sort((a, b) => b.popularityGroup - a.popularityGroup);
    }, [exercises, likedExercises, selectedIndex, categories, displayCount, searchQuery, t]);
    
    const handleDelete = async (exerciseId) => {
        try {
            const muscleGroup = "자유";
            await deleteExerciseFromServer(exerciseId, muscleGroup, memberId);
            setScheduleExercises((prevSchedule) => prevSchedule.filter(id => id !== exerciseId));

            dispatch(fetchMyExercisesAction(memberId, muscleGroup));

        } catch (error) {
            console.error('운동 삭제 중 오류 발생:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={t('registModal.searchPlaceholder')}
                    placeholderTextColor="gray"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.category}>
                    {categories.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.categoryButton}
                            onPress={() => handleButtonPress(index)}
                        >
                            <Text style={[
                                styles.categoryButtonText,
                                selectedIndex === index && { color: '#4A7BF6' }
                            ]}>
                             {t(`categories.${category}`)}
                             </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <ScrollView
                style={styles.exerciseList}
                onScroll={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) loadMoreExercises();
                }}
                scrollEventThrottle={16}
            >
                {filteredExercises.length > 0 ? (
                    filteredExercises.map((exercise) => (
                        <TouchableOpacity
                            key={exercise.id}
                            style={[
                                styles.exerciseItem,
                                { backgroundColor: selectedExercises.includes(exercise.id) ? '#2E323C' : '#1A1C22' }
                            ]}
                            onPress={() => toggleExerciseSelect(exercise.id)}
                        >
                            <View style={styles.exerciseIcon}>

                                <Icon name="slash" size={35} color="#787A7F" style={{opacity:0.5}} />
                            </View>    

                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.exerciseName}>{t(`exerciseNames.${exercise.exerciseName}`)}</Text>
                                {exercise.popularityGroup && (
                                         <Text style={styles.exerciesePopular}>{t('registModal.categoryPopular')}</Text>
                                        )}
                                </View>
                                <Text style={styles.exerciseDetails}>{t(`muscleGroups.${exercise.detailMuscleGroup}`)}</Text>
                                </View>
                            <TouchableOpacity 
                                style={[styles.likeIcon, { marginLeft: 'auto' }]} 
                                onPress={() => toggleLike(exercise.id)} 
                            >
                                <Ionicons 
                                    name={likedExercises[exercise.id] ? "heart" : "heart-outline"} 
                                    size={28} 
                                    color={likedExercises[exercise.id] ? "red" : "gray"} 
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.noExerciseText}>{searchMessage || t('registModal.noExerciseData')}</Text>
                )}
                <View style={{ height: 100 }}></View>
            </ScrollView>

            <View style={styles.contentWrapper}>
                <Animated.View style={[styles.myExercise, { height: heightAnimation }]}>
                    <View style={styles.myExerciseButton}>
                        <TouchableOpacity style={styles.toggleButton} onPress={toggleHeight}>
                            <Ionicons name={isCollapsed ? "chevron-up" : "chevron-down"} size={28} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toggleRegist} onPress={addToSchedule}>
                            <Ionicons name="add" size={25} color="#fff" />
                            <Text style={styles.toggleText}>{t('registModal.toggleSchedule', { count: selectedExercises.length })}</Text>
                            </TouchableOpacity>
                        <TouchableOpacity style={styles.toggleReset} onPress={() => {
                            setSelectedExercises((prevSelected) => {
                                if (prevSelected.length > 0) {
                                    return prevSelected.slice(0, prevSelected.length - 1);
                                }
                                return prevSelected;
                            });
                        }}>
                            <Ionicons name="refresh" size={20} color="#fff" />
                            <Text style={styles.toggleText}>{t('registModal.undo')}</Text>
                            </TouchableOpacity>
                    </View>

                    <View style={styles.myMainExercise}>
                    <Text style={styles.myExerciseText}>{t('registModal.myExerciseSchedule', { bodyParts: t('bodyParts.복근') })}</Text>
                    {!isCollapsed && (
                            <Animated.View style={{ height: height * 0.43, padding: 10 }}>
                                <ScrollView>
                                    {scheduleExercises.length > 0 ? (
                                        <View style={styles.exerciseGrid}>
                                            {scheduleExercises.map((exerciseId) => {
                                                const exercise = exercises.find(e => e.id === exerciseId);
                                                return (
                                                    <View key={exerciseId} style={styles.exerciseItemBox}>
                                                        <View style={styles.scheduleItem}>
                                                        <Text style={styles.exerciseNameOnly}>{t(`exerciseNames.${exercise.exerciseName}`)}</Text>
                                                        <TouchableOpacity onPress={() => handleDelete(exerciseId)}>
                                                                <Ionicons name="close" size={24} color="white" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    ) : (
                                        <Text style={styles.noSelectedExerciseText}>{t('registModal.addToSchedule')}</Text>
                                    )}
                                </ScrollView>
                            </Animated.View>
                        )}
                    </View>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

const isCloseToBottom = (nativeEvent) => {
    const paddingToBottom = 20; 
    const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
    return contentOffset.y >= contentSize.height - layoutMeasurement.height - paddingToBottom;
};

export default RegistFree;
