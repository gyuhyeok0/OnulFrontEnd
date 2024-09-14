import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import ProgressBar from '../../common/ProgressBar';

const Onboarding = ({ navigation }) => {
    return (
        <>
            {/* currentStep 값을 1로 설정 */}
            <ProgressBar currentStep={1} navigation={navigation} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text>Onboarding Step 1</Text>
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#1A1C22',
    },
    container: {
        flex: 1,
        padding: 20,
    },
});

export default Onboarding;
