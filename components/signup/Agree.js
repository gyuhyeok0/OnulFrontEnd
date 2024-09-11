import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Dimensions, Animated } from 'react-native';
import CheckBox from '@react-native-community/checkbox';  // @react-native-community/checkbox에서 임포트
import CustomModal from '../../src/screens/modal/ServiceAgree';  // CustomModal 임포트

const screenHeight = Dimensions.get('window').height;

function Agree({ setIsAllAgreed }) {  // setIsAllAgreed를 props로 받음
    const [isAllAgreed, setLocalAllAgreed] = useState(false); // 로컬 상태
    const [isOver14Agreed, setIsOver14Agreed] = useState(false);
    const [isServiceAgreed, setIsServiceAgreed] = useState(false);
    const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalY] = useState(new Animated.Value(screenHeight)); 
    const [modalContent, setModalContent] = useState('');  

    useEffect(() => {
        if (isOver14Agreed && isServiceAgreed && isPrivacyAgreed) {
            setLocalAllAgreed(true);  // 모두 동의 체크
            setIsAllAgreed(true); // 상위 컴포넌트에 전달
        } else {
            setLocalAllAgreed(false);  // 모두 동의 해제
            setIsAllAgreed(false); // 상위 컴포넌트에 전달
        }
    }, [isOver14Agreed, isServiceAgreed, isPrivacyAgreed]);  // 개별 체크박스 상태가 변할 때마다 실행

    const handleAllAgree = () => {
        const newValue = !isAllAgreed;
        setLocalAllAgreed(newValue);
        setIsAllAgreed(newValue); // 상위 컴포넌트에 전달
        setIsOver14Agreed(newValue);
        setIsServiceAgreed(newValue);
        setIsPrivacyAgreed(newValue);
    };

    const handleIndividualAgree = (setter, value) => {
        setter(!value);
    };

    const handleViewTerms = (type) => {
        const content = type === 'service' ? '서비스 이용약관 내용' : '개인정보 처리방침 내용';
        setModalContent(content);  
        setModalVisible(true);
        Animated.timing(modalY, {
            toValue: screenHeight * 0.35,  
            duration: 500,  
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(modalY, {
            toValue: screenHeight,  
            duration: 500,
            useNativeDriver: true,
        }).start(() => setModalVisible(false));  
    };

    return (
        <View style={styles.termBox}>
            <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold', marginBottom: 5 }}>약관에 동의해 주세요</Text>

            {/* 모두 동의 */}
            <View style={styles.agreementBox}>
                <CheckBox
                    value={isAllAgreed}
                    onValueChange={handleAllAgree}
                    tintColors={{ true: '#5E56C3', false: '#ffffff' }}
                    style={{ 
                        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                        marginTop: 7 
                    }}
                />
                <Text style={styles.allAgreeText}>모두 동의</Text>
            </View>
            <Text style={{color: '#999999', fontSize: 11, marginLeft: 36}}> 서비스 이용을 위해 아래 약관에 모두 동의합니다</Text>

            {/* 만 14세 이상 동의 */}
            <View style={styles.agreementBox}>
                <CheckBox
                    value={isOver14Agreed}
                    onValueChange={() => handleIndividualAgree(setIsOver14Agreed, isOver14Agreed)}
                    tintColors={{ true: '#5E56C3', false: '#ffffff' }}
                    style={{ 
                        transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
                        marginTop: 7 
                    }}
                />
                <Text style={styles.agreementText}>만 14세 이상입니다.</Text>
            </View>

            {/* 서비스 이용약관 동의 */}
            <View style={styles.agreementBox}>
                <CheckBox
                    value={isServiceAgreed}
                    onValueChange={() => handleIndividualAgree(setIsServiceAgreed, isServiceAgreed)}
                    tintColors={{ true: '#5E56C3', false: '#ffffff' }}
                    style={{ 
                        transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
                        marginTop: 7 
                    }}
                />
                <Text style={styles.agreementText}>서비스 이용약관 동의</Text>
                <TouchableOpacity onPress={() => handleViewTerms('service')} style={{ marginLeft: 'auto' }}>
                    <Text style={styles.viewText}>보기</Text>
                </TouchableOpacity>
            </View>

            {/* 개인정보 처리방침 동의 */}
            <View style={styles.agreementBox}>
                <CheckBox
                    value={isPrivacyAgreed}
                    onValueChange={() => handleIndividualAgree(setIsPrivacyAgreed, isPrivacyAgreed)}
                    tintColors={{ true: '#5E56C3', false: '#ffffff' }}
                    style={{ 
                        transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
                        marginTop: 7 
                    }}
                />
                <Text style={styles.agreementText}>개인정보 처리방침 동의</Text>
                
                <TouchableOpacity onPress={() => handleViewTerms('privacy')} style={{ marginLeft: 'auto' }}>
                    <Text style={styles.viewText}>보기</Text>
                </TouchableOpacity>
            </View>

            {/* CustomModal 사용 */}
            <CustomModal
                isVisible={isModalVisible}
                onClose={closeModal}
                modalY={modalY}
                title="약관 내용"
                content={modalContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    termBox: {
        marginTop: 13,
        backgroundColor: '#3B404B',
        borderRadius: 8,
        padding: 15,
    },

    agreementBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    agreementText: {
        fontSize: 13,
        color: '#ffffff',
        marginLeft: 10,
    },

    allAgreeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        marginLeft: 10,
    },
    
    viewText: {
        marginLeft: 'auto',
        color: '#3D69A5',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default Agree;
