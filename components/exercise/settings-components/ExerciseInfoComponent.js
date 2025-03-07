import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const ExerciseInfoComponent = ({ exercise }) => {
    const { t,i18n } = useTranslation();

    const exerciseName = exercise.exerciseName;

    // "details" 객체 전체 가져오기
    const exerciseDetails = t(`exerciseNames.${exerciseName}.details`, { returnObjects: true });

    if (!exerciseDetails || typeof exerciseDetails !== 'object') {
        return <Text style={styles.listText}>{t("notFound")}</Text>;
    }

    return (
        <View style={styles.container}>
            {Object.entries(exerciseDetails).map(([sectionTitle, items]) => (
                <View key={sectionTitle} style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>{sectionTitle}</Text>
                    {items.map((item, index) => (
                        <Text key={index} style={styles.listText}>
                            - {item}
                        </Text>
                    ))}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 17,
        marginBottom: 4,
    },
    listText: {
        color: 'white',
        fontSize: 14,
        marginBottom: 4,
    },
});

export default ExerciseInfoComponent;
