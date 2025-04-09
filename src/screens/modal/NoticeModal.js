// NoticeModal.js
import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native'; // React Native 모달 사용
import { useTranslation } from 'react-i18next'; // 언어 관리

const NoticeModal = ({ noticeData, closeModal }) => {
    const { t, i18n } = useTranslation(); 
    const rawLang = i18n.language.toLowerCase();

    let lang = "En";
    if (rawLang.includes("ko")) lang = "Ko";
    else if (rawLang.includes("ja")) lang = "Ja";
    else if (rawLang.includes("es")) lang = "Es";

    const titleKey = `title${lang}`;
    const contentKey = `content${lang}`;

    // 🔥 여기서 키가 없을 경우 fallback
    const title = noticeData?.[titleKey] || noticeData?.titleEn;
    const content = noticeData?.[contentKey] || noticeData?.contentEn;

    if (!noticeData || !title || !content) {
        console.log("⛔️ 공지 데이터 없음 또는 키 매칭 실패");
        return null;
    }

    return (
        <Modal
            visible={true}
            animationType="fade"
            onRequestClose={closeModal}
            transparent={true}
        >
            <View style={styles.modalBackground}>
                <View style={styles.container}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.content}>{content}</Text>
                    <Button title={t('notice.closeButton')} onPress={closeModal} /> 
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
