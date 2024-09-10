import 'intl-pluralrules';
import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenuAcountInfo = ({ navigation }) => {
    useEffect(() => {
        console.log("=====================계정 정보 ========================");
    }, []);

    const handlerLogOut = async () => {
        try {
            // 로컬 저장소 전체 삭제
            await AsyncStorage.clear();

            // 네비게이션 스택 리셋 후 로그인 페이지로 이동
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="로그아웃" onPress={handlerLogOut} />
        </View>
    );
};

export default MenuAcountInfo;
