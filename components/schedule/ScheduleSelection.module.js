import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    registration: {
        margin: 15,
        padding: 10,
        marginBottom: 20,
        borderRadius: 15,
        minHeight: 60,
        backgroundColor: '#505E78',
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        marginTop: 10,
        fontSize: 13,
        color: '#fff',
        marginBottom: 12,
        fontWeight: 'bold'
    },

    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // 여러 줄로 버튼을 정렬
        maxWidth: 310,
        justifyContent:'center',

    },

    button: {
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom:5,
        margin: 3,
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: '#fff',
    },

    selectedButton: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },

    selectedButtonText: {
        color: '#000',
    },

    completeButton: {
        margin: 8,
        marginTop: 13,

        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 20,
        paddingRight: 20,

        backgroundColor: '#183B95',
        borderRadius: 20,
    },

    completeButtonText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
    },

    detailedType: {
        width: 290,
    },


    dayBox: {
        width: 40, // 요일 박스 크기
        height: 40,
        justifyContent: 'center', // 세로 중앙 정렬
        alignItems: 'center', // 가로 중앙 정렬
        margin: 5, // 박스 사이의 간격
        backgroundColor: '#7AACE0', // 기본 배경 색상
        borderRadius: 8, // 박스의 모서리 둥글기
    },

    selectedBox: {
        backgroundColor: '#FFD700', // 선택된 박스 색상
    },

    animatedBox: {
        flex: 1, // Animated.View의 크기를 채움
        justifyContent: 'center',
        alignItems: 'center',
    },

    todayBox: {
        borderWidth: 2, // 오늘 날짜 박스의 강조
        borderColor: '#FF6347', // 강조 색상
    },

    dayText: {
        fontSize: 12,
        color: '#fff',
    },

    saturdayText: {
        color: '#1E90FF',
    },

    sundayText: {
        color: '#FF4500',
    },


    detailTitle: {
        textAlign:'center',
        marginTop: 15,
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
    },

    detailExerciseList: {
        marginTop: 12,
        width: 290,
        minHeight: 25,
    },


    exerciseButton: {
        backgroundColor: '#394452', // 어두운 배경색
        minHeight: 30,
        marginBottom: 4,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 10, // 모서리 둥글게
        borderWidth: 2,
        borderColor: '#4a90e2', // 파란색 테두리
        // alignItems: 'center', // 텍스트 중앙 정렬
    },

    exerciseButtonText: {
        color: '#ffffff', // 흰색 텍스트
        fontSize: 13, // 텍스트 크기
        fontWeight: 'bold',
        textAlign:'center'
    },

    noExerciseText: {
        color: '#ffffff',
        fontSize: 13,
        textAlign: 'center',
    },

    
});
