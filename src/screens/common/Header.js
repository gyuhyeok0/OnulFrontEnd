import React from 'react';
import { SafeAreaView, View, TouchableOpacity, Text, StatusBar, Platform } from 'react-native';
import { headerStyles } from './HeaderStyles.module';  // 스타일 파일을 임포트
import Icon from 'react-native-vector-icons/MaterialIcons';  // 설정 아이콘
import { useNavigationState } from '@react-navigation/native';
import BannerAdComponent from '../../ads/BannerAdComponent';

const Header = ({ title, navigation }) => {
    // 현재 라우트 이름 가져오기
    const routeName = useNavigationState(state => state.routes[state.index].name);

    return (
        <>
            {/* StatusBar 설정 */}
            <StatusBar barStyle="light-content" backgroundColor={Platform.OS === 'android' ? '#1A1C22' : 'transparent'} />

            <SafeAreaView style={[headerStyles.safeArea, { backgroundColor: '#1A1C22' }]}>
                <View style={[headerStyles.headerStyle, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft:15, paddingRight:15 }]}>
                    {/* 중간 제목 (title) */}
                    <Text style={headerStyles.headerText}>
                        {title}
                    </Text>

                    {/* Menu 버튼 - 설정 아이콘 오른쪽 정렬 */}
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Menu')}
                        style={{paddingLeft: 40 }} // ← 터치 영역 & 아이콘 주변 여백 모두 확대
                        >
                            <Icon name="settings" size={25} color="gray" />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 5 }} />
                <BannerAdComponent />
                <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 5 }} />
            </SafeAreaView>
        </>
    );
};

export default Header;
