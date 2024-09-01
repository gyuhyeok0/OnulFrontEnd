import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

function SignupStep2({ navigation }) {

    const handleNextStep = () => {
        navigation.navigate('SignupStep3');
    };

    return (
        <>
        </>
    );
}

const styles = StyleSheet.create({

});

export default SignupStep2;
