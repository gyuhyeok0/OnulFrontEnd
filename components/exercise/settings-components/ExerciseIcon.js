import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

const ExerciseIcon = ({ mainMuscleGroup, detailMuscleGroup, exerciseType, isIconVisible, toggleVisibility }) => (
    <Pressable style={styles.eachInformation} onPress={toggleVisibility}>
        <View style={{justifyContent:'center', alignItems:'center'}}>

            <Image 
                source={require('../../../src/assets/none.webp')}  // 이미지를 프로젝트 내 경로에서 불러옵니다.
                style={styles.iconImage}  // 이미지 스타일 적용
            />
            <Text style={styles.text}>죄송합니다. </Text>
            <Text style={{color: 'white', fontWeight:'bold'}}>현재 이미지 준비중입니다.</Text>
            <Text style={{color: 'white', fontSize: 10, marginTop: 5}}>화면을 클릭하면 돌아갑니다.</Text>

        </View>
    </Pressable>
);

const styles = StyleSheet.create({
    eachInformation: {
        minHeight: 60,
        flex: 1,
        backgroundColor: '#222732',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'red',
        fontWeight: 'bold',
    },

    iconImage:{
        width: 80,
        height: 90,
    },

    text:{
        color:'white',
        marginTop: 15
    }
});

export default ExerciseIcon;
