import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Dimensions, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import DefaultHeader from '../common/DefaultHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import { API_URL_JP, API_URL_US } from '@env';

const Inquiry = ({ navigation }) => {
    const [memberId, setMemberId] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { t } = useTranslation();
    

    const locales = RNLocalize.getLocales();
    const userLocale = locales.length > 0 ? locales[0].languageTag : "en-US";
    
    const isAsiaPacific = ["JP", "KR", "HK", "NZ", "AU"].some(region =>
        userLocale.toUpperCase().includes(region)
    );
    const userRegion = isAsiaPacific ? "JP" : "US";
    const API_URL = userRegion === "JP" ? API_URL_JP : API_URL_US;
    


    const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!email || !title || !content) {
            Alert.alert(t('inquiry.error'), t('inquiry.error_fill_required_fields'));
            return;
        }
    
        if (!emailRegex.test(email)) {
            Alert.alert(t('inquiry.error'), t('inquiry.error_invalid_email'));
            return;
        }
    
        if (title.length > 50) {
            Alert.alert(t('inquiry.error'), t('inquiry.error_title_limit'));
            return;
        }
    
        if (content.length > 500) {
            Alert.alert(t('inquiry.error'), t('inquiry.error_content_limit'));
            return;
        }
    
    
        // 서버로 데이터를 전송하는 로직
        try {
            const response = await fetch(`${API_URL}/inquiry/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    memberId: memberId || null,  // 서버에서 이 값이 필요할 경우
                    email: email,
                    title: title,
                    content: content,
                }),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                if (result.state === "SUCCESS") {
                    Alert.alert(t('inquiry.success'), t('inquiry.inquiry_success'));
                } else if (result.state === "INVALID_EMAIL") {
                    Alert.alert(t('inquiry.error'), t('inquiry.error_invalid_email'));
                } else if (result.state === "INVALID_INPUT") {
                    Alert.alert(t('inquiry.error'), t('inquiry.error_fill_required_fields'));
                }
            } else {
                Alert.alert(t('inquiry.error'), t('inquiry.error_inquiry_failed'));
            }
        } catch (error) {
            console.error(t('inquiry.error_inquiry_submission'), error);
            Alert.alert(t('inquiry.error'), t('inquiry.error_inquiry_submission'));
        }
    };
    
    
    
    
    return (
        <>
            <DefaultHeader title={t('inquiry.title_page')} navigation={navigation} />
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    extraScrollHeight={20}
                    enableOnAndroid={true}
                >
                    <View style={styles.form}>
                        <Text style={styles.label}>{t('inquiry.id')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t('inquiry.placeholder_id')}
                            placeholderTextColor="#666666"
                            value={memberId}
                            onChangeText={setMemberId}
                        />

                        <Text style={styles.label}>{t('inquiry.email')} *</Text>
                        <Text style={{color:'#999999', marginBottom: 5}}>{t('inquiry.email_description')}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t('inquiry.placeholder_email')}
                            placeholderTextColor="#666666"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <Text style={styles.label}>{t('inquiry.title')} *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder={t('inquiry.placeholder_title')}
                            placeholderTextColor="#666666"
                            value={title}
                            onChangeText={setTitle}
                        />

                        <Text style={styles.label}>{t('inquiry.content')} *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder={t('inquiry.placeholder_content')}
                            placeholderTextColor="#666666"
                            value={content}
                            onChangeText={setContent}
                            multiline
                            numberOfLines={4}
                        />

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>{t('inquiry.submit')}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#191D22',
        alignItems: 'center',
    },
    form: {
        width: width * 0.9,
        padding: 20,
    },
    label: {
        color: '#ffffff',
        fontSize: 16,
        marginBottom: 9,
    },
    input: {
        height: 40,
        borderColor: '#3B404B',
        borderRadius: 8,
        backgroundColor: '#222732',
        paddingHorizontal: 10,
        color: '#fff',
        fontSize: 17,
        marginBottom: 15,
    },
    textArea: {
        height: height * 0.25,  // 화면 높이의 25%로 설정
        textAlignVertical: 'top',
        backgroundColor: '#222732',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 10,
        color: '#fff',
        fontSize: 17,
    },
    submitButton: {
        backgroundColor: '#5E56C3',  // 버튼 배경색
        padding: 15,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#ffffff',  // 버튼 텍스트 색상
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Inquiry;
