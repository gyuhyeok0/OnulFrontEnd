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
    },

    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap', // 여러 줄로 버튼을 정렬
        maxWidth: 300,
    },

    button: {
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 10,
        paddingRight: 10,

        margin: 4,
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
        margin:8,
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

    detailTitle: {
        marginTop: 15,
        color: 'white',
        fontSize: 12,
    },

    detailExerciseList: {
        marginTop: 7,
        width: 290,
        height: 100,
        backgroundColor: 'gray'
    }

});