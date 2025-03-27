// NoticeModal.js
import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native'; // React Native 모달 사용
import { useTranslation } from 'react-i18next'; // 언어 관리

const NoticeModal = ({ noticeData, closeModal }) => {
    const { i18n } = useTranslation(); // 현재 언어 확인
    const language = i18n.language.toLowerCase(); // 소문자 언어 코드
    const titleKey = `title${language.charAt(0).toUpperCase() + language.slice(1)}`;
    const contentKey = `content${language.charAt(0).toUpperCase() + language.slice(1)}`;

    return (
        <Modal
            visible={true}
            animationType="fade"
            onRequestClose={closeModal}
            transparent={true}
        >
            <View style={styles.modalBackground}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        {noticeData[titleKey]} {/* 제목 출력 */}
                    </Text>
                    <Text style={styles.content}>
                        {noticeData[contentKey]} {/* 내용 출력 */}
                    </Text>
                    <Button title="닫기" onPress={closeModal} /> 
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-start', // Top-aligned modal
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background for modal
        paddingTop: 50, // Adjust for spacing from the top
    },
    container: {
        width: '80%', // Reduced width for a more compact modal
        maxHeight: '40%', // Limit the height of the modal
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5, // Shadow for a floating effect
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center', // Center-align title
    },
    content: {
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center', // Center-align content
    },
});

export default NoticeModal;
