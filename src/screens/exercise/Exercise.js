import React, { useState, useEffect, useMemo, useRef} from 'react';
import { View, ScrollView, Image, Text, StyleSheet, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../common/Footer';
import { checkOnboardingStatus } from '../../hooks/HendleOnboarding';
import { handlerLogOut } from '../../hooks/HandleLogout';
import AutoAdapt from '../../../components/exercise/autoAdapt/AutoAdapt';
import OnSchedule from '../../../components/exercise/OnSchedule';
import Custom from '../../../components/exercise/Custom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDefaultSetsToRedux } from '../../modules/StateExerciseSlice'; // Redux 액션
import useCheckDateChange from '../../hooks/useCheckDateChange';
import Purchases from "react-native-purchases";
import { getSubscriptionStatus } from '../../hooks/Subscription';
import Icon from 'react-native-vector-icons/FontAwesome'; // FontAwesome에서 Lock 아이콘 가져오기
import SubscriptionModal from '../modal/SubscriptionModal';
import FreeTrialBanner from '../../../components/banner/FreeTrialBanner';


const Exercise = ({ navigation }) => {
    const userId = useSelector((state) => state.member.userInfo?.memberId); // Optional chaining 사용
    const accessToken = useSelector((state) => state.member.userInfo?.accessToken); // Optional chaining 사용

    const [selectedOption, setSelectedOption] = useState('AutoAdapt');
    const [showTooltip, setShowTooltip] = useState({ visible: false, message: '' });

    const memberSignupDate = useSelector((state) => state.member.userInfo.memberSignupDate); // Optional chaining 사용

    const [ day, setDay] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false); // 구독 상태
    const [hasSubscriptionAccess, setHasSubscriptionAccess] = useState(false); // 구독 후 5일 이상이면 true
    
    // 결제 모달
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false); // 결제 모달 상태
    const isPremium = useSelector(state => state.subscription.isPremium);
    const { isDateChanged } = useCheckDateChange();

    const [fourWeeksLater, setFourWeeksLater] = useState(null);

    useEffect(() => {
        if (memberSignupDate) {
            const signupDateObj = new Date(memberSignupDate); // 문자열을 Date 객체로 변환
            signupDateObj.setDate(signupDateObj.getDate() + 28); // 28일 후 계산
            setFourWeeksLater(signupDateObj.toISOString().split("T")[0]); // YYYY-MM-DD 형식으로 저장
        }
    }, [memberSignupDate]);

    useEffect(() => {
        console.log("==========운동페이지 입니다============");
        console.log(memberSignupDate);
    
        if (memberSignupDate) {
            const signupDate = new Date(memberSignupDate);
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate - signupDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
            setDay(diffDays);
    
            if (diffDays >= 125) {
                if (isSubscribed) {
                    setHasSubscriptionAccess(true); 
                    setSelectedOption('AutoAdapt');
                } else {
                    setHasSubscriptionAccess(false); 
                    setSelectedOption('OnSchedule');
                }
            } else {
                setHasSubscriptionAccess(true); 
                setSelectedOption('AutoAdapt');
            }

        }
    }, [memberSignupDate, isSubscribed]); // isSubscribed 추가

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

        if(!isPremium) {
            if (option === 'AutoAdapt' && !hasSubscriptionAccess) {
                setIsPaymentModalVisible(true); // 여기서 모달을 띄우도록 변경
                return;
            }
        }
        
        
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
            <FreeTrialBanner fourWeeksLater={fourWeeksLater} />

            <ScrollView  style={styles.scrollView}
                keyboardShouldPersistTaps="handled" // 버튼 탭 시 키보드 유지
            >
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
                        {(!hasSubscriptionAccess && !isPremium) && (
                            <View style={styles.blur}>
                                <Icon name="lock" size={38} color="white" style={{ marginTop: 27 }} />
                            </View>
                        )}


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

            <SubscriptionModal
                visible={isPaymentModalVisible}
                onClose={() => setIsPaymentModalVisible(false)}
            />
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
        position:'relative'
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