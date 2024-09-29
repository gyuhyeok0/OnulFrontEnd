import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Animated, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { callFetchExercisesAPI } from '../../../src/apis/ExerciseAPICalls'; // API 호출 함수 불러오기
import { styles } from './RegistModal.module';

const RegistChest = () => {
    const dispatch = useDispatch();

    // Redux 상태에서 exercises와 status를 가져옴
    const { exercises, status } = useSelector((state) => state.exercises);
    console.log('Redux State Status:', status); // 상태 확인

    // 카테고리 데이터는 고정된 값으로 처리
    const categories = [
        '전체', '맨몸', '스트레칭', '덤벨', '바벨', '스미스머신', '머신', '밴드', '케이블'
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { height } = Dimensions.get('window');
    const [heightAnimation] = useState(new Animated.Value(80)); // 초기 높이를 80으로 설정
    const [isCollapsed, setIsCollapsed] = useState(true); // 초기 상태를 collapsed로 설정
    const [displayCount, setDisplayCount] = useState(20); // 초기 표시할 운동 개수 설정

    // 운동 데이터를 서버에서 가져오는 로직
    useEffect(() => {
        if (exercises.length === 0) { // 운동 데이터가 없을 때만 API 호출
            dispatch(callFetchExercisesAPI());
        }
    }, [dispatch, exercises.length]);

    const handleButtonPress = useCallback((index) => {
        setSelectedIndex(index); // 버튼 클릭 시 선택된 인덱스 설정
    }, []);

    const toggleHeight = () => {
        heightAnimation.stopAnimation((currentHeight) => {
            const newHeight = currentHeight === 80 ? height * 0.47 : 80; // 접혔을 때와 펼쳤을 때의 높이
            setIsCollapsed(newHeight === 80); // 현재 상태에 따라 collapsed 상태 업데이트
            Animated.timing(heightAnimation, {
                toValue: newHeight,
                duration: 300,
                useNativeDriver: false,
            }).start();
        });
    };

    const handleComplete = () => {
        console.log('완료 버튼 클릭'); // 완료 버튼 클릭 시 로그 출력
    };

    const loadMoreExercises = () => {
        // 최대 20개씩 추가
        if (displayCount < exercises.length) {
            setDisplayCount(prevCount => prevCount + 20); // displayCount 증가
        }
    };

    // 카테고리 버튼 메모이제이션
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
    }, [categories, selectedIndex]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="운동 검색"
                    placeholderTextColor={'gray'}
                    value={searchQuery}
                    onChangeText={setSearchQuery} // 검색어 변경 시 상태 업데이트
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
                    if (isCloseToBottom(nativeEvent)) { // 스크롤이 아래에 가까워졌는지 확인
                        loadMoreExercises(); // 더 많은 운동 데이터 로드
                    }
                }}
                scrollEventThrottle={16} // 성능 향상을 위해 조정
            >
                {exercises.length > 0 ? (
                    exercises
                        .slice(0, displayCount) // 현재 displayCount 만큼만 슬라이스
                        .sort((a, b) => b.popularityGroup - a.popularityGroup)
                        .map((exercise, index) => (
                            <View key={index} style={styles.exerciseItem}>
                                <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                                <Text style={styles.exerciseDetails}>세부 근육 그룹: {exercise.detailMuscleGroup}</Text>
                                <Text style={styles.exerciseDetails}>
                                    인기도 그룹: {exercise.popularityGroup ? '인기 운동' : '일반 운동'}
                                </Text>
                            </View>
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
                            {isCollapsed ? (
                                <Ionicons name="chevron-up" size={28} color="#fff" style={styles.icon} />
                            ) : (
                                <Ionicons name="chevron-down" size={28} color="#fff" style={styles.icon} />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.toggleRegist}>
                            <Ionicons name="add" size={25} color="#fff" style={styles.icon} />
                            <Text style={styles.toggleText}>운동 추가</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.toggleReset}>
                            <Ionicons name="refresh" size={20} color="#fff" style={styles.icon} />
                            <Text style={styles.toggleText}>리셋</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.myExerciseContainer}>
                        <Text style={{ color: 'white', margin: 10, fontWeight: 'bold' }}>내 운동</Text>

                        {!isCollapsed && (
                            <View style={styles.myMainExercise}>
                                {/* 내 운동에 대한 내용은 여기에서 처리할 수 있습니다 */}
                            </View>
                        )}
                    </View>

                    <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                        <Text style={styles.completeButtonText}>완료</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

// 스크롤 뷰의 하단에 가까워졌는지 확인하는 헬퍼 함수
const isCloseToBottom = (nativeEvent) => {
    const paddingToBottom = 20; // 필요한 만큼 조정
    const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
    return contentOffset.y >= contentSize.height - layoutMeasurement.height - paddingToBottom;
};

export default RegistChest;
