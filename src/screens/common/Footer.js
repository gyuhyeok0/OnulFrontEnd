import React from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import FooterStyles from './FooterStyles.module'; // 스타일 import
import Icon from 'react-native-vector-icons/MaterialIcons'; // Material 아이콘 import
import { useTranslation } from 'react-i18next';

const Footer = ({ navigation }) => {
    const { t } = useTranslation();
    const currentRoute = navigation.getState().routes[navigation.getState().index].name; // 현재 활성화된 페이지 이름

    return (
        <SafeAreaView style={FooterStyles.safeArea}>
            <View style={FooterStyles.footer}>
                {/* Exercise 아이콘 및 텍스트 */}
                <Pressable onPress={() => navigation.navigate('Exercise')} style={FooterStyles.button}>
                    <View style={FooterStyles.iconAndTextContainer}>
                        <Icon 
                            name="home" 
                            style={FooterStyles.exerciseButton}
                            size={33} 
                            color={currentRoute === 'Exercise' ? '#fff' : '#888888'} // 현재 페이지면 흰색, 아니면 회색
                        />
                        <Text 
                            style={[
                                FooterStyles.buttonText1, 
                                { color: currentRoute === 'Exercise' ? '#fff' : '#ccc' } // 현재 페이지면 흰색, 아니면 회색
                            ]}
                        >
                    
                            {t('footer.exercise')}
                        </Text>
                    </View>
                </Pressable>

                {/* Schedule 아이콘 및 텍스트 */}
                <Pressable onPress={() => navigation.navigate('Schedule')} style={FooterStyles.button}>
                    <View style={FooterStyles.iconAndTextContainer}>
                        <Icon 
                            name="calendar-today" 
                            style={FooterStyles.scheduleButton}
                            size={27} 
                            color={currentRoute === 'Schedule' ? '#fff' : '#888888'} // 현재 페이지면 흰색, 아니면 회색
                        />
                        <Text 
                            style={[
                                FooterStyles.buttonText2, 
                                { color: currentRoute === 'Schedule' ? '#fff' : '#ccc' } // 현재 페이지면 흰색, 아니면 회색
                            ]}
                        >
                            
                            {t('footer.schedule')}
                        </Text>
                    </View>
                </Pressable>

                {/* Management 아이콘 및 텍스트 */}
                <Pressable onPress={() => navigation.navigate('Management')} style={FooterStyles.button}>
                    <View style={FooterStyles.iconAndTextContainer}>
                        <Icon 
                            name="fastfood" 
                            style={FooterStyles.managementButton}
                            size={29} 
                            color={currentRoute === 'Management' ? '#fff' : '#888888'} // 현재 페이지면 흰색, 아니면 회색
                        />
                        <Text 
                            style={[
                                FooterStyles.buttonText3, 
                                { color: currentRoute === 'Management' ? '#fff' : '#ccc' } // 현재 페이지면 흰색, 아니면 회색
                            ]}
                        >
                            {t('footer.management')}
                        </Text>
                    </View>
                </Pressable>

                {/* Record 아이콘 및 텍스트 */}
                <Pressable onPress={() => navigation.navigate('Record')} style={FooterStyles.button}>
                    <View style={FooterStyles.iconAndTextContainer}>
                        <Icon 
                            style={FooterStyles.recordButton}
                            name="history" 
                            size={32} 
                            color={currentRoute === 'Record' ? '#fff' : '#888888'} // 현재 페이지면 흰색, 아니면 회색
                        />
                        <Text 
                            style={[
                                FooterStyles.buttonText4, 
                                { color: currentRoute === 'Record' ? '#fff' : '#ccc' } // 현재 페이지면 흰색, 아니면 회색
                            ]}
                        >
                            {t('footer.record')}
                        </Text>
                    </View>
                </Pressable>

                {/* Record 아이콘 및 텍스트 */}
                <Pressable onPress={() => navigation.navigate('Analysis')} style={FooterStyles.button}>
                    <View style={FooterStyles.iconAndTextContainer}>
                        <Icon 
                            style={FooterStyles.analysisButton}
                            name="bar-chart" 
                            size={37} 
                            color={currentRoute === 'Analysis' ? '#fff' : '#888888'} // 현재 페이지면 흰색, 아니면 회색
                        />
                        <Text 
                            style={[
                                FooterStyles.analysisText5, 
                                { color: currentRoute === 'Analysis' ? '#fff' : '#ccc' } // 현재 페이지면 흰색, 아니면 회색
                            ]}
                        >
                            {t('footer.analysis')}
                        </Text>
                    </View>
                </Pressable>

            </View>
        </SafeAreaView>
    );
};

export default Footer;
