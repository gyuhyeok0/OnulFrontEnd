import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Footer from '../common/Footer'; 
import Header from '../common/Header'; // 커스텀 헤더 컴포넌트 임포트

const Analysis = ({ navigation }) => {


    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#1A1C22' }}>
            
            <Header title="Analysis" navigation={navigation} />

            <ScrollView style={{ flex: 1, padding: 15}}>

                <View style={styles.graph}>
                <Pressable
                    style={styles.navButton}
                    onPress={() => navigation.navigate('ExerciseVolumeGraph')} // 전달할 prop 추가
                >
                    <Text style={styles.navButtonText}>내 운동 상태 확인하기</Text>
                </Pressable>

                </View>

                <View style={styles.graph}>
                    <Pressable
                        style={styles.navButton}
                        onPress={() => navigation.navigate('WeightAndDietGraph')} // 이동할 페이지 이름
                    >
                        <Text style={styles.navButtonText}>몸무게 및 식단 확인하기</Text>
                    </Pressable>
                </View>

                <View style={styles.graph}>
                    <Pressable
                        style={styles.navButton}
                        onPress={() => navigation.navigate('MuscleFatigue')} // 이동할 페이지 이름
                    >
                        <Text style={styles.navButtonText}>근육 피로도 확인하기</Text>
                    </Pressable>
                </View>

                {/* <View style={styles.graph}>
                    <Pressable
                        style={[styles.navButton, styles.disabledButton]} // 비활성화된 버튼 스타일
                        disabled={true} // 비활성화
                    >
                        <Text style={[styles.navButtonText, styles.disabledText]}>운동 균형 확인하기 ( 개발 중 )</Text>
                    </Pressable>
                </View> */}

                <View style={{height: 100}}></View>

            </ScrollView>

            <Footer navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    
    graph: {
        backgroundColor: '#222732',
        height: 300,
        borderRadius: 10,
        marginBottom: 30,
        justifyContent: 'center', // 버튼을 가운데 정렬
        alignItems: 'center', // 버튼을 가운데 정렬
        position: 'relative', // 버튼을 절대 위치로 배치하기 위해 사용
    },
    navButton: {
        backgroundColor: '#497CF4', // 버튼 색상
        paddingVertical: 10,
        width: 250,
        borderRadius: 10,
        position: 'absolute', // 버튼을 절대 위치로 배치
        bottom: 10, // 하단에서 10px 간격으로 배치
    },
    navButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign:'center'
    },

    // 비활성화된 버튼 스타일
    disabledButton: {
        backgroundColor: '#B0BEC5', // 회색 배경
    },

    disabledText: {
        color: '#607D8B', // 비활성화된 텍스트 색상 (회색)
        fontStyle: 'italic', // 기울임꼴
    }
});

export default Analysis;
