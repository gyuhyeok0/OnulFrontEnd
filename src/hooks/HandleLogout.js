// hooks/Logout.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const handlerLogOut = async (navigation) => {
    try {
        
        if (!navigation) {
            console.error("navigation 객체가 존재하지 않습니다.");
            return;
        }
        

        // 로컬 저장소 토큰 삭제
        await AsyncStorage.removeItem('accessToken');

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
