// src/screens/Menu.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import DefaultHeader from '../common/DefaultHeader';

const Menu = ({navigation}) => {
    
    useEffect(() => {
        console.log("=====================메뉴 페이지 ========================")
    }, []);

    const handleTranslation = () => {
        // 로그인 로직 구현 후, 성공하면 아래와 같이 페이지 이동
        navigation.navigate('MenuTranslation');
    };

    const hadleAcountInfo = () => {

        navigation.navigate('AcountInfo');
    }

    const hadleAsyncStorage = () => {

        navigation.navigate('AsyncStorage2');
    }

    const hadlePage = () => {

        navigation.navigate('Page');
    }



    return (
        <>
            <DefaultHeader title="메뉴" navigation={navigation} />

            <View>
                <Button title="번역" onPress={ handleTranslation } />
                <Button title="계정정보" onPress={ hadleAcountInfo } />
                <Button title="스토리지" onPress={ hadleAsyncStorage } />
                <Button title="실험용" onPress={ hadlePage } />

            </View>
        
        </>
    );
};


export default Menu;
