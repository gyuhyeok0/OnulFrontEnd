import React, { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, StyleSheet, Dimensions, Animated, View, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
import * as RNLocalize from 'react-native-localize';

import { API_URL_JP, API_URL_US } from '@env';

const screenHeight = Dimensions.get('window').height;

const CustomModal = ({ isVisible, onClose, modalY, title }) => {
    const [loading, setLoading] = useState(true);
    const [htmlUri, setHtmlUri] = useState(`${API_URL}/privacy-policy.html`);

    const locales = RNLocalize.getLocales();
    const userLocale = locales.length > 0 ? locales[0].languageTag : "en-US"; // 예: "ja-JP", "ko-KR", "en-US"

    // 🇯🇵 일본이거나 🇰🇷 한국이면 일본 서버 사용, 그 외에는 미국 서버 사용
    const userRegion = userLocale.includes("JP") || userLocale.includes("KR") ? "JP" : "US";
    const API_URL = userRegion === "JP" ? API_URL_JP : API_URL_US;


    useEffect(() => {
        if (isVisible) {
            setLoading(true);
            setHtmlUri(`${API_URL}/privacy-policy.html`);
        }
    }, [isVisible]);

    return (
        <Modal
            transparent={true}
            visible={isVisible}
            animationType="none"
        >
            <Animated.View style={[styles.modalContent, { transform: [{ translateY: modalY }] }]}>
                
                {/* 왼쪽 상단에 뒤로 가기 아이콘 */}
                <TouchableOpacity onPress={onClose} style={styles.backIcon}>
                    <Ionicons 
                        name="chevron-back" 
                        size={32} 
                        style={styles.icon}
                    />
                </TouchableOpacity>

                {/* WebView로 HTML 파일 로드 */}
                <View style={{ flex: 1 }}>
                    {loading && (
                        <ActivityIndicator size="large" color="#5E56C3" style={{ marginTop: 20 }} />
                    )}
                    <WebView
                        source={{ uri: htmlUri }}
                        onLoadEnd={() => setLoading(false)}
                        style={{ flex: 0.7 }}
                        scrollEnabled={true}  // 스크롤 활성화
                    />
                </View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: screenHeight * 1.2,  // 모달의 높이를 조정
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,  // Android용 그림자
    },

    backIcon: {
        position: 'absolute',
        top: 17,
        left: 15,
        zIndex: 1,
    },

    icon: {
        color: '#333',
    },
});

export default CustomModal;
