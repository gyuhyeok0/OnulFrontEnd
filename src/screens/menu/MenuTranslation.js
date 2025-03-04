import 'intl-pluralrules';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DefaultHeader from '../common/DefaultHeader';

const MenuTranslation = ({ navigation }) => {
    useEffect(() => {
        console.log("===================== 번역 페이지 ========================");
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
        <>
            <DefaultHeader title={t('translation')} navigation={navigation} />
            <View style={styles.container}>
                <Text style={styles.welcomeText}>{t('welcome_message')}</Text>

                <TouchableOpacity 
                    style={[styles.button, styles.englishButton]} 
                    onPress={() => changeLanguage('en')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>English</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.koreanButton]} 
                    onPress={() => changeLanguage('ko')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>한국어</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.button, styles.japaneseButton]} 
                    onPress={() => changeLanguage('ja')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>日本語</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1A1C22',
    },
    welcomeText: {
        fontSize: 20,
        marginBottom: 30,
        color: 'white',
        fontWeight: 'bold',
    },
    button: {
        width: 200,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    englishButton: {
        backgroundColor: '#0056B3', // 파란색
    },
    koreanButton: {
        backgroundColor: '#0056B3', // 빨간색
    },
    japaneseButton: {
        backgroundColor: '#0056B3', // 초록색
    },
});

export default MenuTranslation;
