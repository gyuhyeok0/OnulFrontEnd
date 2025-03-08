import { Alert, BackHandler, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { API_URL } from '@env';
import i18n from 'i18next';

// 버전 문자열을 숫자로 변환하여 비교하는 함수
const versionToNumber = (version) => {
    console.log(`🔍 변환 전 버전: ${version}`);
    const parts = version.split('.').map(num => Number(num));
    while (parts.length < 3) parts.push(0);
    const numericVersion = parts[0] * 10000 + parts[1] * 100 + parts[2];
    console.log(`✅ 변환 후 배열: ${parts}`);
    console.log(`🎯 최종 숫자 버전: ${numericVersion}`);
    return numericVersion;
};

// ✅ 성공 시 true, 실패 시 false 반환
export const checkAppVersion = async () => {
    console.log("버전 api");
    try {
        const currentVersion = DeviceInfo.getVersion();
        const response = await fetch(`${API_URL}/appVersion/version`);
        
        if (!response.ok) {
            console.error(`서버 응답 오류: ${response.status}`);
            return false; // ❌ 서버 응답 오류 시 false 반환
        }

        const data = await response.json();
        const latestVersion = data.version;

        console.log(`현재 버전: ${currentVersion}, 최신 버전: ${latestVersion}`);

        if (versionToNumber(currentVersion) < versionToNumber(latestVersion)) {
            console.log("🚀 업데이트 필요!");
            Alert.alert(
                i18n.t('update_required.title'),
                `${i18n.t('update_required.message')}\n\n${i18n.t('update_required.close_app')}`,
                [{ 
                    text: i18n.t('update_required.confirm'), 
                    onPress: () => {
                        if (Platform.OS === "android") {
                            BackHandler.exitApp();
                        } else {
                            console.log(i18n.t('update_required.ios_notice'));
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
