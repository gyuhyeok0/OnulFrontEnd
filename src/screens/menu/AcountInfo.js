import 'intl-pluralrules';
import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import { handlerLogOut } from '../../hooks/HandleLogout';  // Logout.js에서 함수 임포트
import DefaultHeader from '../common/DefaultHeader';


const MenuAcountInfo = ({ navigation }) => {
    useEffect(() => {
        console.log("=====================계정 정보 ========================");
    }, []);

    return (
        <>
            <DefaultHeader title="메뉴" navigation={navigation} />

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button title="로그아웃" onPress={() => handlerLogOut(navigation)} />
            </View>
        </>
    );
};

export default MenuAcountInfo;
