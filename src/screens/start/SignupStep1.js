import React from 'react';
import { useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

function SignupStep1({ navigation }) {

    useEffect(() => {
        console.log("===================== 가입 추가 정보 1 ========================")
    }, []);

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
