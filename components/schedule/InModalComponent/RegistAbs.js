import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions, ScrollView, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './RegistModal.module';

const RegistAbs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [exercises, setExercises] = useState([
        '전체', '맨몸', '스트레칭', '덤벨', '바벨', '스미스머신', '머신', '밴드', '케이블'
    ]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { width, height } = Dimensions.get('window');
    const [heightAnimation] = useState(new Animated.Value(80)); // 초기 높이를 80으로 설정
    const [isCollapsed, setIsCollapsed] = useState(true); // 초기 상태를 collapsed로 설정

    const handleButtonPress = (index) => {
        setSelectedIndex(index);
    };

    const toggleHeight = () => {
        heightAnimation.stopAnimation((currentHeight) => {
            const newHeight = currentHeight === 80 ? height * 0.47 : 80; // 접혔을 때와 펼쳤을 때의 높이
            setIsCollapsed(newHeight === 80);
            Animated.timing(heightAnimation, {
                toValue: newHeight,
                duration: 300,
                useNativeDriver: false,
            }).start();
        });
    };

    const handleComplete = () => {
        console.log('완료 버튼 클릭');
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
                    onChangeText={(text) => setSearchQuery(text)}
                />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.category}>
                    {exercises.map((exercise, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.categoryButton}
                            onPress={() => handleButtonPress(index)}
                        >
                            <Text style={[
                                styles.categoryButtonText,
                                selectedIndex === index && { color: '#4A7BF6' }
                            ]}>
                                {exercise}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <ScrollView style={styles.contentScroll}>
                <View style={styles.contentContainer}>
                    {/* Your content goes here */}
                </View>
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

                        {/* 조건부 렌더링 */}
                        {!isCollapsed && (
                            <View style={styles.myMainExercise}>
                                {/* Content for myMainExercise can go here */}
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

export default RegistAbs;
