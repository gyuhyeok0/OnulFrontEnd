import React from 'react';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { headerStyles } from './HeaderStyles.module';  // 스타일 파일을 임포트

const Header = ({ title, navigation }) => {
    return (
        <View style={[headerStyles.headerStyle, { flexDirection: 'row', alignItems: 'center', padding: 10 }]}>
            <Button
                title="Back"
                onPress={() => navigation.goBack()}
                color={headerStyles.headerTintColor}  // 버튼 색상 적용
            />
            
            <Text style={[{ fontSize: 18, marginLeft: 10 }, { color: headerStyles.headerTintColor }]}>
                {title}
            </Text>

            <Button
                title="Menu"
                onPress={() => navigation.navigate('Menu')}  // Menu 화면으로 이동
                color={headerStyles.headerTintColor}  // 버튼 색상 적용
            />


        </View>
    );
};

export default Header;
