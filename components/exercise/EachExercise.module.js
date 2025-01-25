import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    exerciseContainer: {
        width: '100%',
        minHeight: 220,
        padding: 10,
        backgroundColor: '#222732',
        borderRadius: 15,
        borderColor: '#3D424D',
        borderWidth: 1,
        marginBottom: 15,
        flexDirection: 'row',
    },
    selectedContainer: {
        borderWidth: 1,
        borderColor: '#5795E8',
    },
    exerciseInformation: {
        width: '30%',
    },
    exerciseIcon: {
        width: 75,
        height: 55,
        backgroundColor: '#141821',
        borderRadius: 5,
        justifyContent:'center',
        alignItems:'center'
    },

    exerciseText: {
        fontSize: 14,
        color: '#fff',
        marginTop: 5,
        fontWeight: 'bold',
    },
    volumeContainer: {
        flexDirection: 'row',
        marginTop: 8,
        alignItems: 'center',
    },
    volumeText: {
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
        color: '#55B3F7',
    },
    volumeSeparator: {
        color: 'white',
        fontWeight: 'bold',
    },
    volumeUnit: {
        color: 'white',
    },
    weightChangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    weightChangeText: {
        fontSize: 10,
        color: '#55F787',
        marginRight: 3,
    },
    weightChangeValue: {
        color: 'white',
        fontSize: 10,
    },
    weightChangeUnit: {
        color: 'white',
        fontSize: 10,
    },

    buttonContainer: {
        marginTop: 'auto',
        justifyContent: 'space-between',
    },
    infoButton: {
        width: 75,
        marginTop: 5,
        paddingVertical: 7,
        borderRadius: 8,
        borderColor: '#D5D7DB',
        borderWidth: 1,
        alignItems: 'center',
    },
    infoButtonPressed: {
        backgroundColor: '#497CF4', // 눌렀을 때 배경색
        borderColor: '#497CF4',

    },
    buttonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },

    exerciseRecord: {
        width: '75%',
        flex: 1,
        flexDirection: 'column',
    },
    record: {
        minHeight: 60,
        flex: 1,
    },
    recordTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
        marginBottom: 8,
    },

    recordInputs: {
        flexDirection: 'column',
        justifyContent: 'space-between',

    },
    
    setSection: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        justifyContent: 'space-between',
    },

    setButton: {
        width: 30, 
        height: 30, 
        justifyContent: 'center', 
        borderRadius: 5, 
        marginRight: 5,
    },
    
    input: {
        minWidth: 60,
        minHeight: 30,
        borderRadius: 5,
        // paddingHorizontal: 5,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        marginRight: 5,
    },

    completeButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    setting: {
        minHeight: 30,
    },
    settingTitle: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 10,
    },
    settingButtonsContainer: {
        flexDirection: 'row',
    },
    settingButton: {
        marginTop: 5,
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 6,
        backgroundColor: '#497CF4',
        alignItems: 'center',
        marginRight: 5,
    },

    exerciseInfoText:{
        color: 'white'
    },

    eachInformation: {
        minHeight: 60,
        flex: 1,
        // backgroundColor:'gray'
    },



});

export default styles;
