// hooks/Logout.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const handlerLogOut = async (navigation) => {
    try {
        // 로컬 저장소 전체 삭제
        await AsyncStorage.clear();

        // 타이머 관련 데이터 삭제
        await AsyncStorage.multiRemove(['timerTime', 'timerRunning', 'lastTime']);

        // 네비게이션 스택 리셋 후 로그인 페이지로 이동
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    } catch (error) {
        console.error("Logout failed", error);
    }
};
