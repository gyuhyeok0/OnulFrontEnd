import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({

    container: {
        marginTop: 25,
        flex: 1,
        padding: 10,
        backgroundColor: '#191D22',
    },

    idInput: {
        borderWidth: 1.5,
        borderColor: '#3B404B',
        borderRadius: 8,
        width: '100%',
        height: 50,
        color: 'white', // 텍스트 컬러 흰색
        fontSize: 18, // 폰트 크기 증가
        paddingHorizontal: 10, // 좌우 패딩 추가
    },
    
    completeButton: {
        backgroundColor: '#5E56C3', // 버튼 배경색
        borderRadius: 8,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10, // 위쪽 여백 추가
    },
    
    completeButtonText: {
        color: 'white', // 텍스트 컬러 흰색
        fontSize: 18, // 폰트 크기 증가
        fontWeight: 'bold', // 폰트 두껍게
        textAlign: 'center',
        textAlignVertical: 'center',
    },

    phoneNumberTitle: {
        marginTop: 5,
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    description: {
        marginTop: 13,
        fontSize: 12,
        color: '#999999',
    },
    note: {
        marginTop: 5,
        fontSize: 12,
        color: '#999999',
    },
    requestBox: {
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
    },
    requestButton: {
        borderWidth: 1.5,
        borderColor: '#3B404B',
        borderRadius: 8,
        width: '34%',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '2%',
    },
    
    requestButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
    },

    verificationInput: {
        backgroundColor: '#3B404B',
        width: '64%',
        color: 'white',
        height: 55,
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        borderWidth: 1.5,
        borderColor: '#3B404B',
        textAlign: 'left',
    },

    timerText: {
        position: 'relative',
        fontSize: 16,
    },

    // 추가된 스타일들
    passwordInput: {
        backgroundColor: '#3B404B',
        color: 'white',
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        marginTop: 10,
    },

    errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: 12,
        marginLeft: 5,
    },
});

export default styles;
