import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Footer from '../common/Footer'; 
import Header from '../common/Header'; // 커스텀 헤더 컴포넌트 임포트

const Exercise = ({ navigation }) => {

    useEffect(() => {
        console.log("=====================운동 페이지 ========================")
    }, []);
    

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#1A1C22' }}>
            {/* 커스텀 헤더 컴포넌트 사용 */}
            {/* <Header title="Exercise" navigation={navigation} /> */}
            
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Exercise Page</Text>
            </View>

            {/* Footer 컴포넌트 사용 */}
            <Footer navigation={navigation} />
        </View>
    );
};

export default Exercise;
