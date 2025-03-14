import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import exerciseSVGs from './ExerciseSVGs'; 

const ExerciseIcon = ({ exerciseId, toggleVisibility }) => {
    const { i18n } = useTranslation(); // i18n 객체 가져오기

    const SvgComponent = exerciseSVGs[exerciseId] || null;

    return (
        <Pressable style={styles.eachInformation} onPress={toggleVisibility}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                {SvgComponent ? (
                    <SvgComponent width={300} height={220} viewBox="230 300 2000 2100" />
                ) : (
                    <>
                        <Image 
                            source={require('../../../src/assets/none.webp')}  // 이미지 경로
                            style={styles.iconImage}  // 이미지 스타일 적용
                        />
                        <Text style={styles.text}>{i18n.t('exerciseIcon.sorry_message')}</Text>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>{i18n.t('exerciseIcon.image_preparing')}</Text>
                    </>
                )}
                
                {/* <Text style={styles.text}>{i18n.t('exerciseIcon.sorry_message')}</Text>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{i18n.t('exerciseIcon.image_preparing')}</Text> */}
                <Text style={{ color: 'white', fontSize: 12, marginTop: 5 }}>
                    {i18n.t('exerciseIcon.click_to_return')}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    eachInformation: {
        minHeight: 60,
        flex: 1,
        backgroundColor: '#222732',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor:'white'
    },
    iconImage: {
        width: 80,
        height: 90,
    },
    text: {
        color: 'white',
        marginTop: 15,
    },
});

export default ExerciseIcon;
