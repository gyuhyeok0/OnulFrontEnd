// ExerciseInfoComponent.js
import React from 'react';
import { View, Text } from 'react-native';
import styles from './EachExercise.module'; // 기존 스타일 파일을 유지

const ExerciseInfoComponent = ({ exercise }) => (
    <View style={styles.eachInformation}>
        <Text style={styles.exerciseInfoText}>운동명: {exercise.exerciseName}</Text>
        <Text style={styles.exerciseInfoText}>주요 근육: {exercise.mainMuscleGroup}</Text>
        <Text style={styles.exerciseInfoText}>운동 유형: {exercise.exerciseType}</Text>
        {/* 필요에 따라 추가 정보 표시 */}
    </View>
);

export default ExerciseInfoComponent;
