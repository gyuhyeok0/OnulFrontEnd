import 'intl-pluralrules';
import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import { handlerLogOut } from '../../hooks/Logout';  // Logout.js에서 함수 임포트

const MenuAcountInfo = ({ navigation }) => {
    useEffect(() => {
        console.log("=====================계정 정보 ========================");
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="로그아웃" onPress={() => handlerLogOut(navigation)} />
        </View>
    );
};

export default MenuAcountInfo;
