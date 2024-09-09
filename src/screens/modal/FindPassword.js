import React, { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, StyleSheet, Dimensions, View, Text, Animated, Easing } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenHeight = Dimensions.get('window').height;

const FindPassword = ({ isVisible, onClose }) => {
    const [modalY] = useState(new Animated.Value(screenHeight)); // 모달의 Y축 초기 위치
    const [overlayOpacity] = useState(new Animated.Value(0)); // 배경 투명도를 위한 초기값

    useEffect(() => {
        if (isVisible) {
            // 모달이 열릴 때 애니메이션을 실행
            modalY.setValue(screenHeight); // 모달 Y값을 초기 위치로 설정
            Animated.parallel([
                Animated.timing(modalY, {
                    toValue: 0, // 화면에 나타날 위치
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayOpacity, {
                    toValue: 1, // 배경을 완전히 어둡게
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isVisible]);

    const handleClose = () => {
        // 모달이 닫힐 때 애니메이션 실행
        Animated.parallel([
            Animated.timing(modalY, {
                toValue: screenHeight, // 화면 밖으로 나감
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: 0, // 배경 투명도를 원래 상태로
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => onClose());
    };

    return (
        <Modal
            transparent={true}
            visible={isVisible}
        >
            <Animated.View style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
                <Animated.View style={[styles.modalContent, { transform: [{ translateY: modalY }] }]}>
                    {/* 왼쪽 상단에 뒤로 가기 아이콘 */}
                    <View style={styles.titleContainer}>
                        <TouchableOpacity onPress={handleClose} style={styles.backIcon}>
                            <Ionicons 
                                name="chevron-back" 
                                size={32} 
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                        <Text style={styles.title}>아이디 / 비밀번호 찾기</Text>
                    </View>


                    {/* 모달 내용 */}
                    <View>

                    </View>
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
        height: screenHeight * 0.85, // 모달 높이를 절반으로 설정
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

export default FindPassword;
