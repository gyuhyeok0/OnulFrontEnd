// PreviousRecordComponent.js
import React from 'react';
import { View, Text } from 'react-native';
import styles from './EachExercise.module'; // 기존 스타일 파일을 유지

const PreviousRecordComponent = ({ previousRecords }) => (
    <View style={styles.previousRecordContainer}>
        <Text style={styles.exerciseInfoText}>이전 기록</Text>
    </View>
);

export default PreviousRecordComponent;
