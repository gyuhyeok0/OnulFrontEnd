import { StyleSheet } from 'react-native';

const FooterStyles = StyleSheet.create({
    footer: {
        height: 60,  // 푸터의 높이 설정
        backgroundColor: '#000',  // 푸터 배경색
        flexDirection: 'row',  // 버튼을 가로로 정렬
        justifyContent: 'space-around',  // 버튼 간 간격 조정
        alignItems: 'center',  // 수직 정렬
    },
    safeArea: {
        backgroundColor: '#000',  // SafeAreaView 배경색 설정
    },
    button: {
        padding: 10,  // 버튼 패딩 설정
        backgroundColor: '#333',  // 버튼 배경색 설정
        borderRadius: 5,  // 버튼 모서리 둥글게 처리
    },
    buttonText: {
        color: '#fff',  // 버튼 텍스트 색상 설정
        fontSize: 16,  // 텍스트 크기 설정
    },
});

export default FooterStyles;
