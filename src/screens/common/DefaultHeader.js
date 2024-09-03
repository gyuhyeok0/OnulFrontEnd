import React from 'react';
import { View, Text, Button, TouchableOpacity, Image} from 'react-native';
import { DefaultHeaderStyles } from './DefaultHeaderStyles.module';  // 스타일 파일을 임포트
import Ionicons from 'react-native-vector-icons/Ionicons';

const DefaultHeader = ({ title, navigation }) => {
    return (
        <View style={DefaultHeaderStyles.headerStyle}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 10 }}>
                <Ionicons name="arrow-back" 
                        size={24} 
                        onPress={() => navigation.goBack()}
                        style={DefaultHeaderStyles.headerTintColor}/>
            </TouchableOpacity>
            <Text style={DefaultHeaderStyles.headerTintColor}> {title} </Text>
        </View>
    );
};







export default DefaultHeader;
