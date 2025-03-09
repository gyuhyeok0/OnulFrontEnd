import React, { useState, useEffect, useCallback, useRef} from 'react';
import { View, StyleSheet, Text, Pressable, Modal, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AiSettingsModal from './AiSettingsModal'; // 모달 컴포넌트 추가
import Icon from 'react-native-vector-icons/Ionicons'
import { getAutoAdaptSetting, updateAutoAdaptSetting } from '../../../src/apis/AutoAdapt';
import { useTranslation } from 'react-i18next';

// 운동 메뉴의 자동적응 코드
const DefaltSetting = ({setUpdateCount, isLoading}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();


    const memberId = useSelector((state) => state.member?.userInfo?.memberId);

    // 상태 설정 (수정된 상태들)
    const [exerciseGoal, setExerciseGoal] = useState('근비대'); // 기본값: 근비대
    const [exerciseSplit, setExerciseSplit] = useState(3); // 기본값: 4분할
    const [priorityParts, setPriorityParts] = useState(['자동']);  // 빈 배열로 초기화


    // 상태 설정 (모달 설정)
    const [difficulty, setDifficulty] = useState('중급'); // 기본값: 중급
    const [exerciseTime, setExerciseTime] = useState('60분 이하'); // 기본값
    const [exerciseStyle, setExerciseStyle] = useState(['머신', '프리웨이트']); // 기본값
    const [excludedParts, setExcludedParts] = useState([]); // 특정 부위 제외
    const [includeCardio, setIncludeCardio] = useState(false); // 유산소 운동 포함 여부

    const [modalVisible, setModalVisible] = useState(false); // 모달 상태

    const prevStateRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {

            if (!memberId) {
                console.warn("⚠️ Warning: memberId is not available yet.");
                return;
            }
        

            try {
                const response = await getAutoAdaptSetting(memberId);

    
                if (response) {
                    setExerciseGoal(response.exerciseGoal || '근비대');
                    setExerciseSplit(response.exerciseSplit || 4);
                    setPriorityParts(response.priorityParts || '자동')
                    setExerciseStyle(response.exerciseStyle || ['머신', '프리웨이트']);
                    setExerciseTime(response.exerciseTime || '60분 이하');
                    setDifficulty(response.difficulty || '중급');
                    setExcludedParts(response.excludedParts || []);
                    setIncludeCardio(response.includeCardio || false);
    
                    // 🔥 상태가 모두 업데이트된 후 prevStateRef 저장
                    prevStateRef.current = {
                        difficulty: response.difficulty || '중급',
                        exerciseTime: response.exerciseTime || '60분 이하',
                        exerciseStyle: response.exerciseStyle || ['머신', '프리웨이트'],
                        excludedParts: response.excludedParts || [],
                        includeCardio: response.includeCardio || false
                    };
    
                }
            } catch (error) {

            }
        };
    
        fetchData();
    }, [memberId]); // ✅ memberId가 변경될 때만 실행 (최초 실행 포함)
    
    

    // 이전상태 저장
    useEffect(() => {
        if (!modalVisible) { // 🔥 모달이 닫힐 때만 실행
    
            prevStateRef.current = {
                difficulty,
                exerciseTime,
                exerciseStyle,
                excludedParts,
                includeCardio
            };
        }
    }, [modalVisible]); // ✅ 모달이 닫힐 때만 실행되도록 변경
    

    // 서버 요청 코드
    const sendUpdate = async (updatedValues) => {
        if (!memberId) return; // memberId가 없으면 요청 보내지 않음
    
        const updateData = {
            memberId,
            exerciseGoal,
            exerciseSplit,
            priorityParts,

            difficulty,
            exerciseTime,
            exerciseStyle,
            excludedParts,
            includeCardio,
            ...updatedValues // ✅ 변경된 값만 적용
        };
    
        try {
            await updateAutoAdaptSetting(updateData);
            

            setUpdateCount(prevCount => prevCount + 1); // ✅ 실행될 때마다 카운트 증가
        } catch (error) {
            console.error('자동적응 설정 업데이트 실패:', error);
        }
    };

    // 🔥 버튼 클릭 시 상태 변경 + 서버 업데이트 실행
    const handleGoalChange = (selectedGoal) => {
        setExerciseGoal(selectedGoal);
        sendUpdate({ exerciseGoal: selectedGoal });

    };

    const handleSplitChange = (selectedSplit) => {
        setExerciseSplit(selectedSplit);
        setPriorityParts(['자동']); // ✅ 분할 루틴 변경 시 자동 초기화
        sendUpdate({ exerciseSplit: selectedSplit, priorityParts: ['자동'] });
    };
    

    const handlePriorityChange = (part) => {
        if (priorityParts.length === 1 && priorityParts.includes('자동') && part === '자동') {
            return; // '자동'만 남아있을 경우 클릭 방지
        }
    
    
        setPriorityParts((prev) => {
            const maxSelectableParts = {
                1: 1, // 1분할 → 최대 1개
                2: 4, // 2분할 → 최대 4개
                3: 3, // 3분할 → 최대 3개
                4: 2, // 4분할 → 최대 2개
                5: 1  // 5분할 → 최대 1개
            }[exerciseSplit] || 4; // 기본값: 4
    
            // ✅ '자동'을 제외한 부위 목록
            const filteredPrev = prev.filter(p => p !== '자동');
            const isSelected = filteredPrev.includes(part);
            
            let newParts = isSelected
                ? filteredPrev.filter(p => p !== part) // ✅ 선택 해제 (단, '자동'은 유지)
                : [...filteredPrev, part]; // ✅ 새로운 부위 추가
    
            // ✅ 최대 개수 초과 시 알림 후 추가 선택 방지
            if (newParts.length > maxSelectableParts) {
                Alert.alert(
                    t('defaultSetting.selectionError'),
                    t('defaultSetting.maxSelectionMessage', { max: maxSelectableParts })
                );
                return prev; // 변경하지 않음
            }
    
            // ✅ '자동'은 항상 유지
            if (prev.includes('자동') && !newParts.includes('자동')) {
                newParts = ['자동', ...newParts]; // '자동'을 유지한 상태로 추가
            }
    
            sendUpdate({ priorityParts: newParts }); // 서버로 업데이트
            return newParts;
        });
    };
    
    
    

    // 이전값과 비교하기 위한 코드
    const areObjectsEqual = (obj1, obj2) => {
        if (obj1 === obj2) return true; // 같은 객체면 true
    
        if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
            return obj1 === obj2; // 기본 타입(숫자, 문자열 등) 비교
        }
    
        // 배열 비교
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            if (obj1.length !== obj2.length) return false;
            return obj1.every((value, index) => areObjectsEqual(value, obj2[index]));
        }
    
        // 키 개수 다른 경우 바로 false
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) return false;
    
        // 각 키의 값 비교 (재귀)
        return keys1.every(key => areObjectsEqual(obj1[key], obj2[key]));
    };
    

    // 모달을 닫았을때 이전값과 비교후 차이가 있을때만 서버 요청
    const closeModal = useCallback(() => {
        setModalVisible(false); // 모달 닫기


        const prevState = prevStateRef.current;
        const currentState = { difficulty, exerciseTime, exerciseStyle, excludedParts, includeCardio };
    
        if (prevState === null) {
            prevStateRef.current = currentState;
            return;
        }

        const hasChanged = !areObjectsEqual(prevState, currentState);
        
        const updateData = {
            memberId,
            exerciseGoal,
            exerciseSplit,
            priorityParts,

            difficulty,
            exerciseTime,
            exerciseStyle,
            excludedParts,
            includeCardio
        };
    

    
        if (hasChanged) {


            const sendUpdate = async () => {
                try {
                    await updateAutoAdaptSetting(updateData);
                    setUpdateCount(prevCount => prevCount + 1);
                } catch (error) {
                    console.error('자동적응 설정 업데이트 실패:', error);
                }
            };

            sendUpdate();

        } else {

        }

    }, [memberId, exerciseGoal, exerciseSplit, difficulty, exerciseTime, exerciseStyle, excludedParts, includeCardio]);

    const openModal = useCallback(() => {
        setModalVisible(true); // 모달 열기
    }, []);

    const showLoadingAlert = () => {
        Alert.alert(
            t('defaultSetting.updatingTitle'), 
            t('defaultSetting.updatingMessage')
        );
    };
    
    const [viewWidth, setViewWidth] = useState(null);

    const handleLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setViewWidth(width + 30); // 현재 부모 뷰의 너비에 30 추가
    };
    
    return (
        <View style={styles.todayExerciseObjective}>
            <View style={styles.buttonRow}>
                <Pressable 
                    style={[styles.goalButton, exerciseGoal === '근비대' && styles.selected]}
                    onPress={() => {
                        if (isLoading) {
                            showLoadingAlert();
                        } else {
                            handleGoalChange('근비대');
                        }
                    }}
                    disabled={isLoading}

                >
                    <Text style={styles.buttonText}>{t('defaultSetting.muscleGrowth')}</Text>
                </Pressable>
                <Pressable 
                    style={[styles.goalButton, exerciseGoal === '체지방 감소' && styles.selected]}
                    onPress={() => handleGoalChange('체지방 감소')}
                    disabled={isLoading}

                >
                    <Text style={styles.buttonText}>{t('defaultSetting.fatLoss')}</Text>
                </Pressable>
            </View>

            {/* 분할 선택 */}
            <Text style={styles.sectionTitle}>{t('defaultSetting.splitRoutine')}</Text>
            <View style={styles.splitRow}>
                {[1, 2, 3, 4, 5].map((num) => (
                    <Pressable 
                        key={num} 
                        style={[styles.splitButton, exerciseSplit === num && styles.selected]}
                        onPress={() => handleSplitChange(num)}
                        disabled={isLoading}

                    >
                        <Text style={styles.buttonText}>{num}{t('defaultSetting.split')}</Text>
                    </Pressable>
                ))}
            </View>

            {/* 부위 우선 선택 */}
            <Text style={styles.sectionTitle}>{t('defaultSetting.prioritySelection')}</Text>
            <View style={styles.priorityRow}>
                {['자동', '등', '가슴', '하체', '어깨', '팔'].map((part) => (
                    <Pressable 
                        key={part} 
                        style={[styles.partButton, Array.isArray(priorityParts) && priorityParts.includes(part) && styles.selected]} 
                        onPress={() => {
                            if (excludedParts.includes(part)) {
                                Alert.alert(
                                    t('defaultSetting.selectionError'),
                                    t('defaultSetting.exclusionMessage', { part: t(`bodyParts.${part}`) })
                                );

                                return; // 클릭 방지
                            }
                            handlePriorityChange(part);
                        }}
                        disabled={isLoading}

                    >
                        <Text style={styles.buttonText}>{t(`bodyParts.${part}`)}</Text>
                    </Pressable>
                ))}
            </View>

            
            {/* 상세 설정 버튼 (작고 심플한 스타일) */}
            <Pressable onPress={() => openModal()} style={styles.settingsContainer}>
                <Icon name="settings-outline" size={16} color="#AAB2C8" />

                <Text style={styles.detailText}>{t('defaultSetting.advancedSettings')}</Text>            
            </Pressable>

            {/* 모달 */}
            <AiSettingsModal 
                modalVisible={modalVisible} 
                setModalVisible={setModalVisible} 
                difficulty={difficulty}  // 올바르게 전달
                setDifficulty={setDifficulty}  // 올바르게 전달
                exerciseTime={exerciseTime}
                setExerciseTime={setExerciseTime}
                exerciseStyle={exerciseStyle}
                setExerciseStyle={setExerciseStyle}
                excludedParts={excludedParts}
                setExcludedParts={setExcludedParts}
                includeCardio={includeCardio}
                setIncludeCardio={setIncludeCardio}
                onClose={closeModal} 
                priorityParts={priorityParts}
            />

        </View>
    );
};

// 스타일 정의
const styles = StyleSheet.create({
    todayExerciseObjective: {
        width: '100%', 
        minHeight: 150, 
        padding: 15,
        backgroundColor: '#222732', 
        borderBottomLeftRadius: 10,  // 왼쪽 위 모서리 둥글게
        borderBottomRightRadius: 10, // 오른쪽 위 모서리 둥글게        
        marginBottom: 30,
        position: 'relative'
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    splitRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    priorityRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    goalButton: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#2A2F3C',
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    splitButton: {
        width: '15%',
        paddingVertical: 10,
        backgroundColor: '#2A2F3C',
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5,
    },
    partButton: {
        width: '30%',
        paddingVertical: 12,
        backgroundColor: '#2A2F3C',
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5,
    },
    selected: {
        backgroundColor: '#4682B4',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    detailButton: {
        backgroundColor: '#4682B4',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    settingsContainer: {
        flexDirection: 'row',  // 아이콘과 텍스트를 가로 정렬
        alignItems: 'center',  // 세로 중앙 정렬
        alignSelf: 'flex-end', // 오른쪽 정렬
        marginTop: 5,          // 약간의 여백 추가
    },
    detailText: {
        color: '#AAB2C8',  // 연한 회색 (강조하지 않음)
        fontSize: 13,       // 작은 글씨
        marginLeft: 4,      // 아이콘과의 간격 조정
    },

    alertText: {
        textAlign:'center',
        zIndex: 100

    },
});

export default DefaltSetting;