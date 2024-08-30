import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

function SignupStep1({ navigation }) {

    const handleNextStep = () => {
        navigation.navigate('SignupStep2');
    };

    return (
        <>
        </>

    );
}

const styles = StyleSheet.create({

});

export default SignupStep1;
