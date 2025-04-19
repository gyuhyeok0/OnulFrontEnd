import analytics from '@react-native-firebase/analytics';
import { AppState } from 'react-native';

// ✅ Hook이 아닌 일반 함수로 변경
export const initLifecycleTracking = () => {
    // 앱 열림 이벤트
    analytics()
        .logEvent('app_open')
        .then(() => console.log('[Firebase] app_open logged'))
        .catch(err => console.error('[Firebase] app_open failed:', err));

    // 앱 닫힘 감지
    const handleAppStateChange = async (nextState) => {
        if (nextState === 'background') {
        try {
            await analytics().logEvent('app_close');
            console.log('[Firebase] app_close logged');
        } catch (err) {
            console.error('[Firebase] app_close failed:', err);
        }
        }
    };

    // 이벤트 리스너 등록
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // ✅ 정리 함수 반환 (MainApp에서 cleanup에 쓰일 수 있음)
    return () => {
        subscription.remove();
    };
};
