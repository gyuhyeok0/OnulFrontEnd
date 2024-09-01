import 'intl-pluralrules';
import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenuTranslation = () => {
    useEffect(() => {
        console.log("=====================번역 페이지 ========================")
    }, []);

    const { t, i18n } = useTranslation();

    const changeLanguage = async (lng) => {
        i18n.changeLanguage(lng);
        try {
            await AsyncStorage.setItem('user-language', lng);
        } catch (error) {
            console.error('Failed to save language to storage:', error);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>
                {t('welcome_message')}
            </Text>
            <Button title="English" onPress={() => changeLanguage('en')} />
            <Button title="한국어" onPress={() => changeLanguage('ko')} />
        </View>
    );
};

export default MenuTranslation;
