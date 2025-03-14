import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import exerciseSVGs from './ExerciseSVGs'; 

const ScheduleExerciseIcon = ({ exerciseId, toggleVisibility }) => {
    const { i18n } = useTranslation(); 

    const SvgComponent = exerciseSVGs[exerciseId] || null;

    return (
        <Pressable style={styles.overlay} onPress={toggleVisibility}>
            <View style={styles.modalContainer}>

                {SvgComponent ? (
                    <SvgComponent width={300} height={220} viewBox="230 300 2000 2100" />
                ) : (
                    <>
                        <Image 
                            source={require('../../../src/assets/none.webp')}
                            style={styles.iconImage} 
                        />
                        <Text style={styles.text}>{i18n.t('exerciseIcon.sorry_message')}</Text>
                        <Text style={styles.boldText}>{i18n.t('exerciseIcon.image_preparing')}</Text>
                    </>
                )}
                
                <Text style={styles.smallText}>
                    {i18n.t('exerciseIcon.click_to_return')}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute', // ✅ 화면 정중앙에 모달 띄우기
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center', // 세로 중앙 정렬
        alignItems: 'center', // 가로 중앙 정렬
        zIndex: 10, // ✅ 기존 UI보다 위에 배치
    },
    modalContainer: {
        backgroundColor: '#222732', // ✅ 모달 배경
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth:2,
        borderColor:'#1C1F29'
    },
    iconImage: {
        width: 80,
        height: 90,
    },
    text: {
        color: 'white',
        marginTop: 15,
    },
    boldText: {
        color: 'white',
        fontWeight: 'bold',
    },
    smallText: {
        color: 'white',
        fontSize: 12,
        marginTop: 5,
    },
});

export default ScheduleExerciseIcon;
