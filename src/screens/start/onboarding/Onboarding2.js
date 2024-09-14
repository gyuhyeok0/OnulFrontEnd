import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import ProgressBar from '../../common/ProgressBar';

const Onboarding2 = ({ navigation }) => {
    return (
        <>
            {/* currentStep 값을 2로 설정 */}
            <ProgressBar currentStep={2} navigation={navigation} />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text>Onboarding Step 2</Text>
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

export default Onboarding2;
