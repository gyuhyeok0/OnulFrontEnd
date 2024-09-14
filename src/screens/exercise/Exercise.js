import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Footer from '../common/Footer';
import { useSelector } from 'react-redux';
import { checkOnboardingStatus} from '../../hooks/HendleOnboarding'
import { handlerLogOut } from '../../hooks/HandleLogout';  // Logout.js에서 함수 임포트

const Exercise = ({ navigation }) => {
    const userId = useSelector((state) => state.member.userInfo.memberId);
    const accessToken = useSelector((state) => state.member.userInfo.accessToken);


    useEffect(() => {
        if (userId && accessToken) {
            // checkOnboardingStatus 호출 시 필요한 변수들 전달
            checkOnboardingStatus(userId, accessToken, navigation);
        } else {
            handlerLogOut(navigation);
        }
    }, [userId, accessToken]);

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
