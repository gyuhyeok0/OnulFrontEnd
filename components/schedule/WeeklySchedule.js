import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { styles } from './WeeklySchedule.module';
import { useCurrentWeekAndDay } from '../../src/hooks/useCurrentWeekAndDay';
import { useBoxAnimations } from '../../src/hooks/useBoxAnimations';
import ScheduleSelection from './ScheduleSelection';
import { callFetchScheduleAPI } from '../../src/apis/ScheduleAPI';
import { useDispatch, useSelector } from 'react-redux';  // Redux 사용
import { useTranslation } from 'react-i18next';

const WeeklySchedule = () => {
    const { t } = useTranslation();
    const { isSwapped, todayIndex } = useCurrentWeekAndDay();
    const { oneWeekAnimations, twoWeekAnimations, startAnimating, stopAnimating } = useBoxAnimations();
    const [selectedBox, setSelectedBox] = useState({ oneWeek: null, twoWeek: null });
    const [selectedWeekType, setSelectedWeekType] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [scheduleKey, setScheduleKey] = useState(0);
    const [weekInfo, setWeekInfo] = useState('');

    const dispatch = useDispatch();
    const scheduleData = useSelector((state) => state.schedule);  // 스케줄 데이터 가져오기


    useEffect(() => {
        if (!scheduleData || scheduleData.needsUpdate) {  // 데이터가 없거나 업데이트가 필요하면
            dispatch(callFetchScheduleAPI());  // API 호출
        }

    }, [dispatch, scheduleData]);


    // 요일과 주차에 맞는 운동 부위 텍스트 가져오기
    const getPartForDay = (day, weekType) => {
        // scheduleData가 null이 아닌지 확인
        if (!scheduleData || !scheduleData.schedule) {
            return [];  // 빈 배열 반환
        }
        
        // 현재 요일과 주차에 맞는 운동 부위를 필터링하여 배열로 반환
        return scheduleData.schedule
            .filter(item => item.day === day && item.weekType === weekType)
            .map(item => item.part) || [];  // 해당 요일에 데이터가 없으면 빈 배열 반환
    };

    const days = ['Su', 'Mn', 'Tu', 'Ws', 'Th', 'Fr', 'Sa'];

    const handleBoxPress = useCallback((index, weekType) => {
        stopAnimating();
        setSelectedBox(prev => ({
            oneWeek: weekType === 'oneWeek' ? index : null,
            twoWeek: weekType === 'twoWeek' ? index : null,
        }));
        setSelectedWeekType(weekType);
        setSelectedDay(days[index]);
        setScheduleKey(prevKey => prevKey + 1);

        let info = '';
        if (!isSwapped) {
            info = weekType === 'oneWeek' ? '이번주' : '다음주';
        } else {
            info = weekType === 'oneWeek' ? '다음주' : '이번주';
        }
        setWeekInfo(info);

        const animations = weekType === 'oneWeek' ? oneWeekAnimations : twoWeekAnimations;
        startAnimating(animations[index], weekType);
    }, [oneWeekAnimations, twoWeekAnimations, startAnimating, stopAnimating, isSwapped]);

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

    const renderWeekBoxes = useCallback((style, weekType, animations) => (
        <View style={[
            style,
            weekType === 'oneWeek' && isSwapped && styles.swappedOneWeek,
            weekType === 'twoWeek' && isSwapped && styles.swappedTwoWeek
        ]}>
            {[...Array(7)].map((_, index) => {
                const day = days[index]; // 요일을 가져오기
                const partsForDay = getPartForDay(day, weekType);  // 해당 요일의 운동 부위 가져오기
    
                return (
                    <Pressable
                        key={index}  // key prop 추가
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
                                    flex: 1,
                                    alignItems: 'center',
                                    backgroundColor: animations[index].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: isSwapped
                                            ? weekType === 'oneWeek'
                                                ? ['#326CA8', '#7AACE0']
                                                : ['#5FA5EB', '#9BC7F2']
                                            : weekType === 'oneWeek'
                                                ? ['#5FA5EB', '#9BC7F2']
                                                : ['#326CA8', '#7AACE0'],
                                    }),
                                },
                            ]}
                        >
                            {/* 운동 부위 텍스트 추가 - 각 부분을 줄 바꿈하여 표시 */}
                            {partsForDay.map((part, partIndex) => (
                                <View
                                    key={partIndex}  // key prop 추가
                                    style={{ backgroundColor: '#CBD9FD', width: '85%', marginTop: 2, borderRadius: 11, padding: 3, justifyContent: 'center' }}
                                >
                                    <Text style={{ color: '#1A1C22', textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>
                                        {t(`bodyParts.${part}`)}
                                    </Text>
                                </View>
                            ))}
                        </Animated.View>
                    </Pressable>
                );
            })}
        </View>
    ), [selectedBox, handleBoxPress, isSwapped, todayIndex, scheduleData]);
    
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
                        <Text style={styles.legendText}>{t('weeklySchedule.thisWeek')}</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendBox, { backgroundColor: '#1D4772' }]} />
                        <Text style={styles.legendText}>{t('weeklySchedule.nextWeek')}</Text>
                    </View>
                </View>

                {!isDaySelected ? (
                    <View style={styles.registration}>
                        <Text style={styles.registrationText}>{t('weeklySchedule.touchDay')}</Text>
                    </View>
                ) : (
                    <ScheduleSelection
                        key={scheduleKey}
                        selectedWeekType={selectedWeekType}
                        selectedDay={selectedDay}
                        selectedDayIndex={selectedBox[selectedWeekType]}
                        weekInfo={weekInfo}
                    />
                )}
            </View>
        </View>
    );
};

export default WeeklySchedule;
