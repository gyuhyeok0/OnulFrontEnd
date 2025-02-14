import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { resetState } from '../modules/StateExerciseSlice';

const useCheckDateChange = () => {
    const dispatch = useDispatch();
    const [isDateChanged, setIsDateChanged] = useState(false);

    useEffect(() => {
        const checkDateChange = async () => {
            console.log("시발!!!!!!")
            try {
                const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식

                // ✅ "현재 접속일" 가져오기
                const currentAccessDate = await AsyncStorage.getItem('currentAccessDate');

                // ✅ "오늘 resetState()가 실행되었는지 확인"
                const resetDoneDate = await AsyncStorage.getItem('resetDoneDate'); 

                console.log(`📌 현재 접속일: ${currentAccessDate}, 마지막 리셋 날짜: ${resetDoneDate}`);

                // ✅ 날짜가 변경되었고, 오늘 resetState()가 실행되지 않았으면 실행
                if (currentAccessDate && currentAccessDate !== todayDate && resetDoneDate !== todayDate) {
                    console.log(`✅ 날짜 변경 감지됨! (${currentAccessDate} → ${todayDate})`);

                    // ✅ Redux 상태 초기화
                    dispatch(resetState());

                    // ✅ reset 실행 날짜 저장 → 오늘 한 번만 실행됨
                    await AsyncStorage.setItem('resetDoneDate', todayDate);

                    setIsDateChanged(true);
                } else {
                    setIsDateChanged(false);
                }
            } catch (error) {
                console.error('❌ 날짜 변경 감지 실패:', error);
            }
        };

        checkDateChange();
    }, [dispatch]); // Redux 상태 업데이트가 필요할 때만 실행

    return { isDateChanged };
};

export default useCheckDateChange;  