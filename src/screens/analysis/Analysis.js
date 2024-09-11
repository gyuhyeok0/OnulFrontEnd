import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Footer from '../common/Footer'; 
import Header from '../common/Header'; // 커스텀 헤더 컴포넌트 임포트

const Analysis = ({ navigation }) => {

    useEffect(() => {
        console.log("=====================분석 페이지 ========================")
    }, []);
    

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#1A1C22' }}>
            
            <Header title="Analysis" navigation={navigation} />

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Analysis Page</Text>
            </View>

            <Footer navigation={navigation} />
        </View>
    );
};

export default Analysis;
