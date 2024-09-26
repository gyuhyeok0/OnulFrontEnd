import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const WorkoutRegistration = () => {
    return (
        <>
            <Text style={styles.title}>운동 등록</Text>

            <View style={styles.container}>

                <View style={styles.boxContainer}>
                    <View style={styles.reigstBox}>
                        <View style={styles.reigstWrap}>
                            <Image source={require('../../src/assets/regist/Chest.webp')} style={styles.chestIcon} />
                            <Text style={styles.text}>가슴 운동</Text>
                        </View>
                    </View>
                    <View style={styles.reigstBox}>
                        <View style={styles.reigstWrap}>
                            <Image source={require('../../src/assets/regist/Back.webp')} style={styles.backIcon} />
                            <Text style={styles.text}>등 운동</Text>
                        </View>
                    </View>
                    <View style={styles.reigstBox}>
                        <View style={styles.reigstWrap}>
                            <Image source={require('../../src/assets/regist/LowerBody.webp')} style={styles.lowerBodyIcon} />
                            <Text style={styles.text}>하체 운동</Text>
                        </View>
                    </View>
                    <View style={styles.reigstBox}>
                        <View style={styles.reigstWrap}>
                            <Image source={require('../../src/assets/regist/Shoulders.webp')} style={styles.shouldersIcon} />
                            <Text style={styles.text}>어깨 운동</Text>
                        </View>
                    </View>
                    <View style={styles.reigstBox}>
                        <View style={styles.reigstWrap}>
                            <Image source={require('../../src/assets/regist/Arms.webp')} style={styles.armsIcon} />
                            <Text style={styles.text}>팔 운동</Text>
                        </View>
                    </View>
                    <View style={styles.reigstBox}>
                        <View style={styles.reigstWrap}>
                            <Image source={require('../../src/assets/regist/Abs.webp')} style={styles.absIcon} />
                            <Text style={styles.text}>복근 운동</Text>
                        </View>
                    </View>
                    <View style={styles.reigstBox}>
                        <View style={styles.reigstWrap}>
                            <Image source={require('../../src/assets/regist/Aerobic.webp')} style={styles.aerobicIcon} />
                            <Text style={styles.text}>유산소 운동</Text>
                        </View>
                    </View>
                    <View style={styles.reigstBox}>
                        <View style={styles.reigstWrap}>
                            <Image source={require('../../src/assets/regist/CustomRegist.webp')} style={styles.customIcon} />
                            <Text style={styles.text}>커스텀 운동</Text>
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 30,
        marginBottom: 15,
    },
    boxContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
    },
    reigstBox: {
        backgroundColor: '#222732',
        width: '48%',
        height: 120,
        borderRadius: 25,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reigstWrap: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    chestIcon: {
        width: 90,
        height: 50,
        marginBottom: 15,
    },
    backIcon: {
        width: 90,
        height: 50,
        marginBottom: 15,
    },
    lowerBodyIcon: {
        width: 50,
        height: 60,
        marginBottom: 15,
    },
    shouldersIcon: {
        width: 80,
        height: 55,
        marginBottom: 15,
    },
    armsIcon: {
        width: 55,
        height: 60,
        marginBottom: 15,
    },
    absIcon: {
        width: 75,
        height: 65,
        marginBottom: 15,
    },
    aerobicIcon: {
        width: 45,
        height: 50,
        marginBottom: 15,
    },
    customIcon: {
        width: 45,
        height: 50,
        marginBottom: 15,
    },
    text: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    },
});

export default WorkoutRegistration;
