import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, Animated } from 'react-native';
import { sendIntensityToServer } from '../../../src/hooks/Intensity'; // 함수 가져오기
import { useDispatch, useSelector } from 'react-redux'; // useDispatch 가져오기
import { isSameDay } from 'date-fns'; // 날짜 비교를 위한 라이브러리
import DefaltSetting from './DefaltSetting.js';
import Icon2 from 'react-native-vector-icons/FontAwesome5';

// 운동 메뉴의 자동적응 코드
const AutoAdapt = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.member.userInfo.memberId);
    
    const intensities = ['쉬웠음', '보통', '어려움']; // 운동 강도 배열
    const data = useSelector((state) => state.intensity.data); // intensity 데이터 가져오기

    const [isRequesting, setIsRequesting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [updateCount, setUpdateCount] = useState(0); 

    useEffect(() => {
        if (updateCount === 0) return; 
        console.log("여기서 ai request 해야함");
    }, [updateCount]);
    


    // 애니메이션 값 설정 (초기값: 0 → 안 보이게 설정)
    const animationHeight = useRef(new Animated.Value(0)).current;

    // selectedIntensity를 data.intensity 값으로 초기화
    const [selectedIntensity, setSelectedIntensity] = useState(() => {
        const initialIntensity = data?.intensity;
        return intensities.indexOf(initialIntensity) !== -1
            ? intensities.indexOf(initialIntensity)
            : 1; // 기본값: '보통'
    });

    // 신규 유저이거나 날짜가 다를 경우 기본값 '보통'으로 디스패치
    useEffect(() => {
        const today = new Date();

        if (!data || !data.createdAt || !isSameDay(new Date(data.createdAt), today)) {
            const defaultIntensity = '보통';
            const defaultIndex = intensities.indexOf(defaultIntensity);
    
            console.log("신규 또는 날짜가 달라서 디스패치 실행");
            dispatch(sendIntensityToServer(userId, intensities[defaultIndex]));
        }
    }, [data, dispatch, intensities]);

    // 강도 선택 함수
    const handleIntensityPress = async (index) => {
        setSelectedIntensity(index); // UI 업데이트
        try {
            const response = await dispatch(sendIntensityToServer(userId, intensities[index]));
            console.log('서버 응답 데이터:', response);
        } catch (error) {
            console.error('오류 발생:', error.message || error);
        }
    };

    // 토글 시 애니메이션 실행
    const toggleVisibility = () => {
        setIsVisible((prev) => !prev); // 상태 변경

        Animated.timing(animationHeight, {
            toValue: isVisible ? 0 : 360, // 애니메이션 길이 조정 (100은 예제, 필요에 따라 조정)
            duration: 300, 
            useNativeDriver: false, 
        }).start();
    };

    return (
        <View style={{ width: '100%', backgroundColor: '#1A1C22', padding: 10 }}>
            
            {/* 헤더 - 클릭하면 애니메이션 실행 */}
            <Pressable 
                style={[
                    styles.headerContent,
                    isVisible 
                        ? { borderTopLeftRadius: 10, borderTopRightRadius: 10 } // "caret-up" 상태 → 모든 모서리 둥글게
                        : { borderRadius: 10 } // "caret-down" 상태 → 위쪽만 둥글게
                ]}
                onPress={toggleVisibility}
            >
                <Text style={styles.refreshLabel}>오늘의 운동</Text>
                <Icon2 name={isVisible ? "caret-up" : "caret-down"} size={28} color="white" />
            </Pressable>


            {/* 애니메이션이 적용된 영역 (caret-down 상태일 때만 렌더링) */}
            {isVisible && (
                <Animated.View style={[styles.animatedContainer, { height: animationHeight }]}>
                    <DefaltSetting setUpdateCount={setUpdateCount}/>
                </Animated.View>
            )}


            {/* 운동 강도 선택 버튼들 */}
            <View style={styles.intensityContainer}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>오늘의 운동강도</Text>
                <Text style={{ fontSize: 12, color: '#888888', marginTop: 5 }}>다음날 운동에 반영됩니다.</Text>

                <View style={styles.intensityWrap}>
                    {intensities.map((intensity, index) => (
                        <Pressable
                            key={index}
                            onPress={() => handleIntensityPress(index)}
                            style={[
                                styles.intensityButton,
                                index === selectedIntensity && styles.selectedButton
                            ]}
                        >
                            <Text
                                style={[
                                    styles.intensityText,
                                    index === selectedIntensity && styles.selectedText
                                ]}
                            >
                                {intensity}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    animatedContainer: {
        overflow: 'hidden', // 높이 조정 시 자연스럽게 숨기기
    },
    intensityContainer: {
        marginTop: 20
    },
    intensityWrap: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 15,
    },
    
    intensityButton: {
        paddingVertical: 9,
        paddingHorizontal: 25,
        backgroundColor: '#1A1C22',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#4E5157',
    },
    selectedButton: {
        borderColor: 'white',
    },
    intensityText: {
        color: '#9E9E9E',
        fontSize: 13,
        fontWeight: 'bold',
    },
    selectedText: {
        color: '#FFFFFF', // 선택된 버튼의 텍스트 색상
    },

    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        minHeight: 40,
        backgroundColor: '#222732',
        padding: 8,
        alignItems: 'center',
    },
    

    refreshLabel: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 2,
    },
});

export default AutoAdapt;
