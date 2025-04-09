import { Alert, BackHandler, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import i18n from 'i18next';

import * as RNLocalize from 'react-native-localize';

import { API_URL_JP, API_URL_US } from '@env';


const locales = RNLocalize.getLocales();
const userLocale = locales.length > 0 ? locales[0].languageTag : "en-US"; // 예: "ja-JP", "ko-KR", "en-US"

const userRegion = userLocale.includes("JP") || userLocale.includes("KR") ? "JP" : "US";
const API_URL = userRegion === "JP" ? API_URL_JP : API_URL_US;


// 버전 문자열을 숫자로 변환하여 비교하는 함수
const versionToNumber = (version) => {
    const parts = version.split('.').map(num => Number(num));
    while (parts.length < 3) parts.push(0);
    const numericVersion = parts[0] * 10000 + parts[1] * 100 + parts[2];
    return numericVersion;
};

// ✅ 성공 시 true, 실패 시 false 반환
export const checkAppVersion = async (memberId) => {
    try {
        const currentVersion = DeviceInfo.getVersion();
        const response = await fetch(`${API_URL}/appVersion/version?memberId=${memberId}`);
        
        if (!response.ok) {
            console.error(` checkAppVersion 서버 응답 오류: ${response.status}`);
            return false; 
        }

        const data = await response.json();
        const latestVersion = data.version;


        if (versionToNumber(currentVersion) < versionToNumber(latestVersion)) {
            Alert.alert(
                i18n.t('update_required.title'),
                `${i18n.t('update_required.message')}\n\n${i18n.t('update_required.close_app')}`,
                [{ 
                    text: i18n.t('update_required.confirm'), 
                    onPress: () => {
                        if (Platform.OS === "android") {
                            BackHandler.exitApp();
                        } else {
                            // console.log(i18n.t('update_required.ios_notice'));
                        }
                    }
                }]
            );
            return false; // ❌ 업데이트 필요 시 false 반환
        }

        return true; // ✅ 최신 버전일 경우 true 반환
    } catch (error) {
        console.error('버전 체크 실패:', error);
        return false; // ❌ 네트워크 오류 등 예외 발생 시 false 반환
    }
};
