// hooks/Logout.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistor, store} from '../store';
import { RESET_ALL_STATE } from '../modules/resetActions'; 

export const handlerLogOut = async (navigation) => {
    try {

        await AsyncStorage.clear();

        // ✅ 리덕스 상태 초기화
        store.dispatch({ type: RESET_ALL_STATE });

        await persistor.purge(); 

        
        if (!navigation) {
            console.error("navigation 객체가 존재하지 않습니다.");
            return;
        }
        
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userInfo','timerTime', 'timerRunning', 'lastTime']);

        // 네비게이션 스택 리셋 후 로그인 페이지로 이동
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    } catch (error) {
        console.error("Logout failed", error);
    }
};
