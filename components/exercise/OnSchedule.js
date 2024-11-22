import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';  // useDispatch 추가
import { useCurrentWeekAndDay } from '../../src/hooks/useCurrentWeekAndDay';
import { 
    selectChestExercises, 
    selectBackExercises, 
    selectLowerBodyExercises, 
    selectShouldersExercises, 
    selectAbsExercises, 
    selectArmsExercises, 
    selectAerobicExercises, 
    selectCustomExercises 
} from '../../src/selectors/selectors';

import EachExercise from './EachExercise';
import Icon from 'react-native-vector-icons/Feather'; // Import Feather icons
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { callFetchScheduleAPI } from '../../src/apis/ScheduleAPI';  // API 호출 함수

const OnSchedule = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch(); // useDispatch 훅 사용

    const scheduleData = useSelector((state) => state.schedule?.schedule || []);
    const { isSwapped, todayIndex } = useCurrentWeekAndDay();
    const days = ['Su', 'Mn', 'Tu', 'Ws', 'Th', 'Fr', 'Sa'];
    const KoreanDays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

    const chestExercises = useSelector(selectChestExercises);
    const backExercises = useSelector(selectBackExercises);
    const lowerBodyExercises = useSelector(selectLowerBodyExercises);
    const shouldersExercises = useSelector(selectShouldersExercises);
    const absExercises = useSelector(selectAbsExercises);
    const armsExercises = useSelector(selectArmsExercises);
    const aerobicExercises = useSelector(selectAerobicExercises);
    const customExercises = useSelector(selectCustomExercises);
    
    const [scheduleHeight, setScheduleHeight] = useState(0); // 스케쥴 높이를 저장
    const [refreshKey, setRefreshKey] = useState(0); // 새로고침을 위한 키 추가
    const [isVisible, setIsVisible] = useState(false); // 숨겨진 영역의 보임 여부
    const [animationHeight] = useState(new Animated.Value(0)); // 애니메이션을 위한 height 값

    const today = days[todayIndex];
    const todayKorean = KoreanDays[todayIndex]; // Adding Korean day

    const bodyParts = ['가슴', '등', '하체', '어깨', '복근', '팔', '기타', '커스텀'];
    const [selectedParts, setSelectedParts] = useState({});


    // 데이터가 없거나 업데이트가 필요하면 API 호출
    useEffect(() => {
        if (!scheduleData || scheduleData.needsUpdate) {  // 데이터가 없거나 업데이트가 필요하면
            dispatch(callFetchScheduleAPI());  // API 호출
        }
    }, [dispatch, scheduleData]);

    // 새로고침 트리거용 useMemo
    const todaySchedules = React.useMemo(() => {
        const today = days[todayIndex];
        const currentWeekType = isSwapped ? 'twoWeek' : 'oneWeek';
        return scheduleData.filter(
            (item) => item.day === today && item.weekType === currentWeekType
        );
    }, [scheduleData, days, todayIndex, isSwapped, refreshKey, new Date().getDate()]); // 의존성 배열에 new Date().getDate()를 제외하고 사용

    const exerciseMap = {
        '가슴': chestExercises,
        '등': backExercises,
        '하체': lowerBodyExercises,
        '어깨': shouldersExercises,
        '복근': absExercises,
        '팔': armsExercises,
        '기타': aerobicExercises,
        '커스텀': customExercises,
    };

    const renderExerciseList = (part) => {
        const exercises = exerciseMap[part];
        if (!Array.isArray(exercises) || exercises.length === 0) {
            return null;
        }
        return exercises.map((exercise, index) => (
            <EachExercise 
                key={exercise.id || index} 
                exercise={exercise} 
            />
        ));
    };

    const hasExercises = todaySchedules.some(item => {
        const exercises = exerciseMap[item.part];
        return Array.isArray(exercises) && exercises.length > 0;
    });

    const handleRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1); // 상태를 업데이트하여 새로고침 트리거
        console.log("눌림")
        console.log(today)
        console.log(todaySchedules)
        console.log(scheduleData)
    };

    
    // 숨겨진 영역 보이기/숨기기 토글 함수
    const toggleVisibility = () => {
        setIsVisible(prevState => !prevState);

        // 애니메이션을 사용하여 height 값 변경
        Animated.timing(animationHeight, {
            toValue: isVisible ? 0 : 75, // 보이기 상태에서는 높이를 150으로 설정
            duration: 300, // 애니메이션 지속 시간
            useNativeDriver: false, // 높이 변화를 위한 false (opacity와 같은 스타일을 제외한 모든 스타일은 false로 설정)
        }).start();
    };

    const handlePress = (part) => {
        setSelectedParts((prevParts) => ({
            ...prevParts,
            [part]: !prevParts[part],
        }));
    };

    return (
        <View style={[styles.container, { height: scheduleHeight + 250 }]}>
            <View style={{ minHeight: 40, backgroundColor:'#222732', borderRadius: 10, padding: 8, marginBottom: 15}}>
                <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                    <Pressable style={{ height: 30, flexDirection:'row'}} onPress={handleRefresh}>
                        <View style={{flexDirection: 'row', alignItems:'center', backgroundColor:'#4A5569', padding:6, borderRadius: 5}}>
                            <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>
                                {todayKorean}
                            </Text>
                            <Icon name="rotate-cw" size={15} color="white" style={{ marginLeft: 3}} />
                        </View>
                        <Text style={{ color: '#C4C4C4', fontSize: 14, fontWeight: 'bold', marginTop:11, marginLeft: 4 }}>운동</Text>
                    </Pressable>
                    
                    {/* caret-down 아이콘을 눌렀을 때 숨겨진 영역 보이기 */}
                    <Pressable style={{ maxWidth: 200, flexDirection: 'row', justifyContent: 'flex-end', flex: 1 }} onPress={toggleVisibility}>
                        <Icon2 name={isVisible ? "caret-up" : "caret-down"} size={28} color="white" style={{ marginRight: 5 }} />
                    </Pressable>
                </View>

                {/* 숨겨진 영역 */}
                <Animated.View
                    style={[
                        styles.hiddenContent,
                        {
                            height: animationHeight, // height 애니메이션 적용
                            overflow: 'hidden', // 높이가 늘어나거나 줄어들 때 내용이 잘리지 않도록 설정
                        }
                    ]}
                >
                    {isVisible && (
                        <View style={styles.buttonContainer}>
                            {bodyParts.map((part) => (
                                <Pressable
                                    key={part} // part가 중복되지 않는지 확인
                                    style={[
                                        styles.button,
                                        selectedParts[part] && styles.selectedButton
                                    ]}
                                    onPress={() => handlePress(part)}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        selectedParts[part] && styles.selectedButtonText
                                    ]}>
                                        {part}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </Animated.View>

            </View>

            {todaySchedules.length > 0 && hasExercises ? (
                <View 
                    style={styles.schedule}
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        setScheduleHeight(height); // 스케쥴 높이를 저장
                    }}
                >
                    {todaySchedules.map((item, index) => (
                        <View key={index}>
                            {renderExerciseList(item.part)}
                        </View>
                    ))}
                </View>
            ) : (
                <View style={styles.noSchedule}>
                    <Text style={styles.noScheduleText}>현재 스케쥴에 등록된 운동이 없습니다.</Text>
                    <Pressable style={styles.noScheduleButton} onPress={() => navigation.navigate('Schedule')}>
                        <Text style={styles.noScheduleButtonText}>스케쥴 등록하러 가기</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
    },

    noSchedule: {
        width: '100%',
        marginBottom: 30,
        padding: 15,
    },

    noScheduleText: {
        fontSize: 13,
        color: '#F0F0F0',
    },

    noScheduleButton: {
        marginTop: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: '#4A7BF6',
        borderRadius: 10,
    },
    
    noScheduleButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    hiddenContent: {
        // marginTop: 10,
    },

    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // 여러 줄로 버튼을 정렬
        marginTop:10,
        maxWidth: 350,
        // backgroundColor: 'white'
    },

    button: {
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 10,
        paddingRight: 10,

        margin: 4,
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: '#fff',
    },

    selectedButton: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },

    selectedButtonText: {
        color: '#000',
    },

    completeButton: {
        margin: 8,
        marginTop: 13,

        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 20,
        paddingRight: 20,

        backgroundColor: '#183B95',
        borderRadius: 20,
    },

    completeButtonText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default OnSchedule;
