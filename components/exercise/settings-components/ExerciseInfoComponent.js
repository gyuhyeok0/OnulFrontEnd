// ExerciseInfoComponent.js
import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

const ExerciseInfoComponent = ({ exercise }) => (
    <View style={styles.eachInformation}>
        <Text style={styles.exerciseInfoText}>운동명: {exercise.exerciseName}</Text>
        <Text style={styles.exerciseInfoText}>주요 근육: {exercise.mainMuscleGroup}</Text>
        <Text style={styles.exerciseInfoText}>운동 유형: {exercise.exerciseType}</Text>
        {/* 필요에 따라 추가 정보 표시 */}
    </View>
);

const styles = StyleSheet.create({

    eachInformation: {
        minHeight: 60,
        flex: 1,
        // backgroundColor:'gray'
    },
    
    exerciseInfoText:{
        color: 'white'
    },

});

export default ExerciseInfoComponent;
