import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
// import ProgressBar from '../../common/ProgressBar';
import DefaultHeader from '../../src/screens/common/DefaultHeader';

const MuscleFatigue = ({ navigation }) => {


    return (
        <>    
            <DefaultHeader title="근육 피로도" navigation={navigation} />

            <View style={styles.container}>
                <Text style={styles.title}>안녕하세요</Text>
                <Text style={styles.subTitle}>회원님에게 맞춤 운동을 위한 몇가지 질문 입니다.</Text>

                <Text style={styles.question}>회원님에게 맞는 단위를 선택해 주세요</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#1A1C22',
    },

});

export default MuscleFatigue;
