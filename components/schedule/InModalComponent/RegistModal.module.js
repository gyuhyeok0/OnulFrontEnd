import { StyleSheet, Dimensions } from 'react-native';


const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    searchContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchIcon: {
        position: 'absolute',
        left: 10,
        zIndex: 1,
    },
    searchInput: {
        height: 40,
        borderRadius: 5,
        paddingHorizontal: 30,
        paddingLeft: 40,
        backgroundColor: '#222732',
        color: '#fff',
        flex: 1,
    },
    category: {
        flexDirection: 'row',
        height: 75,
    },
    categoryButton: {
        marginRight: 10,
        padding: 8,
        height: 33,
        borderRadius: 5,
    },
    categoryButtonText: {
        color: '#B5B5B5',
        fontWeight: 'bold',
        fontSize: 16,
    },
    contentScroll: {
        marginTop: 10,
    },
    contentContainer: {
        flex: 1,
        height: 1000,
    },
    myExercise: {
        position: 'relative',
        backgroundColor: '#222732',
        borderRadius: 10,
        marginBottom: 0,
    },
    myExerciseButton: {
        position: 'absolute',
        top: -49,
        flexDirection: 'row',
        justifyContent: 'space-between', // 버튼들을 양쪽으로 맞추기
        width: '100%', // 버튼들이 부모의 너비에 맞도록 설정
    },

    toggleButton: {
        backgroundColor: '#4A7BF6',
        width: 55,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    icon: {
        marginVertical: 1,
    },

    toggleRegist: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4A7BF6',
        width: 150,
        height: 40,
        marginLeft: 10,
        borderRadius: 10,
    },

    toggleReset: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#4A7BF6',
        width: 100,
        height: 40,
        marginLeft: 10,
        borderRadius: 10,
    },

    toggleText:{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },


    myExerciseContainer: {
        height: 200,
    },
    completeButton: {
        position: 'absolute',
        bottom: 0,
        left: '53%', // 수평 중앙으로 위치
        transform: [{ translateX: -105 }], // 중앙 정렬을 위한 이동
        backgroundColor: '#5E56C3',
        paddingVertical: 10,
        width: 190,
        borderRadius: 30,
        marginBottom: 5,
    },
    completeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    myMainExercise: {
        height: height * 0.35,
        backgroundColor: 'blue',
    },
});