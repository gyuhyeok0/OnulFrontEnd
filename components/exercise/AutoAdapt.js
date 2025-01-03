import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { sendIntensityToServer } from '../../src/hooks/Intensity'; // 함수 가져오기
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux'; // useDispatch 가져오기
import { isSameDay } from 'date-fns'; // 날짜 비교를 위한 라이브러리
import { selectBodyDataByDate } from '../../src/modules/BodySlice';

// 운동 메뉴의 자동적응 코드
const AutoAdapt = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.member.userInfo.memberId);
    const accessToken = useSelector((state) => state.member.userInfo.accessToken);

    const intensities = ['쉬웠음', '보통', '어려움']; // 운동 강도 배열
    const data = useSelector((state) => state.intensity.data); // intensity 데이터 가져오기

    const [isRequesting, setIsRequesting] = useState(false);


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


        if (
            !data || // 신규 유저
            !data.createdAt || // createdAt 값이 없는 경우
            !isSameDay(new Date(data.createdAt), today) // 날짜가 오늘과 다른 경우
        ) {
            const defaultIntensity = '보통';
            const defaultIndex = intensities.indexOf(defaultIntensity); // '보통'의 인덱스
    
            console.log("신규 또는 날짜가 달라서 디스패치 실행")
            dispatch(
                sendIntensityToServer(userId, intensities[defaultIndex])
            );
        }
        
    }, [data, dispatch, intensities]);


    // handleIntensityPress 함수
    const handleIntensityPress = async (index) => {
        setSelectedIntensity(index); // UI 업데이트
    
        try {
            const response = await dispatch(
                sendIntensityToServer(userId, intensities[index])
            ); // index 직접 사용
            console.log('서버 응답 데이터:', response);
        } catch (error) {
            console.error('오류 발생:', error.message || error);
        }
    };

    return (
        <View style={{ width: '100%', backgroundColor: '#1A1C22', padding: 10 }}>
            <View style={styles.autoAdaptContainer}></View>

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
    intensityContainer: {},
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

    autoAdaptContainer: {
        width: '100%', 
        minHeight: 100, 
        backgroundColor: 'gray',
        marginBottom: 30,
    }
});

export default AutoAdapt;
