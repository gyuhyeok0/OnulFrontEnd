import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#1A1C22',
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 33,
        lineHeight: 44,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'left',
    },
    subTitle: {
        fontSize: 15,
        color: '#D8D8D8',
        marginTop: 8,
        marginBottom: height * 0.131,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        backgroundColor: '#33373E',
        borderRadius: 8,
        width: 60,
        height: 45,
        fontSize: 20,
        color: '#FFFFFF',
        textAlign: 'center',
        marginHorizontal: 10,
    },
    unitText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    activeUnit: {
        color: '#4A90E2',
    },
    toggleSwitch: {
        width: 50,
        height: 25,
        borderRadius: 15,
        backgroundColor: '#AAAAAA',
        justifyContent: 'center',
        padding: 3,
        marginHorizontal: 10,
    },
    toggleCircle: {
        width: 20,
        height: 20,
        borderRadius: 12,
        backgroundColor: '#000000',
    },

    toggleLeft: {
        alignSelf: 'flex-start',
    },
    toggleRight: {
        alignSelf: 'flex-end',
    },

    unknownButton: {
        backgroundColor: '#33373E',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginLeft: 10,
    },
    selectedUnknownButton: {
        backgroundColor: '#525D75',
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    unknownButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
    },
    nextButton: {
        backgroundColor: '#5E56C3',
        borderRadius: 30,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#433D8B',
    },
    disabledButtonText: {
        color: '#343055',
    },

});


export default styles;
