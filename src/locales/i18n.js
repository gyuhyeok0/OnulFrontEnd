import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import translationEN from './en/translation.json';
import translationKO from './ko/translation.json';
import translationJA from './ja/translation.json'; 

import translationES from './es/translation.json';


// 기기 언어를 감지합니다.
const locales = Localization.getLocales();
const deviceLanguageTag = locales[0].languageTag;

const resources = {
    en: { 
        translation: translationEN
    },
    ko: {
        translation: translationKO
    },
    ja: { 
        translation: translationJA
    },
    es: { // 스페인어 추가
        translation: translationES
    },
    // de: { // 독일어 추가
    //     translation: translationDE
    // },
    // fr: { // 프랑스어 추가
    //     translation: translationFR
    // },
    // it: { // 이탈리아어 추가
    //     translation: translationIT
    // },
    // nl: { // 네덜란드어 추가
    //     translation: translationNL
    // }
};



const initializeI18n = async () => {
    const getStoredLanguage = async () => {
        try {
            const storedLanguage = await AsyncStorage.getItem('user-language');
            return storedLanguage || deviceLanguageTag; // 저장된 언어가 없으면 기기 언어 사용
        } catch (error) {
            console.error('Failed to load language from storage:', error);
            return deviceLanguageTag; // 저장된 언어를 불러올 수 없는 경우에도 기본값 반환
        }
    };

    const storedLanguage = await getStoredLanguage();

    // i18n 초기화
    await i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: storedLanguage,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
        });

};



export default initializeI18n;
