import { StyleSheet } from 'react-native';

const FooterStyles = StyleSheet.create({

    footer: {
        height: 70,  // 푸터의 높이 설정
        backgroundColor: '#1A1C22',  // 푸터 배경색
        flexDirection: 'row',  // 버튼을 가로로 정렬
        justifyContent: 'space-around',  // 버튼 간 간격 조정
        alignItems: 'center',  // 수직 정렬
        borderTopWidth: 1,  // 보더 탑 1px
        borderBottomWidth: 1,  // 보더 탑 1px

        borderTopColor: '#FFFFFF',  // 보더 탑 색상을 흰색으로 설정
        borderBottomColor: '#FFFFFF',  // 보더 탑 색상을 흰색으로 설정

    },
    
    safeArea: {
        backgroundColor: '#1A1C22',  // SafeAreaView 배경색 설정
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
