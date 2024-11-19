import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Dimensions, StyleSheet, Text, Alert, ScrollView } from 'react-native';
import DefaultHeader from '../common/DefaultHeader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const Inquiry = ({ navigation }) => {
    const [memberId, setMemberId] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        console.log("=====================문의 페이지 ========================");
    }, []);

    const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!email || !title || !content) {
            Alert.alert('오류', '모든 필수 필드를 입력해 주세요.');
            return;
        }
    
        if (!emailRegex.test(email)) {
            Alert.alert('오류', '올바른 이메일 형식을 입력해 주세요.');
            return;
        }
    
        if (title.length > 50) {
            Alert.alert('오류', '제목은 50자 이하로 입력해 주세요.');
            return;
        }
    
        if (content.length > 500) {
            Alert.alert('오류', '문의 내용은 500자 이하로 입력해 주세요.');
            return;
        }
    
        // 서버로 데이터를 전송하는 로직
        try {
            const response = await fetch('http://localhost:8080/inquiry/submit', {
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
                // 상태 처리
                if (result.state === "SUCCESS") {
                    Alert.alert('성공', '문의가 성공적으로 제출되었습니다.');
                } else if (result.state === "INVALID_EMAIL") {
                    Alert.alert('오류', '유효하지 않은 이메일 형식입니다.');
                } else if (result.state === "INVALID_INPUT") {
                    Alert.alert('오류', '필수 항목을 모두 입력해 주세요.');
                }
            } else {
                Alert.alert('오류', '문의 제출에 실패했습니다.');
            }
        } catch (error) {
            console.error('문의 제출 에러:', error);
            Alert.alert('오류', '문의 제출 중 문제가 발생했습니다.');
        }
    };
    
    
    
    
    return (
        <>
            <DefaultHeader title="문의하기" navigation={navigation} />

            <View style={styles.container}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                extraScrollHeight={20} // 키보드 위 여백
                enableOnAndroid={true} // Android에서도 작동하도록 설정
            >

                    <View style={styles.form}>
                        {/* 아이디 */}
                        <Text style={styles.label}>아이디</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="아이디 입력"
                            placeholderTextColor="#666666"  // placeholder 색상 변경
                            value={memberId}
                            onChangeText={setMemberId}
                        />

                        {/* 이메일 (필수) */}
                        <Text style={styles.label}>이메일 *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="이메일 입력"
                            placeholderTextColor="#666666"  // placeholder 색상 변경
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                            required
                        />

                        {/* 제목 (필수) */}
                        <Text style={styles.label}>제목 *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="제목 입력"
                            placeholderTextColor="#666666"  // placeholder 색상 변경
                            value={title}
                            onChangeText={setTitle}
                            required
                        />

                        {/* 문의내용 (필수) */}
                        <Text style={styles.label}>문의내용 *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="문의내용 입력"
                            placeholderTextColor="#666666"  // placeholder 색상 변경
                            value={content}
                            onChangeText={setContent}
                            multiline
                            numberOfLines={4}
                            required
                        />

                        {/* 제출 버튼 */}
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>제출</Text>
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
