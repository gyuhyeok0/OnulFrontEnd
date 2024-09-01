// src/screens/Menu.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { i18n, setLocale } from '../locales/i18n'; // i18n 모듈을 가져옵니다.

const Menu = () => {
    const [locale, setLocaleState] = useState(i18n.locale);

    const handleLanguageChange = (newLocale) => {
        setLocale(newLocale); // i18n에 새로운 로케일을 설정합니다.
        setLocaleState(newLocale); // 컴포넌트 상태를 업데이트합니다.
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{i18n.t('menu.title')}</Text> {/* 번역된 문자열 표시 */}
            
            <View style={styles.buttonContainer}>
                <Button
                    title="English"
                    onPress={() => handleLanguageChange('en')} // 영어로 변경
                />
                <Button
                    title="한국어"
                    onPress={() => handleLanguageChange('ko')} // 한국어로 변경
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
    },
});

export default Menu;
