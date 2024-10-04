import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Animated, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { callFetchExercisesAPI, callToggleLikeAPI } from '../../../src/apis/ExerciseAPICalls'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { styles } from './RegistModal.module';

const RegistChest = () => {
    const dispatch = useDispatch();
    const { exercises, status } = useSelector((state) => state.exercises);

    const categories = useMemo(() => [
        '전체', '좋아요', '맨몸', '덤벨', '바벨', '스미스머신', '머신', '밴드', '케이블', '케틀벨', '이지바', '로프', '플레이트', '랜드마인', '폼롤러', '벨트', '짐볼'
    ], []);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { height } = Dimensions.get('window');
    const [heightAnimation] = useState(new Animated.Value(80));
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [displayCount, setDisplayCount] = useState(20);
    const [likedExercises, setLikedExercises] = useState({});
    const [selectedExercises, setSelectedExercises] = useState([]); // 선택된 운동 ID 상태
    const [scheduleExercises, setScheduleExercises] = useState([]); // 운동 스케줄 상태

    useEffect(() => {
        const loadLikedExercises = async () => {
            const savedLikes = await AsyncStorage.getItem('likedExercises');
            if (savedLikes) {
                setLikedExercises(JSON.parse(savedLikes));
            }
        };

        loadLikedExercises();

        if (exercises.length === 0) {
            dispatch(callFetchExercisesAPI());
        }
    }, [dispatch, exercises.length]);

    const handleButtonPress = useCallback((index) => {
        setSelectedIndex(index);
    }, []);

    const toggleHeight = useCallback(() => {
        heightAnimation.stopAnimation((currentHeight) => {
            const newHeight = currentHeight === 80 ? height * 0.47 : 80;
            setIsCollapsed(newHeight === 80);
            Animated.timing(heightAnimation, {
                toValue: newHeight,
                duration: 300,
                useNativeDriver: false,
            }).start();
        });
    }, [height, heightAnimation]);

    const loadMoreExercises = useCallback(() => {
        if (displayCount < exercises.length) {
            setDisplayCount(prevCount => prevCount + 20);
        }
    }, [displayCount, exercises.length]);

    const toggleExerciseSelect = (exerciseId) => {
        setSelectedExercises((prevSelected) => {
            if (prevSelected.includes(exerciseId)) {
                // 이미 선택된 운동이면 선택 해제
                return prevSelected.filter(id => id !== exerciseId);
            } else {
                // 선택되지 않은 운동이면 선택 추가
                return [...prevSelected, exerciseId];
            }
        });
    };

    const addToSchedule = () => {
        setScheduleExercises((prevSchedule) => {
            // 선택된 운동들을 기존 스케줄에 추가 (중복 제거)
            const newExercises = selectedExercises.filter(exerciseId => !prevSchedule.includes(exerciseId));
            return [...prevSchedule, ...newExercises];
        });
        // 선택된 운동 초기화
        setSelectedExercises([]);

        if (isCollapsed) {
            toggleHeight(); // 애니메이션을 위해 toggleHeight 호출
        }
    };

    const toggleLike = useCallback(async (exerciseId) => {
        const currentLikeStatus = likedExercises[exerciseId] || false;
        const newLikeStatus = !currentLikeStatus;

        try {
            await callToggleLikeAPI(exerciseId, newLikeStatus);
            setLikedExercises((prev) => {
                if (prev[exerciseId] === newLikeStatus) return prev;
                return {
                    ...prev,
                    [exerciseId]: newLikeStatus,
                };
            });

            await AsyncStorage.setItem('likedExercises', JSON.stringify({
                ...likedExercises,
                [exerciseId]: newLikeStatus,
            }));
        } catch (error) {
            console.error('좋아요 상태 업데이트 실패:', error);
        }
    }, [likedExercises]);

    const filteredExercises = useMemo(() => {
        // 먼저 검색 조건을 적용한 다음, 보여줄 항목을 제한
        const filteredData = exercises
            .filter((exercise) => {
                if (selectedIndex === 1) return likedExercises[exercise.id] === true;
                if (selectedIndex === 0) return true;
                return exercise.exerciseType === categories[selectedIndex];
            })
            .filter((exercise) => exercise.mainMuscleGroup === "가슴")
            .filter((exercise) => 
                exercise.exerciseName.toLowerCase().includes(searchQuery.toLowerCase()) // 검색어와 일치하는 운동 필터링
            );
        
        // 그 다음에 제한된 개수만 보여줌
        return filteredData.slice(0, displayCount).sort((a, b) => b.popularityGroup - a.popularityGroup);
    }, [exercises, likedExercises, selectedIndex, categories, displayCount, searchQuery]);
    
    const categoryButtons = useMemo(() => {
        return categories.map((category, index) => (
            <TouchableOpacity
                key={index}
                style={styles.categoryButton}
                onPress={() => handleButtonPress(index)}
            >
                <Text style={[
                    styles.categoryButtonText,
                    selectedIndex === index && { color: '#4A7BF6' }
                ]}>
                    {category}
                </Text>
            </TouchableOpacity>
        ));
    }, [categories, selectedIndex, handleButtonPress]);

    // 운동 삭제 함수
    const handleDelete = (exerciseId) => {
        setScheduleExercises((prevSchedule) => prevSchedule.filter(id => id !== exerciseId));
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="운동 검색"
                    placeholderTextColor={'gray'}
                    value={searchQuery}
                    onChangeText={setSearchQuery} // 검색어 변경 시 searchQuery 상태값 변경
                />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.category}>
                    {categoryButtons}
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
                            <View style={styles.exerciseIcon}></View>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                                    {exercise.popularityGroup && (
                                        <Text style={styles.exerciesePopular}>인기</Text>
                                    )}
                                </View>
                                <Text style={styles.exerciseDetails}>{exercise.detailMuscleGroup}</Text>
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
                    <Text style={styles.noExerciseText}>운동 데이터가 없습니다.</Text>
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
                            <Text style={styles.toggleText}>스케줄 추가 ({selectedExercises.length})</Text> 
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
                            <Text style={styles.toggleText}>되돌리기</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.myMainExercise}>
                        <Text style={styles.myExerciseText}>내 가슴 운동 스케쥴</Text>
                        {!isCollapsed && (
                            <Animated.View style={{ height: height * 0.43, padding: 10 }}>
                                <ScrollView>
                                    {scheduleExercises.length > 0 ? (
                                        <View style={styles.exerciseGrid}>
                                            {scheduleExercises.map((exerciseId) => {
                                                const exercise = exercises.find(e => e.id === exerciseId);
                                                return (
                                                    <View key={exerciseId} style={styles.exerciseItemBox}>
                                                        {/* 운동 이름과 삭제 버튼 */}
                                                        <View style={styles.scheduleItem}>
                                                            <Text style={styles.exerciseNameOnly}>{exercise?.exerciseName}</Text>
                                                            <TouchableOpacity onPress={() => handleDelete(exerciseId)}>
                                                                <Ionicons name="close" size={24} color="white" />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    ) : (
                                        <Text style={styles.noSelectedExerciseText}>운동 스케쥴을 추가해주세요.</Text>
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

// 스크롤 뷰의 하단에 가까워졌는지 확인하는 헬퍼 함수
const isCloseToBottom = (nativeEvent) => {
    const paddingToBottom = 20; 
    const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
    return contentOffset.y >= contentSize.height - layoutMeasurement.height - paddingToBottom;
};

export default RegistChest;
