// src/screens/Menu.js

import 'intl-pluralrules'; // 폴리필을 가장 먼저 임포트합니다.
import { useTranslation } from 'react-i18next'; 
import '../../locales/i18n'; 

import React from 'react';
import { Text, View, Button } from 'react-native';
import { useEffect } from 'react';

const MenuTranslation = () => {

    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng); // 사용자가 선택한 언어로 변경합니다.
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>
            {t('welcome_message')} {/* 다국어 텍스트를 표시합니다. */}
            </Text>
            <Button title="English" onPress={() => changeLanguage('en')} />
            <Button title="한국어" onPress={() => changeLanguage('ko')} />
        </View>
    );
    }



export default MenuTranslation;
