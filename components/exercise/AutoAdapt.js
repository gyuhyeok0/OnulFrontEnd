import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import { sendIntensityToServer } from '../../src/hooks/Intensity'; // 함수 가져오기
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 가져오기
import { useQuery } from '@tanstack/react-query';

// 운동 메뉴의 자동적응 코드
const AutoAdapt = () => {
    const userId = useSelector((state) => state.member.userInfo.memberId);
    const accessToken = useSelector((state) => state.member.userInfo.accessToken);
    
    const [selectedIntensity, setSelectedIntensity] = useState(1); // 기본값은 '보통'
    const intensities = ['쉬웠음', '보통', '어려움'];


    // useQuery 설정
    const { refetch: refetchIntensity } = useQuery({
        queryKey: ['submitIntensity'],
        queryFn: async () => {

            console.log(selectedIntensity);

            if (selectedIntensity !== null) {
                const result = await sendIntensityToServer(userId, intensities[selectedIntensity]);
                return result; // 서버 응답 반환
            }

            // 기본 반환값 보장
            return { success: false, message: 'Invalid intensity selection' };
        },
        enabled: false, // 초기에는 실행되지 않도록 설정
    });

        // handleIntensityPress 함수
    const handleIntensityPress = async (index) => {
        const previousIntensity = selectedIntensity; // 선택 전 상태 저장

        try {
            // 상태 업데이트
            setSelectedIntensity(index);

            // AsyncStorage에 저장
            await AsyncStorage.setItem('selectedIntensity', index.toString());

            // 서버에 전송
            setTimeout(async () => {
                try {
                    const { data } = await refetchIntensity();
                    if (data && data.success === false) {
                        console.log('운동 강도 저장 실패:', data.message);

                        // 실패한 경우, 상태 초기화 또는 다른 로직 수행
                        setSelectedIntensity(null);
                        await AsyncStorage.removeItem('selectedIntensity');
                    } else {
                        // console.log('운동 강도 저장 성공:', data);
                    }
                } catch (error) {

                    setSelectedIntensity(previousIntensity);
                    await AsyncStorage.setItem('selectedIntensity', previousIntensity.toString());

                }
            }, 0); // 상태 업데이트 후 실행
        } catch (error) {

            setSelectedIntensity(previousIntensity);
            await AsyncStorage.setItem('selectedIntensity', previousIntensity.toString());
        }
    };

    // // 운동 강도 선택 시 서버로 전송하고, AsyncStorage에 저장합니다.
    // const handleIntensityPress = async (index) => {
    //     try {
    //         setSelectedIntensity(index);
            
    //         await AsyncStorage.setItem('selectedIntensity', index.toString());


    //         sendIntensityToServer(userId, intensities[index], accessToken);
    //     } catch (error) {
    //         console.error("운동 강도 저장 실패:", error);
    //     }
    // };


    useEffect(() => {
        const checkAndUpdateIntensity = async () => {
            try {
                // 저장된 마지막 날짜를 가져옴
                const lastDate = await AsyncStorage.getItem('lastRenderDate');
                const today = new Date().toISOString().split('T')[0];

                // const today = '2024-09-11';
    
                // 저장된 오늘 날짜가 없으면 바로 실행
                if (!lastDate) {
                    console.log("오늘 저장된 날짜가 없습니다. 운동 강도를 '보통'으로 설정합니다.");
                    setSelectedIntensity(1); // '보통'을 선택

                    await AsyncStorage.setItem('selectedIntensity', '1'); // '보통'을 AsyncStorage에 저장
                    sendIntensityToServer(userId, intensities[1], accessToken);
    
                } 
    
                // 저장된 오늘 날짜가 오늘과 다를 경우 실행
                else if (lastDate !== today) {
                    console.log("마지막 저장된 날짜가 오늘과 다릅니다. 운동 강도를 '보통'으로 업데이트합니다.");
                    setSelectedIntensity(1); // '보통'을 선택
                    // 마지막 날짜 초기화
                    await AsyncStorage.setItem('lastRenderDate', today);
                    await AsyncStorage.setItem('selectedIntensity', '1'); // '보통'을 AsyncStorage에 저장
                    sendIntensityToServer(userId, intensities[1], accessToken);

                }
    
                console.log("마지막 저장된 날짜가 오늘과 같습니다. 아무것도 안합니다.")
            } catch (error) {
                console.error("날짜 업데이트 중 오류 발생:", error);
            }
        };

        const loadStoredIntensity = async () => {
            try {
                const storedIntensity = await AsyncStorage.getItem('selectedIntensity');
                if (storedIntensity !== null) {
                    
                    setSelectedIntensity(parseInt(storedIntensity, 10));
                }
            } catch (error) {
                console.error("운동 강도 불러오기 실패:", error);
            }
        };

        loadStoredIntensity();
    
        checkAndUpdateIntensity(); // 컴포넌트 첫 렌더 시 실행
    }, [userId, accessToken, intensities]);
    

    return (
        <View style={{ width: '100%', backgroundColor: '#1A1C22', padding: 10 }}>
        
            <View style={styles.autoAdaptContainer}>

                    
            </View>




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
