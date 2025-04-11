import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
        backgroundColor:'#15181C',

    },

    header: {
        minHeight: 45,
        backgroundColor: '#222732',
        borderRadius: 10,
        padding: 8,
        marginBottom: 5,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    refreshButton: {
        minHeight: 30,
        flexDirection: 'row',
    },
    refreshInner: {
        flexDirection: 'row',
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
    refreshIcon: {
        marginLeft: 3,
    },
    refreshLabel: {
        color: '#C4C4C4',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 11,
        marginLeft: 4,
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        // maxWidth: 350,
        // backgroundColor:'red'

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

    refreshInnerPressed: {
        backgroundColor: '#2C3749', // 눌렀을 때 어두운 색
    },

});

export default styles;
