import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Text, StyleSheet, Pressable } from 'react-native';
import Footer from '../common/Footer';
import { useSelector } from 'react-redux';
import { checkOnboardingStatus } from '../../hooks/HendleOnboarding';
import { handlerLogOut } from '../../hooks/HandleLogout';
import AutoAdapt from '../../../components/exercise/AutoAdapt';
import OnSchedule from '../../../components/exercise/OnSchedule';
import Custom from '../../../components/exercise/Custom';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Exercise = ({ navigation }) => {
    const userId = useSelector((state) => state.member.userInfo?.memberId); // Optional chaining 사용
    const accessToken = useSelector((state) => state.member.userInfo?.accessToken); // Optional chaining 사용

    const [selectedOption, setSelectedOption] = useState('AutoAdapt');
    const [showTooltip, setShowTooltip] = useState({ visible: false, message: '' });

    useEffect(() => {
        console.log("==========운동페이지 입니다============")
    }, []);

    useEffect(() => {
        const checkAndSaveDate = async () => {
            try {
                const storedDate = await AsyncStorage.getItem('todayRenderDate');
                const today = new Date().toISOString().split('T')[0];

                // const today = '2024-09-11';
    
                // 저장된 어제 날짜가 없으면 오늘 날짜를 lastRenderDate에 저장
                if (!storedDate) {
                    console.log("어제 저장된 날짜가 없습니다. 오늘 날짜를 lastRenderDate에 저장합니다.");
                    await AsyncStorage.setItem('lastRenderDate', today);
                    await AsyncStorage.setItem('todayRenderDate', today);
                }
    
                // 어제 저장된 "오늘 날짜"가 오늘날짜가 아닌경우 실행
                if (storedDate && storedDate !== today) {
                    console.log("마지막 저장된 오늘날짜가 오늘날짜와 다릅니다.");
    
                    await AsyncStorage.setItem('lastRenderDate', storedDate);
                    console.log("마지막 저장된 오늘 날짜를 마지막 저장 날짜로 저장했습니다.");
    
                    await AsyncStorage.setItem('todayRenderDate', today);
                    console.log("오늘날짜를 초기화 했습니다.");
                }

                console.log("마지막 저장된 날짜가 오늘과 같습니다.")
            } catch (error) {
                console.error(error);
            }
        };
    
        checkAndSaveDate(); // 컴포넌트 첫 렌더 시 실행
    }, []);
    


    // 온보딩 체크 여부 확인
    useEffect(() => {
        if (userId && accessToken) {
            checkOnboardingStatus(userId, accessToken, navigation);
        } else {
            handlerLogOut(navigation);
        }
    }, [userId, accessToken]);

    // 운동 버튼 누를시 말풍선
    const handlePress = (option, message) => {
        setSelectedOption(option);
        setShowTooltip({ visible: true, message });
    };

    // 말풍선 유지시간
    useEffect(() => {
        if (showTooltip.visible) {
            const timer = setTimeout(() => {
                setShowTooltip({ visible: false, message: '' });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showTooltip.visible]);

    // 운동 버튼 누를시 컴포넌트 변경
    const renderSelectedComponent = () => {
        switch (selectedOption) {
            case 'AutoAdapt':
                return <AutoAdapt />;
            case 'OnSchedule':
                return <OnSchedule />;
            case 'Custom':
                return <Custom />;
            default:
                return <AutoAdapt />;
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView  style={styles.scrollView}>
                <View style={styles.selectionContainer}>
                    <Pressable
                        style={styles.option}
                        onPress={() => handlePress('AutoAdapt', '운동 스케줄을 자동으로 생성합니다. 회원님의 성과에 따라 점진적으로 발전합니다.')}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedOption === 'AutoAdapt' && styles.selectedTextColor
                            ]}
                        >
                            자동적응
                        </Text>
                        <Image
                            source={
                                selectedOption === 'AutoAdapt'
                                    ? require('../../assets/AutoAdapt_color.webp')
                                    : require('../../assets/AutoAdapt.webp')
                            }
                            style={styles.icon}
                        />
                    </Pressable>

                    <Pressable
                        style={styles.option}
                        onPress={() => handlePress('OnSchedule', '미리 설정한 운동 스케줄에 따라 진행됩니다.')}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedOption === 'OnSchedule' && styles.selectedTextColor
                            ]}
                        >
                            맞춤일정
                        </Text>
                        <Image
                            source={
                                selectedOption === 'OnSchedule'
                                    ? require('../../assets/OnSchedule_color.webp')
                                    : require('../../assets/OnSchedule.webp')
                            }
                            style={styles.icon}
                        />
                    </Pressable>

                    <Pressable
                        style={styles.option}
                        onPress={() => handlePress('Custom', '정해진 스케줄과는 별도로, 그날의 컨디션과 목표에 맞춰 자유롭게 운동 계획을 구성하세요.')}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedOption === 'Custom' && styles.selectedTextColor
                            ]}
                        >
                            자유일정
                        </Text>
                        <Image
                            source={
                                selectedOption === 'Custom'
                                    ? require('../../assets/Custom_color.webp')
                                    : require('../../assets/Custom.webp')
                            }
                            style={styles.icon}
                        />
                    </Pressable>
                </View>

                {renderSelectedComponent()}

                {showTooltip.visible && (
                    <View style={styles.tooltip}>
                        <Text style={styles.tooltipText}>{showTooltip.message}</Text>
                    </View>
                )}

            </ScrollView>
            <Footer navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#1A1C22',
        
    },
    scrollView: {
        backgroundColor: '#1A1C22',
    },
    
    selectionContainer: {
        marginTop: 20,
        borderWidth: 0.5,
        borderColor: 'white',
        borderRadius: 20,
        // margin: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,

        flexDirection: 'row',
        backgroundColor: '#15181C',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20,
        // backgroundColor:'white'
    },
    option: {
        alignItems: 'center',
    },
    optionText: {
        color: '#9E9E9E',
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 9,
    },

    selectedTextColor: {
        color: '#3F97EF',
    },

    icon: {
        width: 33,
        height: 33,
    },

    tooltip: {
        position: 'absolute',
        maxWidth: 300,
        top: 110,
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
    },
    
    tooltipText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 13,
        lineHeight: 18,
        fontWeight: 'bold',
    },
});

export default Exercise;
