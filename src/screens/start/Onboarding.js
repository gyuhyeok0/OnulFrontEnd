import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

const Onboarding = ({ navigation }) => {

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#1A1C22' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>온보딩 Page</Text>
            </View>
        </View>
    );
};

export default Onboarding;
