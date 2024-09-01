import React from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { DefaultHeaderStyles } from './DefaultHeaderStyles.module';  // 스타일 파일을 임포트

const DefaultHeader = ({ title, navigation }) => {
    return (
        <View style={[DefaultHeaderStyles.headerStyle, { flexDirection: 'row', alignItems: 'center', padding: 10 }]}>
            <Button
                title="Back"
                onPress={() => navigation.goBack()}
                color={DefaultHeaderStyles.headerTintColor}  // 버튼 색상 적용
            />

        </View>
    );
};

export default DefaultHeader;
