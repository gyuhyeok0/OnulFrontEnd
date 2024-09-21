import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import Footer from '../common/Footer';
import { useSelector } from 'react-redux';
import { checkOnboardingStatus } from '../../hooks/HendleOnboarding';
import { handlerLogOut } from '../../hooks/HandleLogout';  // Logout.js에서 함수 임포트

const Exercise = ({ navigation }) => {
    const userId = useSelector((state) => state.member.userInfo.memberId);
    const accessToken = useSelector((state) => state.member.userInfo.accessToken);

    useEffect(() => {
        if (userId && accessToken) {
            checkOnboardingStatus(userId, accessToken, navigation);
        } else {
            handlerLogOut(navigation);
        }
    }, [userId, accessToken]);

    const handleCheckOnboarding = () => {

        if (userId && accessToken) {
            checkOnboardingStatus(userId, accessToken, navigation);
        } else {
            handlerLogOut(navigation);
        }
    };


    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#1A1C22' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Exercise Page</Text>
                <Button title="Check Onboarding Status" onPress={handleCheckOnboarding} />
            </View>
            <Footer navigation={navigation} />
        </View>
    );
};

export default Exercise;
