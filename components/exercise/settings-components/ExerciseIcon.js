import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const ExerciseIcon = ({ mainMuscleGroup, detailMuscleGroup, exerciseType, isIconVisible, toggleVisibility }) => (
    <View style={styles.eachInformation}>
        <View>
            {/* "닫기" 버튼 */}
            {isIconVisible && (
                <Pressable onPress={toggleVisibility}>
                    <Text style={styles.closeButtonText}>닫기</Text>
                </Pressable>
            )}
        </View>
    </View>
);

const styles = StyleSheet.create({
    eachInformation: {
        minHeight: 60,
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'red',
        fontWeight: 'bold',
    },
});

export default ExerciseIcon;
