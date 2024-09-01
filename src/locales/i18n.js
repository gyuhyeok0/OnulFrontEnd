import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translationEN from './en/translation.json';
import translationKO from './ko/translation.json';

// 기기 언어를 감지합니다.
const locales = Localization.getLocales();
const deviceLanguageTag = locales[0].languageTag;

const resources = {
    en: {
        translation: translationEN
    },
    ko: {
        translation: translationKO
    }
};

const initializeI18n = async () => {
    const getStoredLanguage = async () => {
        try {
            const storedLanguage = await AsyncStorage.getItem('user-language');
            return storedLanguage || deviceLanguageTag;
        } catch (error) {
            console.error('Failed to load language from storage:', error);
            return deviceLanguageTag;
        }
    };

    const storedLanguage = await getStoredLanguage();

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

    console.log("================= 언어 초기화 ==================")
    console.log(locales)
    console.log(storedLanguage); 
};

export default initializeI18n;
