import React, { useState, useEffect} from 'react';
import { View, ScrollView, Image, Text, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import Footer from '../common/Footer';
import { checkOnboardingStatus } from '../../hooks/HendleOnboarding';
import { handlerLogOut } from '../../hooks/HandleLogout';
import AutoAdapt from '../../../components/exercise/autoAdapt/AutoAdapt';
import OnSchedule from '../../../components/exercise/OnSchedule';
import Custom from '../../../components/exercise/Custom';
import { useTranslation } from 'react-i18next';
import { notice } from '../../apis/NoticeAPI';
import NoticeModal from '../modal/NoticeModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Exercise = ({ navigation }) => {
    
    const userId = useSelector((state) => state.member.userInfo?.memberId); // Optional chaining 사용
    const accessToken = useSelector((state) => state.member.userInfo?.accessToken); // Optional chaining 사용
    const { t } = useTranslation();

    const [selectedOption, setSelectedOption] = useState('AutoAdapt');
    const [showTooltip, setShowTooltip] = useState({ visible: false, message: '' });
    const [noticeData, setNoticeData] = useState(null); // 공지 데이터를 관리
    const [modalVisible, setModalVisible] = useState(false); // 모달 상태

    
    useEffect(() => {
        let timer = null;  // 타이머를 저장할 변수 선언
    
        const fetchNotice = async () => {
            console.log("공지확인")
            if (userId && accessToken) {
                const data = await notice(accessToken); // 공지 데이터 받아오기
                if (data && data.active) {
                    setNoticeData(data);  // 공지 데이터를 상태로 저장
                    setModalVisible(true);
                }
            } else {
                handlerLogOut(navigation); // 유저 로그아웃 처리
            }
        };
    
        // 5초 지연 후 함수 실행
        timer = setTimeout(fetchNotice, 5000);
    
        return () => {
            if (timer) {
                clearTimeout(timer);  // 컴포넌트 언마운트 시 타이머 정리
            }
        };
    }, [userId, accessToken]);  // useEffect 의존성 배열에 userId, accessToken 포함
    

    const closeModal = () => {
        setModalVisible(false); // 모달 닫기
    };
    

    useEffect(() => {
        let timer = null;  // 타이머를 저장할 변수 선언
    
        const checkOnboarding = async () => {
            console.log("온보딩 확인")

            if (!userId || !accessToken) {
                handlerLogOut(navigation);
                return;
            }
    
            try {
                const onboardingChecked = await AsyncStorage.getItem(`onboarding_checked_${userId}`);
                
                if (!onboardingChecked) {
                    // ✅ 온보딩 상태 체크 실행
                    await checkOnboardingStatus(userId, accessToken, navigation);
                    // ✅ 온보딩 체크 완료 상태를 스토리지에 저장
                    await AsyncStorage.setItem(`onboarding_checked_${userId}`, 'true');
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
            }
        };
    
        // 10초 지연 후 함수 실행
        timer = setTimeout(checkOnboarding, 10000);
    
        return () => {
            if (timer) {
                clearTimeout(timer);  // 컴포넌트 언마운트 시 타이머 정리
            }
        };
    }, [userId, accessToken]);  // useEffect 의존성 배열에 userId, accessToken 포함
    

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

    // 선택한 옵션을 기반으로 화면 렌더링
    const renderSelectedComponent = () => {
        switch (selectedOption) {
            case 'AutoAdapt':
                return <AutoAdapt/>;
            case 'OnSchedule':
                return <OnSchedule/>;
            case 'Custom':
                return <Custom />;
            default:
                return <AutoAdapt />;
        }
    };

    return (
        <View style={styles.container}>

            <ScrollView  style={styles.scrollView}
                keyboardShouldPersistTaps="handled" // 버튼 탭 시 키보드 유지
            >
                <View style={styles.selectionContainer}>

                    <Pressable
                        style={styles.option}
                        onPress={() => handlePress('AutoAdapt', t('exercise.autoAdaptDescription'))}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedOption === 'AutoAdapt' && styles.selectedTextColor
                            ]}
                        >
                            {t('exercise.autoAdapt')}
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
                        onPress={() => handlePress('OnSchedule', t('exercise.onScheduleDescription'))}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedOption === 'OnSchedule' && styles.selectedTextColor
                            ]}
                        >
                            {t('exercise.onSchedule')}
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
                        onPress={() => handlePress('Custom', t('exercise.customDescription'))}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedOption === 'Custom' && styles.selectedTextColor
                            ]}
                        >
                            {t('exercise.custom')}
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


            {modalVisible && noticeData && (
            <NoticeModal noticeData={noticeData} closeModal={() => setModalVisible(false)} />
            )}

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
        borderWidth: 1,
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
        position:'relative',
        width: 100,
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

    blur:{
        backgroundColor: 'rgba(21, 24, 28, 0.55)',  // 반투명한 #15181C
        width: 65,
        height: 65,
        top: -5,
        position: 'absolute',
        borderRadius: 10,  // 부드러운 느낌 추가
        overflow: 'hidden',
        justifyContent:'center',
        alignItems:'center',
    }
});

export default Exercise;