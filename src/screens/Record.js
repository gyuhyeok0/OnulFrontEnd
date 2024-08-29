import React from 'react';
import { View, Text } from 'react-native';
import Footer from './common/Footer'; 
import Header from './common/Header'; // 커스텀 헤더 컴포넌트 임포트

const Record = ({ navigation }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            {/* 커스텀 헤더 컴포넌트 사용 */}
            <Header title="Record" navigation={navigation} />
            
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Record Page</Text>
            </View>

            {/* Footer 컴포넌트 사용 */}
            <Footer navigation={navigation} />
        </View>
    );
};

export default Record;
