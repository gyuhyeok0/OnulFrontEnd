import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import ProgressBar from '../../common/ProgressBar';

const Onboarding4 = ({ navigation }) => {
    return (
        <>
            {/* currentStep 값을 4로 설정 */}
            <ProgressBar currentStep={4} navigation={navigation} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text>Onboarding Step 4</Text>
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

export default Onboarding4;
