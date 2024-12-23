import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWeekState } from '../modules/WeekReducer'; // 리듀서 액션 import

export const useCurrentWeekAndDay = () => {
  const dispatch = useDispatch();
  const { isSwapped, todayIndex } = useSelector((state) => state.week); // Redux 상태 가져오기

  // useRef로 이전 상태 값 추적
  const prevIsSwapped = useRef(isSwapped);
  const prevTodayIndex = useRef(todayIndex);

  const [isDateChanged, setIsDateChanged] = useState(false); // 날짜가 변경되었는지 추적하는 상태

  useEffect(() => {
    // currentWeekType과 today 값 계산
    const currentWeek = getCurrentWeekNumber(new Date());
    const swapped = currentWeek % 2 !== 0;  // 홀수 주는 true, 짝수 주는 false
    const today = new Date().getDay() + 0;  // 일요일은 1로, 토요일은 7로 설정

    // isSwapped와 todayIndex가 변경된 경우에만 dispatch
    if (prevIsSwapped.current !== swapped || prevTodayIndex.current !== today) {
      dispatch(setWeekState({ isSwapped: swapped, todayIndex: today }));
      
      // 날짜가 변경되었음을 알려주는 상태 업데이트
      setIsDateChanged(true);
      
      // 이전 상태 값을 갱신
      prevIsSwapped.current = swapped;
      prevTodayIndex.current = today;
    } else {
      setIsDateChanged(false); // 날짜가 변경되지 않았으면 false로 설정
    }

  }, [dispatch, isSwapped, todayIndex]); // isSwapped, todayIndex가 변경될 때만 실행

  const getCurrentWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  return { isSwapped, todayIndex, isDateChanged }; // isDateChanged 값도 반환
};
