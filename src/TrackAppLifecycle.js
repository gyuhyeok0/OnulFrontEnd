import { useEffect } from 'react';
import { AppState } from 'react-native';
import analytics from '@react-native-firebase/analytics';

// ✅ useLifecycleTracking 훅으로 변환
const useLifecycleTracking = () => {
    useEffect(() => {
        // 앱이 열릴 때 'app_open' 로깅
        analytics()
            .logEvent('app_open')
            .then(() => console.log('Analytics app_open event logged'))
            .catch(error => console.error('Analytics logEvent error:', error));

        // 앱 상태 변경 감지
        const handleAppStateChange = async (nextAppState) => {
            if (nextAppState === 'background') {
                // 앱이 백그라운드로 이동할 때 'app_close' 로깅
                await analytics()
                    .logEvent('app_close')
                    .then(() => console.log('Analytics app_close event logged'))
                    .catch(error => console.error('Analytics logEvent error:', error));
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);
};

export default useLifecycleTracking;
