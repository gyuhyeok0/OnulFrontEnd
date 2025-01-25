import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Text} from 'react-native';
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
            <Footer navigation={navigation}/>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#1A1C22',
    },

    body:{
        minHeight: 150,
        backgroundColor:'#222732',
        borderRadius:15,
    },

    titleText: {
        color:'white',
        fontSize: 20,
        fontWeight:'bold',
        margin:10
    },

    rowCommon: {
        flexDirection: 'row', // 가로 방향 정렬
        justifyContent: 'space-between', // 자식 간의 간격 균등 분배
        paddingHorizontal: 10, // 좌우 여백 추가
        alignItems: 'center', // 세로 방향 정렬
        marginBottom: 10,
    },

    row1:{
        marginTop:7,
    },

    recordContainer:{
        width: '49%',
        backgroundColor:'#333845',
        minHeight: 80,
        borderRadius:15,
        justifyContent:'center',
        alignItems:'center'
    },


    subTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 13,
    },

    weightDisplay: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        // marginBottom: 5,
        // backgroundColor:'white'
    },

    recordButton: {
        backgroundColor: '#497CF4',
        borderRadius: 20,
        paddingVertical: 7,
        paddingHorizontal: 20,
        marginBottom: 10,
    },

    recordButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    inputAccessoryView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        backgroundColor: '#CCCFD4',
    },

    timeButton: {
        flex: 1,
        marginHorizontal: 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        backgroundColor: '#fff',
        height: 35,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },

    selectedButton: {
        backgroundColor: '#497CF4', // 선택된 버튼의 배경색
    },
    selectedButtonText: {
        color: 'white', // 선택된 버튼 텍스트 색
        fontWeight: 'bold',
    },

    pressedCompleteButton: {
        backgroundColor: '#34C759', // 초록색
    },

});

export default Management;
