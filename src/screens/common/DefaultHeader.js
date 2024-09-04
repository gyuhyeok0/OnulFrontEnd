import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { DefaultHeaderStyles } from './DefaultHeaderStyles.module';  // 스타일 파일을 임포트
import Ionicons from 'react-native-vector-icons/Ionicons';

const DefaultHeader = ({ title, navigation }) => {
    return (
        <SafeAreaView style={DefaultHeaderStyles.headerStyle}>
            <View style={DefaultHeaderStyles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons 
                        name="chevron-back" 
                        size={32} 
                        style={DefaultHeaderStyles.icon}
                    />
                </TouchableOpacity>
                <Text style={DefaultHeaderStyles.headerText}>{title}</Text>
            </View>
        </SafeAreaView>
    );
};

export default DefaultHeader;
