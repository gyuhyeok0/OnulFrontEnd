import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import FooterStyles from './FooterStyles.module'; // 스타일 import

const Footer = ({ navigation }) => {
    return (
        <SafeAreaView style={FooterStyles.safeArea}>
            <View style={FooterStyles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Exercise')} style={FooterStyles.button}>
                    <Text style={FooterStyles.buttonText}>Exercise</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Schedule')} style={FooterStyles.button}>
                    <Text style={FooterStyles.buttonText}>Schedule</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Management')} style={FooterStyles.button}>
                    <Text style={FooterStyles.buttonText}>Management</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Record')} style={FooterStyles.button}>
                    <Text style={FooterStyles.buttonText}>Record</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Footer;
