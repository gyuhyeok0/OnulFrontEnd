import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
    },
    customContainer: {
        paddingVertical: 10,
        borderRadius: 10,
        flexGrow: 1,
    },
    noSchedule: {
        width: '100%',
        minHeight: 100,
        marginBottom: 30,
        padding: 15,
        borderRadius: 10,
    },
    noScheduleText: {
        fontSize: 13,
        color: '#F0F0F0',
    },
    button: {
        marginTop: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: '#4A7BF6',
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    exerciseItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
    },




    header: {
        minHeight: 40,
        backgroundColor: '#222732',
        borderRadius: 10,
        padding: 8,
        marginBottom: 15,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    refreshButton: {
        height: 30,
        flexDirection: 'row',
    },
    refreshInner: {
        alignItems: 'center',
        backgroundColor: '#4A5569',
        padding: 6,
        borderRadius: 5,
    },
    refreshText: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
    },

    refreshLabel: {
        color: 'white',
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 2,
    },
    caretButton: {
        maxWidth: 200,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flex: 1,
    },
    hiddenContent: {
        overflow: 'hidden',
    },
    buttonContainer: {
        marginTop: 10,
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
    noSchedule: {
        width: '100%',
        marginBottom: 30,
        padding: 15,
    },
    noScheduleText: {
        fontSize: 13,
        color: '#F0F0F0',
    },
    noScheduleButton: {
        marginTop: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: '#4A7BF6',
        borderRadius: 10,
    },
    noScheduleButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },


});

export default styles;
