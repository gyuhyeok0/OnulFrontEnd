import React from 'react';
import { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text} from 'react-native';
import Footer from '../common/Footer'; 
import Header from '../common/Header'; // 커스텀 헤더 컴포넌트 임포트
import WeeklySchedule from '../../../components/schedule/WeeklySchedule';
import WorkoutRegistration from '../../../components/schedule/WorkoutRegistration';

const Schedule = ({ navigation }) => {

    useEffect(() => {
        console.log("===================== 스케쥴 페이지 ========================")
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#1A1C22' }}>
            {/* 커스텀 헤더 컴포넌트 사용 */}
            <Header title="Schedule" navigation={navigation} />
            
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>

                <WeeklySchedule/>

                <WorkoutRegistration/>

            </ScrollView>

            {/* Footer 컴포넌트 사용 */}
            <Footer navigation={navigation} />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#1A1C22'
    },
    scrollContent: {
        flexGrow: 1, 
        padding: 15,
    },

});

export default Schedule;
