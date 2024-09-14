import React from 'react';
import { SafeAreaView, View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProgressBar = ({ currentStep, navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.container, currentStep === 1 ? styles.containerStep1 : styles.containerDefault]}>
                {/* currentStep이 1이 아닐 때만 헤더를 표시 */}
                {currentStep !== 1 && (
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons 
                                name="chevron-back" 
                                size={32} 
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <View style={currentStep >= 1 ? styles.circleActive : styles.circleInactive} />
                    <View style={styles.line} />
                    <View style={currentStep >= 2 ? styles.circleActive : styles.circleInactive} />
                    <View style={styles.line} />
                    <View style={currentStep >= 3 ? styles.circleActive : styles.circleInactive} />
                    <View style={styles.line} />
                    <View style={currentStep >= 4 ? styles.circleActive : styles.circleInactive} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#1A1C22',
    },
    // 기본 container 스타일
    container: {
        paddingHorizontal: 16,
        backgroundColor: '#1A1C22',
    },

    // currentStep이 1일 때 적용되는 스타일
    containerStep1: {
        height: 50,
        // backgroundColor: 'white', // currentStep 1일 때 흰색 배경
    },
    // currentStep이 1이 아닐 때 적용되는 기본 스타일
    containerDefault: {
        height: 105,
    },

    header: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        color: '#fff',
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    circleActive: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'white',
        borderWidth: 4,
        borderColor: '#EAC70A',
    },
    circleInactive: {
        width: 15,
        height: 15,
        borderRadius: 12,
        backgroundColor: 'gray',
    },
    line: {
        width: 95,
        height: 2,
        backgroundColor: 'gray',
    },
});

export default ProgressBar;
