import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Footer from '../common/Footer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { handlerLogOut } from '../../hooks/Logout';  // Logout.js에서 함수 임포트

const Exercise = ({ navigation }) => {
    const userId = useSelector((state) => state.member.userInfo.memberId);

    // checkOnboardingStatus 함수는 useEffect 외부에 선언
    const checkOnboardingStatus = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/onboarding/check?memberId=${userId}`);
            const needsOnboarding = response.data;

            console.log("Onboarding 필요 여부: ", needsOnboarding);

            if (needsOnboarding) {
                console.log("온보딩이 필요합니다.");
                // 온보딩 페이지로 이동
                navigation.navigate('Onboarding');
            } else {
                console.log("온보딩이 필요하지 않습니다.");
            }
        } catch (error) {
            console.error("온보딩 상태 확인 중 오류 발생: ", error);
        }
    };

    useEffect(() => {
        if (userId) {
            checkOnboardingStatus();
        } else {
            handlerLogOut();
        }
    }, [userId, navigation]);

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#1A1C22' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Exercise Page</Text>
            </View>
            <Footer navigation={navigation} />
        </View>
    );
};

export default Exercise;
