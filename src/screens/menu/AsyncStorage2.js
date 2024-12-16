import 'intl-pluralrules';
import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DefaultHeader from '../common/DefaultHeader';

const AsyncStorage2 = ({ navigation }) => {
    const [storageSize, setStorageSize] = useState(0);

    // 스토리지 데이터 크기를 계산하는 함수
    const calculateStorageSize = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys(); // 모든 키 가져오기
            if (keys.length > 0) {
                const result = await AsyncStorage.multiGet(keys); // 키에 해당하는 모든 값 가져오기
                let totalSize = 0;

                // 각 값의 크기를 계산
                result.forEach(([key, value]) => {
                    const keySize = key ? key.length : 0;
                    const valueSize = value ? value.length : 0;
                    totalSize += keySize + valueSize; // 키와 값의 길이 합산
                });

                // 크기를 MB로 변환
                const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
                setStorageSize(sizeInMB); // 상태로 크기 저장
                console.log(`스토리지 크기: ${sizeInMB} MB`);
            } else {
                setStorageSize(0);
                console.log('AsyncStorage에 저장된 데이터가 없습니다.');
            }
        } catch (error) {
            console.error('스토리지 크기 계산 중 오류 발생:', error);
        }
    };

    // 스토리지 데이터를 삭제하는 함수
    const clearStorage = async () => {
        try {
            await AsyncStorage.clear();
            Alert.alert("성공", "스토리지 데이터가 삭제되었습니다.");
            console.log("스토리지 데이터가 삭제되었습니다.");
            setStorageSize(0); // 크기를 초기화
        } catch (error) {
            console.error('스토리지를 지우는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        calculateStorageSize(); // 컴포넌트가 마운트될 때 스토리지 데이터 크기를 계산
    }, []);

    return (
        <>
            <DefaultHeader title="메뉴" navigation={navigation} />

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ marginBottom: 20, fontSize: 18 }}>
                    스토리지 크기: {storageSize} MB
                </Text>
                <Button title="스토리지 크기 확인" onPress={calculateStorageSize} />
                <Button title="스토리지 삭제" onPress={clearStorage} color="red" />
                <Button title="로그아웃" onPress={async () => {
                    await clearStorage();
                    navigation.navigate('Login');
                }} color="blue" />
            </View>
        </>
    );
};

export default AsyncStorage2;
