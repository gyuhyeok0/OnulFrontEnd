// ExerciseInfoComponent.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const ExerciseInfoComponent = ({ exercise }) => {
    const { t } = useTranslation();

    return (
        <Text style={styles.exerciseInfoText}>
            {t(`exerciseNames.${exercise.exerciseName}.name`, exercise.exerciseName)}
        </Text>


    );
};

const styles = StyleSheet.create({
    eachInformation: {
        minHeight: 60,
        flex: 1,
    },
    exerciseInfoText: {
        color: 'white',
    },
});

export default ExerciseInfoComponent;
