import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 임포트
import Footer from '../common/Footer';
import Header from '../common/Header';
import Body from '../../../components/management/Body';
import Food from '../../../components/management/Food';

const Management = ({ navigation }) => {
    const [weightUnit, setWeightUnit] = useState(null);

    useEffect(() => {
        console.log("=====================관리 페이지 ========================");
    }, []);

    // 단위 로드
    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const unitKg = await AsyncStorage.getItem('weightUnit');
                setWeightUnit(unitKg || 'kg'); // 기본값: 'kg'

            } catch (error) {
                console.error('Error fetching units:', error);
            }
        };

        fetchUnits();
    }, []);

    // 단위 변경 시 AsyncStorage 업데이트
    useEffect(() => {
        const updateStorage = async () => {
            try {

                if (weightUnit) {
                    // console.log("weightUnit 변경됨= " + weightUnit);
                    const unitToSave = weightUnit === 'kg' ? 'kg' : 'lbs';
                    await AsyncStorage.setItem('weightUnit', unitToSave);
                }
            } catch (error) {
                console.error('Error updating AsyncStorage:', error);
            }
        };

        updateStorage();
    }, [weightUnit]); // 의존성 배열 수정

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#1A1C22' }}>
            <Header title="Management" navigation={navigation} />
            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                
                {/* weightUnit과 setWeightUnit을 Body에 전달 */}
                <Body weightUnit={weightUnit} setWeightUnit={setWeightUnit} />
                {/* volumeUnit과 setVolumeUnit을 Food에 전달 */}
                <Food />
                
            </ScrollView>
            <Footer navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#1A1C22',
    },
});

export default Management;
