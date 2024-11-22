import { useState, useEffect } from 'react';

// 스케쥴 관련 주 별로 색 변화
export const useCurrentWeekAndDay = () => {
  const [isSwapped, setIsSwapped] = useState(false);  // 색상이 바뀌었는지 여부
  const [todayIndex, setTodayIndex] = useState(null);  // 오늘의 요일 인덱스

  useEffect(() => {
    const currentWeek = getCurrentWeekNumber(new Date());

    setIsSwapped(currentWeek % 2 !== 0);  // 짝수 주라면 false, 홀수 주라면 true

    // 오늘의 요일 인덱스 설정 (0: 일요일, 6: 토요일)
    const today = new Date().getDay();
    setTodayIndex(today);  // 일요일(0)을 첫 번째로 맞춤
  }, [new Date().getDate()]);

  const getCurrentWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  return { isSwapped, todayIndex };
};
