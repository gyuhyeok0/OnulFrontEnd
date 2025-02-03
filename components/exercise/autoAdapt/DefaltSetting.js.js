import React, { useState, useEffect, useCallback } from 'react';
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
    const [priorityParts, setPriorityParts] = useState([]);  // 빈 배열로 초기화


    // 상태 설정 (모달 설정)
    const [difficulty, setDifficulty] = useState('중급'); // 기본값: 중급
    const [exerciseTime, setExerciseTime] = useState('60분 이하'); // 기본값
    const [exerciseStyle, setExerciseStyle] = useState(['머신', '프리웨이트']); // 기본값
    const [excludedParts, setExcludedParts] = useState([]); // 특정 부위 제외
    const [includeCardio, setIncludeCardio] = useState(false); // 유산소 운동 포함 여부

    const [modalVisible, setModalVisible] = useState(false); // 모달 상태

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(memberId);
                const response = await getAutoAdaptSetting(memberId);
                console.log(response);
    
                if (response) {
                    setExerciseGoal(response.exerciseGoal || '근비대');
                    setExerciseSplit(response.exerciseSplit || 4);
                    setExerciseStyle(response.exerciseStyle || ['머신', '프리웨이트']);
                    setExerciseTime(response.exerciseTime || '60분 이하');
                    setDifficulty(response.difficulty || '중급');
                    setExcludedParts(response.excludedParts || []);
                    setIncludeCardio(response.includeCardio || false);
                }
            } catch (error) {
                console.error("Error fetching exercise data:", error);
            }
        };
        fetchData();
    }, [memberId]);


    const sendUpdate = async (updatedValues) => {
        if (!memberId) return; // memberId가 없으면 요청 보내지 않음
    
        const updateData = {
            memberId,
            exerciseGoal,
            exerciseSplit,
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

    // 부위 우선 선택 핸들러 (토글 방식)
    const handlePriorityChange = (part) => {
        setPriorityParts((prev) =>
            prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
        );
        setUpdateCount(prevCount => prevCount + 1); 
    };


    const closeModal = useCallback(() => {
        setModalVisible(false); // 모달 닫기
        console.log(difficulty);
        const updateData = {
            memberId,
            exerciseGoal,
            exerciseSplit,
            difficulty,
            exerciseTime,
            exerciseStyle,
            excludedParts,
            includeCardio
        };
    
        const sendUpdate = async () => {
            try {
                await updateAutoAdaptSetting(updateData);
                setUpdateCount(prevCount => prevCount + 1); // ✅ 실행될 때마다 카운트 증가
                console.log('자동적응 설정이 서버에 업데이트됨:', updateData);
            } catch (error) {
                console.error('자동적응 설정 업데이트 실패:', error);
            }
        };
    
        sendUpdate();
    }, [memberId, exerciseGoal, exerciseSplit, difficulty, exerciseTime, exerciseStyle, excludedParts, includeCardio]);

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
                {['등', '가슴', '하체', '어깨', '팔', '복근'].map((part) => (
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
            <Pressable onPress={() => setModalVisible(true)} style={styles.settingsContainer}>
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
