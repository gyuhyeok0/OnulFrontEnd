import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Text, StyleSheet, Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import Footer from '../common/Footer';
import { checkOnboardingStatus } from '../../hooks/HendleOnboarding';
import { handlerLogOut } from '../../hooks/HandleLogout';
import AutoAdapt from '../../../components/exercise/autoAdapt/AutoAdapt';
import OnSchedule from '../../../components/exercise/OnSchedule';
import Custom from '../../../components/exercise/Custom';
import { useTranslation } from 'react-i18next';
import { notice } from '../../apis/NoticeAPI';
import NoticeModal from '../modal/NoticeModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Exercise = ({ navigation }) => {
    const userId = useSelector((state) => state.member.userInfo?.memberId);
    const accessToken = useSelector((state) => state.member.userInfo?.accessToken);
    const { t } = useTranslation();

    const [selectedOption, setSelectedOption] = useState('AutoAdapt');
    const [showTooltip, setShowTooltip] = useState({ visible: false, message: '' });
    const [noticeData, setNoticeData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (userId && accessToken) {
                const data = await notice(accessToken);
                if (data && data.active) {
                    setNoticeData(data);
                    setModalVisible(true);
                }
            } else {
                handlerLogOut(navigation);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [userId, accessToken]);

    const closeModal = () => setModalVisible(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!userId || !accessToken) {
                handlerLogOut(navigation);
                return;
            }

            try {
                const onboardingChecked = await AsyncStorage.getItem(`onboarding_checked_${userId}`);
                if (!onboardingChecked) {
                    await checkOnboardingStatus(userId, accessToken, navigation);
                    await AsyncStorage.setItem(`onboarding_checked_${userId}`, 'true');
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
            }
        }, 10000);

        return () => clearTimeout(timer);
    }, [userId, accessToken]);

    const handlePress = (option, message) => {
        setSelectedOption(option);
        setShowTooltip({ visible: true, message });
    };

    useEffect(() => {
        if (showTooltip.visible) {
            const timer = setTimeout(() => {
                setShowTooltip({ visible: false, message: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showTooltip.visible]);

    const renderSelectedComponent = () => {
        switch (selectedOption) {
            case 'AutoAdapt':
                return <AutoAdapt />;
            case 'OnSchedule':
                return <OnSchedule />;
            case 'Custom':
                return <Custom />;
            default:
                return <AutoAdapt />;
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
                <View style={styles.selectionContainer}>
                    <Pressable
                        style={[
                            styles.option,
                            selectedOption === 'AutoAdapt' && styles.selectedShadow
                        ]}
                        onPress={() => handlePress('AutoAdapt', t('exercise.autoAdaptDescription'))}
                    >
                        <Text style={[
                            styles.optionText,
                            selectedOption === 'AutoAdapt' && styles.selectedTextColor
                        ]}>
                            {t('exercise.autoAdapt')}
                        </Text>
                        <Image
                            source={
                                selectedOption === 'AutoAdapt'
                                    ? require('../../assets/AutoAdapt_color.webp')
                                    : require('../../assets/AutoAdapt.webp')
                            }
                            style={styles.icon}
                        />
                    </Pressable>

                    <Pressable
                        style={[
                            styles.option,
                            selectedOption === 'OnSchedule' && styles.selectedShadow
                        ]}
                        onPress={() => handlePress('OnSchedule', t('exercise.onScheduleDescription'))}
                    >
                        <Text style={[
                            styles.optionText,
                            selectedOption === 'OnSchedule' && styles.selectedTextColor
                        ]}>
                            {t('exercise.onSchedule')}
                        </Text>
                        <Image
                            source={
                                selectedOption === 'OnSchedule'
                                    ? require('../../assets/OnSchedule_color.webp')
                                    : require('../../assets/OnSchedule.webp')
                            }
                            style={styles.icon}
                        />
                    </Pressable>

                    <Pressable
                        style={[
                            styles.option,
                            selectedOption === 'Custom' && styles.selectedShadow
                        ]}
                        onPress={() => handlePress('Custom', t('exercise.customDescription'))}
                    >
                        <Text style={[
                            styles.optionText,
                            selectedOption === 'Custom' && styles.selectedTextColor
                        ]}>
                            {t('exercise.custom')}
                        </Text>
                        <Image
                            source={
                                selectedOption === 'Custom'
                                    ? require('../../assets/Custom_color.webp')
                                    : require('../../assets/Custom.webp')
                            }
                            style={styles.icon}
                        />
                    </Pressable>
                </View>

                <View style={styles.wrap} />

                {renderSelectedComponent()}

                {showTooltip.visible && (
                    <View style={styles.tooltip}>
                        <Text style={styles.tooltipText}>{showTooltip.message}</Text>
                    </View>
                )}
            </ScrollView>

            <Footer navigation={navigation} />

            {modalVisible && noticeData && (
                <NoticeModal noticeData={noticeData} closeModal={closeModal} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#1A1C22',
    },
    scrollView: {
        backgroundColor: '#1A1C22',
    },
    selectionContainer: {
        paddingBottom: 10,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    option: {
        width: 120,
        alignItems: 'center',
        position: 'relative',
        padding: 12,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        backgroundColor: '#15181C',
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },

    selectedShadow: {
        shadowColor: '#3F97EF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 2,
    },
    wrap: {
        height: 3,
        backgroundColor: '#0F1216',
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    optionText: {
        color: '#9E9E9E',
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 6,
        textAlign:'center'
    },
    selectedTextColor: {
        color: '#3F97EF',
    },
    icon: {
        width: 28,
        height: 28,
    },
    tooltip: {
        position: 'absolute',
        maxWidth: 300,
        top: 110,
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
    },
    tooltipText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 13,
        lineHeight: 18,
        fontWeight: 'bold',
    },
    blur: {
        backgroundColor: 'rgba(21, 24, 28, 0.55)',
        width: 65,
        height: 65,
        top: -5,
        position: 'absolute',
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Exercise;
