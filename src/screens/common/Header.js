import React from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, StatusBar, Platform } from 'react-native';
import { headerStyles } from './HeaderStyles.module';  // 스타일 파일을 임포트

const Header = ({ title, navigation }) => {
    return (
        <>
            {/* StatusBar 설정 */}
            <StatusBar barStyle="light-content" backgroundColor={Platform.OS === 'android' ? 'black' : 'transparent'} />

            <SafeAreaView style={[headerStyles.safeArea, { backgroundColor: 'black' }]}>
                <View style={[headerStyles.headerStyle, { flexDirection: 'row', alignItems: 'center', padding: 10 }]}>
                    {/* 중간 제목 (title)도 Text로 감싸기 */}
                    <Text style={{ color: headerStyles.headerTintColor }}>
                        {title}
                    </Text>

                    {/* Menu 버튼 */}
                    <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
                        <Text style={{ color: headerStyles.headerTintColor }}>Menu</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
};

export default Header;
