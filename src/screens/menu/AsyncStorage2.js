import 'intl-pluralrules';
import React, { useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DefaultHeader from '../common/DefaultHeader';


const AsyncStorage2 = ({ navigation }) => {
    // 모든 스토리지 데이터를 불러오는 함수
    const getAllData = async () => {
        try {
            // 저장된 모든 키를 가져옴
            const keys = await AsyncStorage.getAllKeys();
            if (keys.length > 0) {
                // 각 키에 해당하는 값을 모두 가져옴
                const result = await AsyncStorage.multiGet(keys);
                console.log("===================== 스토리지 정보 ========================");
                console.log(result); // 모든 스토리지 데이터를 콘솔에 출력
            } else {
                console.log('AsyncStorage에 저장된 데이터가 없습니다.');
            }
        } catch (error) {
            console.error('AsyncStorage 데이터를 가져오는 중 오류 발생:', error);
        }
    };

    // 스토리지 데이터를 삭제하는 함수
    const clearStorage = async () => {
        try {
            await AsyncStorage.clear();
            Alert.alert("성공", "스토리지 데이터가 삭제되었습니다.");
            console.log("스토리지 데이터가 삭제되었습니다.");
        } catch (error) {
            console.error('스토리지를 지우는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        getAllData(); // 컴포넌트가 마운트될 때 스토리지 데이터를 불러옴
    }, []);

    return (
        <>
        
            <DefaultHeader title="메뉴" navigation={navigation} />

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button title="스토리지 확인" onPress={getAllData} />
                <Button title="스토리지 삭제" onPress={clearStorage} color="red" />
            </View>

        </>

    );
};

export default AsyncStorage2;
