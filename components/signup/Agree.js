import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import CustomModal from '../../src/screens/modal/ServiceAgree';
import { useTranslation } from 'react-i18next';


const screenHeight = Dimensions.get('window').height;

function Agree({ setIsAllAgreed }) {
    const [isAllAgreed, setLocalAllAgreed] = useState(false);
    const [isOver14Agreed, setIsOver14Agreed] = useState(false);
    const [isServiceAgreed, setIsServiceAgreed] = useState(false);
    const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(''); 
    const [modalY] = useState(new Animated.Value(screenHeight));
    const { t } = useTranslation();

    useEffect(() => {
        if (isOver14Agreed && isServiceAgreed && isPrivacyAgreed) {
            setLocalAllAgreed(true);
            setIsAllAgreed(true);
        } else {
            setLocalAllAgreed(false);
            setIsAllAgreed(false);
        }
    }, [isOver14Agreed, isServiceAgreed, isPrivacyAgreed]);

    const handleAllAgree = () => {
        const newValue = !isAllAgreed;
        setLocalAllAgreed(newValue);
        setIsAllAgreed(newValue);
        setIsOver14Agreed(newValue);
        setIsServiceAgreed(newValue);
        setIsPrivacyAgreed(newValue);
    };

    const handleIndividualAgree = (setter, value) => {
        setter(!value);
    };

    const handleViewTerms = (type) => {
        setModalType(type); 
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
            <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold', marginBottom: 5 }}>
                {t("agree.title")}
            </Text>

            <View style={styles.agreementBox}>
                <CheckBox
                    value={isAllAgreed}
                    onValueChange={handleAllAgree}
                    tintColors={{ true: '#5E56C3', false: '#ffffff' }}
                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], marginTop: 7 }}
                />
                <Text style={styles.allAgreeText}>{t("agree.allAgree")}</Text>
            </View>
            <Text style={{ color: '#999999', fontSize: 11, marginLeft: 36 }}>
                {t("agree.allAgreeNote")}
            </Text>

            <View style={styles.agreementBox}>
                <CheckBox
                    value={isOver14Agreed}
                    onValueChange={() => handleIndividualAgree(setIsOver14Agreed, isOver14Agreed)}
                    tintColors={{ true: '#5E56C3', false: '#ffffff' }}
                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }], marginTop: 7 }}
                />
                <Text style={styles.agreementText}>{t("agree.age")}</Text>
            </View>

            <View style={styles.agreementBox}>
                <CheckBox
                    value={isServiceAgreed}
                    onValueChange={() => handleIndividualAgree(setIsServiceAgreed, isServiceAgreed)}
                    tintColors={{ true: '#5E56C3', false: '#ffffff' }}
                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }], marginTop: 7 }}
                />
                <Text style={styles.agreementText}>{t("agree.service")}</Text>
                <TouchableOpacity onPress={() => handleViewTerms('service')} style={{ marginLeft: 'auto' }}>
                    <Text style={styles.viewText}>{t("agree.view")}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.agreementBox}>
                <CheckBox
                    value={isPrivacyAgreed}
                    onValueChange={() => handleIndividualAgree(setIsPrivacyAgreed, isPrivacyAgreed)}
                    tintColors={{ true: '#5E56C3', false: '#ffffff' }}
                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }], marginTop: 7 }}
                />
                <Text style={styles.agreementText}>{t("agree.privacy")}</Text>
                <TouchableOpacity onPress={() => handleViewTerms('privacy')} style={{ marginLeft: 'auto' }}>
                    <Text style={styles.viewText}>{t("agree.view")}</Text>
                </TouchableOpacity>
            </View>

            <CustomModal
                isVisible={isModalVisible}
                onClose={closeModal}
                modalY={modalY}
                title={t("agree.termsTitle")}
                type={modalType}  
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
        fontSize: 15,
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
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export default Agree;
