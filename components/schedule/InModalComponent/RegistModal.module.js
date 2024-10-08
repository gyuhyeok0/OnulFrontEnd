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
        height: 88
        // backgroundColor:'red'
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
        width: 155,
        height: 40,
        marginLeft: 10,
        borderRadius: 10,
    },

    toggleReset: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#4A7BF6',
        width: 110,
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



    // completeButton: {
    //     position: 'absolute',
    //     bottom: 0,
    //     left: '65%', // 수평 중앙으로 위치
    //     transform: [{ translateX: -105 }], // 중앙 정렬을 위한 이동
    //     backgroundColor: '#5E56C3',
    //     paddingVertical: 9,
    //     width: 100,
    //     borderRadius: 30,
    //     marginBottom: 5,
    // },

    // completeButtonText: {
    //     color: 'white',
    //     fontSize: 16,
    //     fontWeight: 'bold',
    //     textAlign: 'center',
    // },

    myMainExercise: {
        height: height * 0.35,
        
    },

    exerciseList:{
        height: 720
        
    },

    exerciseItem: {

        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        height: 70,
        
    },

    exerciseIcon:{
        width:65,
        height:55,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'gray',
        marginRight: 8,
    },

    exerciseName:{
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },

    exerciseDetails: {
        marginTop: 5,
        fontSize: 13,
        color: '#999999'
    },

    exerciesePopular: {
        color: '#3F96EE',
        borderWidth: 1,          
        borderColor: '#3F96EE',  

        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 7,
        paddingRight: 7,



        borderRadius: 10,     
        fontSize: 10,     
        marginLeft: 5,
    },

    noExerciseText:{
        color: 'white'
    },

    likeIcon:{
    },

    myExerciseText:{
        marginTop: 10,
        marginLeft: 10,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    },

    noSelectedExerciseText: {
        fontSize: 15,
        color: '#999999'
    },




    exerciseGrid: {
        flexDirection: 'column',
    },
    exerciseItemBox: {
        // marginVertical: 5,
    },

    scheduleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4A5568', // 버튼 배경색
        paddingVertical: 9,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#4A7BF6', // 외곽선 색상
        marginVertical: 5, // 목록 간 간격
    },
    exerciseNameOnly: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

    noSelectedExerciseText: {
        textAlign: 'center',
        color: '#999999',
        fontSize: 14,
        marginTop: 8,
    },

    noExerciseText: {

        textAlign: 'center',
        color: '#999999',
        marginTop: 20
    }
    
});