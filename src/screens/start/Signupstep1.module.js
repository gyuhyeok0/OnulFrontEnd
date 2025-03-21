import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#191D22',
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
        height: 63,
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
        height: 63,
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        borderWidth: 1.5,
        borderColor: '#3B404B',
        textAlign: 'left',
    },


    // 완료 버튼 스타일
    completeButton: {
        backgroundColor: '#5E56C3', // 버튼 색상
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center', // 텍스트 가운데 정렬
        marginVertical: 20,
    },
    completeButtonText: {
        color: '#FFF', // 텍스트 흰색
        fontSize: 18,
        fontWeight: 'bold',
    },
    // 체크박스 스타일
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1.5,
        borderColor: '#5E56C3',
        borderRadius: 4,
        backgroundColor: '#191D22', // 배경색
    },

    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // 가장 위에 표시
    }


});

export default styles;
