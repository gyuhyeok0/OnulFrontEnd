import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { styles } from './WeeklySchedule.module';
import { useCurrentWeekAndDay } from '../../src/hooks/useCurrentWeekAndDay';
import { useBoxAnimations } from '../../src/hooks/useBoxAnimations';
import ScheduleSelection from './ScheduleSelection';

const WeeklySchedule = () => {
    const { isSwapped, todayIndex } = useCurrentWeekAndDay();  // 주차와 요일 상태 관리
    const { oneWeekAnimations, twoWeekAnimations, startAnimating, stopAnimating } = useBoxAnimations();  // 애니메이션 상태 관리
    const [selectedBox, setSelectedBox] = useState({ oneWeek: null, twoWeek: null });  // 선택된 박스 상태 관리
    const [selectedWeekType, setSelectedWeekType] = useState(null);  // 선택된 주차 (oneWeek인지 twoWeek인지)
    const [selectedDay, setSelectedDay] = useState(null);  // 선택된 요일

    // 요일 리스트를 일요일부터 시작하도록 변경
    const days = ['Su', 'Mn', 'Tu', 'Ws', 'Th', 'Fr', 'Sa'];  // 요일 리스트

    // 요일 박스 클릭 시 실행되는 함수
    const handleBoxPress = useCallback((index, weekType) => {
        stopAnimating();
        setSelectedBox(prev => ({
            oneWeek: weekType === 'oneWeek' ? index : null,
            twoWeek: weekType === 'twoWeek' ? index : null,
        }));
        setSelectedWeekType(weekType);  // 선택된 주차 설정
        setSelectedDay(days[index]);  // 선택된 요일 설정
        const animations = weekType === 'oneWeek' ? oneWeekAnimations : twoWeekAnimations;
        startAnimating(animations[index], weekType);
    }, [oneWeekAnimations, twoWeekAnimations, startAnimating, stopAnimating]);

    // 요일을 렌더링하는 함수
    const renderDays = useCallback(() => (
        <View style={styles.dayRow}>
            {days.map((day, index) => (
                <View key={index} style={styles.day}>
                    <Text style={[styles.dayText, index === 6 && styles.saturdayText, index === 0 && styles.sundayText]}>
                    {day}
                    </Text>
                </View>
            ))}
        </View>
    ), []);

    // 주차별 요일 박스 렌더링 함수
    const renderWeekBoxes = useCallback((style, weekType, animations) => (
        <View style={[
            style,
            weekType === 'oneWeek' && isSwapped && styles.swappedOneWeek,  // oneWeek의 배경색이 바뀜
            weekType === 'twoWeek' && isSwapped && styles.swappedTwoWeek   // twoWeek의 배경색이 바뀜
        ]}>
            {[...Array(7)].map((_, index) => (
                <Pressable
                    key={index}
                    style={[
                        styles.dayBox,
                        weekType === 'oneWeek' && selectedBox.oneWeek === index && styles.selectedBox,
                        weekType === 'twoWeek' && selectedBox.twoWeek === index && styles.selectedBox,
                        todayIndex === index && !isSwapped && weekType === 'oneWeek' && styles.todayBox,
                        todayIndex === index && isSwapped && weekType === 'twoWeek' && styles.todayBox,
                    ]}
                    onPress={() => handleBoxPress(index, weekType)}
                >
                    <Animated.View
                        style={[
                            styles.animatedBox,
                            {
                                backgroundColor: animations[index].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: isSwapped
                                        ? weekType === 'oneWeek'
                                            ? ['#326CA8', '#7AACE0']  // oneWeek 색상이 두번째 주의 색상으로 변경
                                            : ['#5FA5EB', '#9BC7F2']  // twoWeek 색상이 첫번째 주의 색상으로 변경
                                        : weekType === 'oneWeek'
                                            ? ['#5FA5EB', '#9BC7F2']  // 기본 oneWeek 색상
                                            : ['#326CA8', '#7AACE0'],  // 기본 twoWeek 색상
                                }),
                            },
                        ]}
                    />
                </Pressable>
            ))}
        </View>
    ), [selectedBox, handleBoxPress, isSwapped, todayIndex]);

    const isDaySelected = selectedBox.oneWeek !== null || selectedBox.twoWeek !== null;

    return (
        <View style={styles.scheduleContainer}>
            <Text style={styles.scheduleTitle}>Recurring Schedule</Text>

            <View style={styles.weeklySchedule}>
                {renderDays()}

                {renderWeekBoxes(styles.oneWeek, 'oneWeek', oneWeekAnimations)}
                {renderWeekBoxes(styles.twoWeek, 'twoWeek', twoWeekAnimations)}

                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendBox, { backgroundColor: '#5FA5EB' }]} />
                        <Text style={styles.legendText}>이번주</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendBox, { backgroundColor: '#1D4772' }]} />
                        <Text style={styles.legendText}>다음주</Text>
                    </View>
                </View>

                {!isDaySelected ? (
                    <View style={styles.registration}>
                        <Text style={styles.registrationText}>원하는 요일을 터치해 주세요</Text>
                    </View>
                ) : (
                    <ScheduleSelection selectedWeekType={selectedWeekType} selectedDay={selectedDay} />
                )}
            </View>
        </View>
    );
};

export default WeeklySchedule;
