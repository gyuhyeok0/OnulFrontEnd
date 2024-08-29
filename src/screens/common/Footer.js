// footer 페이지

import React from 'react';
import { View, Button } from 'react-native';
import FooterStyles from './FooterStyles.module'; // 스타일 import

const Footer = ({ navigation }) => {
    return (
        <View style={FooterStyles.footer}>
            <Button
                title="Exercise"
                onPress={() => navigation.navigate('Exercise')}
            />
            <Button
                title="Schedule"
                onPress={() => navigation.navigate('Schedule')}
            />
            <Button
                title="Management"
                onPress={() => navigation.navigate('Management')}
            />
            <Button
                title="Record"
                onPress={() => navigation.navigate('Record')}
            />
        </View>
    );
};

export default Footer;
