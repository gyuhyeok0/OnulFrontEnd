import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';
import translationEN from './en/translation.json';
import translationKO from './ko/translation.json';

// 기기 언어를 감지합니다.
const locales = Localization.getLocales();
const languageTag = locales[0].languageTag;

const resources = {
    en: {
        translation: translationEN
    },
    ko: {
        translation: translationKO
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: languageTag, // 감지된 기기 언어로 설정
        fallbackLng: 'en', // 번역 파일에서 찾을 수 없는 경우 기본 언어
        interpolation: {
            escapeValue: false // react는 이미 XSS를 방지합니다.
        }
    });

export default i18n;
