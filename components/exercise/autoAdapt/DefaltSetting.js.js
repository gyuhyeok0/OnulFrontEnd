import React, { useState, useEffect, useCallback, useRef} from 'react';
import { View, StyleSheet, Text, Pressable, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AiSettingsModal from './AiSettingsModal'; // 모달 컴포넌트 추가
import Icon from 'react-native-vector-icons/Ionicons'
import { getAutoAdaptSetting, updateAutoAdaptSetting } from '../../../src/apis/AutoAdapt';

// 운동 메뉴의 자동적응 코드
const DefaltSetting = ({setUpdateCount}) => {
    const dispatch = useDispatch();

    const memberId = useSelector((state) => state.member?.userInfo?.memberId);

    // 상태 설정 (수정된 상태들)
    const [exerciseGoal, setExerciseGoal] = useState('근비대'); // 기본값: 근비대
    const [exerciseSplit, setExerciseSplit] = useState(4); // 기본값: 4분할
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
            

            console.log("실행함ㅎㅁ마")
            setUpdateCount(prevCount => prevCount + 1); // ✅ 실행될 때마다 카운트 증가
            console.log('자동적응 설정이 서버에 업데이트됨:', updateData);
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
        sendUpdate({ exerciseSplit: selectedSplit });

    };

    const handlePriorityChange = (part) => {
        if (priorityParts.length === 1 && priorityParts.includes('자동') && part === '자동') {
            return; // '자동'만 남아있을 경우 클릭 방지
        }
        
        console.log("✅ 부위 우선 선택 업데이트:", part);
        
        setPriorityParts((prev) => {
            const newParts = prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part];
    
            if (newParts.length === 0) {
                console.log("⚠️ 모든 부위가 해제됨 → '자동'으로 설정");
                sendUpdate({ priorityParts: ['자동'] }); // 서버로 즉시 업데이트
                return ['자동'];
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
            console.log("🔹 초기 상태 저장 중... 비교하지 않음");
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
                    console.log('자동적응 설정이 서버에 업데이트됨:', updateData);
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


    return (
        <View style={styles.todayExerciseObjective}>
            {/* 운동 목표 선택 */}
            <View style={styles.buttonRow}>
                <Pressable 
                    style={[styles.goalButton, exerciseGoal === '근비대' && styles.selected]}
                    onPress={() => handleGoalChange('근비대')}
                >
                    <Text style={styles.buttonText}>근비대</Text>
                </Pressable>
                <Pressable 
                    style={[styles.goalButton, exerciseGoal === '체지방 감소' && styles.selected]}
                    onPress={() => handleGoalChange('체지방 감소')}
                >
                    <Text style={styles.buttonText}>체지방 감소</Text>
                </Pressable>
            </View>

            {/* 분할 선택 */}
            <Text style={styles.sectionTitle}>분할 루틴 선택</Text>
            <View style={styles.splitRow}>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <Pressable 
                        key={num} 
                        style={[styles.splitButton, exerciseSplit === num && styles.selected]}
                        onPress={() => handleSplitChange(num)}
                    >
                        <Text style={styles.buttonText}>{num}분할</Text>
                    </Pressable>
                ))}
            </View>

            {/* 부위 우선 선택 */}
            <Text style={styles.sectionTitle}>부위 우선 선택</Text>
            <View style={styles.priorityRow}>
                {['자동', '등', '가슴', '하체', '어깨', '팔'].map((part) => (
                    <Pressable 
                        key={part} 
                        style={[styles.partButton, Array.isArray(priorityParts) && priorityParts.includes(part) && styles.selected]} 
                        onPress={() => handlePriorityChange(part)}
                    >
                        <Text style={styles.buttonText}>{part}</Text>
                    </Pressable>
                ))}
            </View>

            
            {/* 상세 설정 버튼 (작고 심플한 스타일) */}
            <Pressable onPress={() => openModal()} style={styles.settingsContainer}>
                <Icon name="settings-outline" size={16} color="#AAB2C8" />
                <Text style={styles.detailText}>상세 설정</Text>
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
});

export default DefaltSetting;
