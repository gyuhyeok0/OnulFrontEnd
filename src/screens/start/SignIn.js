import React, { useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

function SignIn({ navigation }) {

    useEffect(() => {
        console.log("=====================회원 로그인 페이지 ========================")
    }, []);

    const handleSignIn = () => {
        // 로그인 로직 구현 후, 성공하면 아래와 같이 페이지 이동
        navigation.navigate('Exercise');
    };

    return (
        <View style={styles.container}>
        <Text style={styles.text}>Sign In</Text>
        <TextInput style={styles.input} placeholder="Enter your email" />
        <TextInput style={styles.input} placeholder="Enter your password" secureTextEntry={true} />
        <Button title="Sign In" onPress={handleSignIn} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '80%',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default SignIn;
