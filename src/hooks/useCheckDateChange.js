import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { resetState } from '../modules/StateExerciseSlice';

const useCheckDateChange = () => {
    const dispatch = useDispatch();
    const [isDateChanged, setIsDateChanged] = useState(false);

    useEffect(() => {
        const checkDateChange = async () => {
            try {
                const todayDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식

                // ✅ "오늘 resetState()가 실행되었는지 확인"
                const resetDoneDate = await AsyncStorage.getItem('resetDoneDate'); 

                console.log(`📌 마지막 리셋 날짜: ${resetDoneDate}`);

                // ✅ 오늘 resetState()가 실행되지 않았으면 실행
                if (resetDoneDate !== todayDate) {
                    console.log(`✅ 하루 1회 실행! (${resetDoneDate} → ${todayDate})`);

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
