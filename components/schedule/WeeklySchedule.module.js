import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    scheduleContainer: {
        borderRadius: 20,
        backgroundColor: '#222732',
    },
    scheduleTitle: {
        textAlign: 'center',
        margin: 15,
        color: '#B6AEE0',
        fontWeight: 'bold',
        fontSize: 15,
    },
    weeklySchedule: {
        borderRadius: 10,
    },
    dayRow: {
        minHeight: 20,
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    day: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayText: {
        fontSize: 17,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    saturdayText: {
        color: '#5393F8',
    },
    sundayText: {
        color: '#ED2F2F',
    },
    oneWeek: {
        height: 60,
        borderRadius: 10,
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#3989D9',
        padding: 2,
    },
    swappedOneWeek: {
        backgroundColor: '#1D4772',  // oneWeek 전체 배경색 변경
    },

    twoWeek: {
        marginTop: 7,
        height: 60,
        borderRadius: 10,
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#1D4772',
        padding: 2,
    },

    swappedTwoWeek: {
        backgroundColor: '#3989D9',  // twoWeek 전체 배경색 변경
    },

    dayBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 13,
        margin: 2,
        marginTop: 4,
        marginBottom: 4,
    },
    animatedBox: {
        width: '100%',
        height: '100%',
        borderRadius: 13,
    },
    todayBox: {
        borderWidth: 2,
        borderColor: 'white',  // 오늘 날짜에 흰색 보더
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 8,
        paddingBottom: 0,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    legendBox: {
        width: 20,
        height: 10,
        marginRight: 5,
    },
    legendText: {
        color: 'white',
        fontSize: 12,
    },
    registration: {
        margin: 15,
        marginBottom: 20,
        borderRadius: 15,
        minHeight: 60,
        backgroundColor: '#505E78',
        justifyContent: 'center',
        alignItems: 'center',
    },
    registrationText: {
        color: 'white',
    },

});