import React, { useState, useEffect } from 'react';
import { View , StyleSheet, Text, Pressable} from 'react-native';
import { useSelector } from 'react-redux';


const AutoAdapt = () => {

    const userId = useSelector((state) => state.member.userInfo.memberId);
    const accessToken = useSelector((state) => state.member.userInfo.accessToken);

        // 운동 강도 상태 관리
        const [selectedIntensity, setSelectedIntensity] = useState(null);
        const intensities = ['쉬웠음', '보통', '어려움'];

            // 운동 강도 선택 처리 함수
    const handleIntensityPress = (index) => {
        setSelectedIntensity(index);
    };

    return (
        <View style={{width: '100%', height: 200, backgroundColor: '#1A1C22', padding: 10 }}>
            <View>

                <View style={{width: '100%', height: 200, backgroundColor: '#1A1C22' }}>

                </View>

            </View>
            {/* 운동 강도 선택 버튼들 */}
            <View style={styles.intensityContainer}>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>오늘의 운동강도</Text>
                <Text style={{fontSize: 12, color: '#888888', marginTop: 5 }}>다음날 운동에 반영됩니다.</Text>

                <View style={styles.intensityWrap}>
                    {intensities.map((intensity, index) => (
                        <Pressable
                            key={index}
                            onPress={() => handleIntensityPress(index)}
                            style={[
                                styles.intensityButton,
                                index === selectedIntensity && styles.selectedButton
                            ]}
                        >
                            <Text
                                style={[
                                    styles.intensityText,
                                    index === selectedIntensity && styles.selectedText
                                ]}
                            >
                                {intensity}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>    
        </View>
    );
};


const styles = StyleSheet.create({

    //  운동강도
    intensityContainer: {
        // backgroundColor: 'pink'
    },

    intensityWrap: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        // backgroundColor: 'pink',
        marginVertical: 15,
    },

    intensityButton: {
        paddingVertical: 9,
        paddingHorizontal: 25,
        backgroundColor: '#1A1C22',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#4E5157',
    },
    selectedButton: {

        borderColor: 'white',
    },

    intensityText: {
        color: '#9E9E9E',
        fontSize: 13,
        fontWeight: 'bold',
    },

    selectedText: {
        color: '#FFFFFF', // 선택된 버튼의 텍스트 색상
    },

});

export default AutoAdapt;
