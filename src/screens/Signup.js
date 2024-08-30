import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

function Signup({ navigation }) {

    const handleNextStep = () => {
        navigation.navigate('SignupStep1');
    };

    return (
        <View style={styles.container}>

        </View>
    );
}

const styles = StyleSheet.create({

});


export default Signup;
