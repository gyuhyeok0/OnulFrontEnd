import { useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

function Signup({ navigation }) {

    useEffect(() => {
        console.log("===================== 가입 페이지 ========================")
    }, []);

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