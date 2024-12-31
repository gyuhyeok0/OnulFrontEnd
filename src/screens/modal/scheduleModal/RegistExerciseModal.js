import React, { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, StyleSheet, Dimensions, View, Text, Animated, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import RegistChest from '../../../../components/schedule/InModalComponent/RegistChest';
import RegistBack from '../../../../components/schedule/InModalComponent/RegistBack';
import RegistAbs from '../../../../components/schedule/InModalComponent/RegistAbs';
import RegistEtc from '../../../../components/schedule/InModalComponent/RegistEtc';
import RegistArms from '../../../../components/schedule/InModalComponent/RegistArms';
import RegistCustom from '../../../../components/schedule/InModalComponent/RegistCustom';
import RegistLowerBody from '../../../../components/schedule/InModalComponent/RegistLowerBody';
import RegistShoulders from '../../../../components/schedule/InModalComponent/RegistShoulders';
import RegistFree from '../../../../components/schedule/InModalComponent/RegistFree';

const screenHeight = Dimensions.get('window').height;

const RegistExerciseModal = ({ isVisible, onClose, exercise, onSelectExercise }) => {
    const [modalY] = useState(new Animated.Value(screenHeight));
    const [overlayOpacity] = useState(new Animated.Value(0));
    const [isExerciseSelected, setIsExerciseSelected] = useState(false);  // 운동 선택 여부

    useEffect(() => {
        if (isVisible) {
            modalY.setValue(screenHeight);
            Animated.parallel([
                Animated.timing(modalY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isVisible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(modalY, {
                toValue: screenHeight,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose(isExerciseSelected);  // 운동 선택 여부를 전달
        });
    };

    const handleSelectExercise = () => {
        setIsExerciseSelected(true);  // 운동이 선택되면 true로 설정
        onSelectExercise(exercise);   // 선택된 운동을 상위로 전달
        handleClose();  // 모달 닫기
    };

    const renderExerciseComponent = () => {
        switch (exercise) {
            case '가슴':
                return <RegistChest onSelectExercise={handleSelectExercise} />;
            case '등':
                return <RegistBack onSelectExercise={handleSelectExercise} />;
            case '복근':
                return <RegistAbs onSelectExercise={handleSelectExercise} />;
            case '기타':
                return <RegistEtc onSelectExercise={handleSelectExercise} />;
            case '팔':
                return <RegistArms onSelectExercise={handleSelectExercise} />;
            case '하체':
                return <RegistLowerBody onSelectExercise={handleSelectExercise} />;
            case '어깨':
                return <RegistShoulders onSelectExercise={handleSelectExercise} />;
            case '커스텀':
                return <RegistCustom onSelectExercise={handleSelectExercise} />;
            case '자유':
                return <RegistFree onSelectExercise={handleSelectExercise} />;
            default:
                return null;
        }
    };

    return (
        <Modal
            transparent={true}
            visible={isVisible}
        >
            <Animated.View style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
                <Animated.View style={[styles.modalContent, { transform: [{ translateY: modalY }] }]}>
                    <SafeAreaView style={styles.safeArea}>
                        <View style={styles.titleContainer}>
                            <TouchableOpacity onPress={handleClose} style={styles.backIcon}>
                                <Ionicons 
                                    name="chevron-back" 
                                    size={32} 
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                            <Text style={styles.title}>{exercise} 운동 등록</Text>
                        </View>

                        {renderExerciseComponent()}
                    </SafeAreaView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end', // 모달이 아래에서 위로 올라오도록 설정
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 모달 뒷배경의 어두운 영역 (투명도는 Animated로 제어)
    },

    modalContent: {
        width: '100%',
        height: screenHeight * 1, // 모달 높이를 절반으로 설정
        backgroundColor: '#191D22',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },

    safeArea: {
        flex: 1,  // SafeAreaView가 모달 안에 맞게 확장됨
    },

    titleContainer: {
        flexDirection: 'row',
        height: 35,
        alignItems: 'center'
    },

    icon: {
        color: '#fff',
        marginRight: 8
    },

    title:{
        color: 'white',
        fontSize: 20
    }
});

export default RegistExerciseModal;
