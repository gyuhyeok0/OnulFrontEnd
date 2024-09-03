import { useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import DefaultHeader from '../common/DefaultHeader'; // 커스텀 헤더 컴포넌트 임포트

function Signup({ navigation }) {

    useEffect(() => {
        console.log("===================== 가입 페이지 ========================")
    }, []);

    const handleNextStep = () => {
        navigation.navigate('SignupStep1');
    };

    return (
        <>
            <DefaultHeader title="회원가입" navigation={navigation} />
        
            <View style={styles.container}>

            </View>
        </>
    );
}

const styles = StyleSheet.create({

});


export default Signup;