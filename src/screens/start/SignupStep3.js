import React from 'react';
import { useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

function SignupStep3({ navigation }) {

    useEffect(() => {
        console.log("===================== 가입 추가 정보 3 ========================")
    }, []);

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



export default SignupStep3;
