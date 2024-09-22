import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Text, StyleSheet, Pressable } from 'react-native';
import Footer from '../common/Footer';
import { useSelector } from 'react-redux';
import { checkOnboardingStatus } from '../../hooks/HendleOnboarding';
import { handlerLogOut } from '../../hooks/HandleLogout';  // Logout.js에서 함수 임포트
import AutoAdapt from '../../../components/exercise/AutoAdapt';
import OnSchedule from '../../../components/exercise/OnSchedule';
import Custom from '../../../components/exercise/Custom';

const Exercise = ({ navigation }) => {
    const userId = useSelector((state) => state.member.userInfo.memberId);
    const accessToken = useSelector((state) => state.member.userInfo.accessToken);

    // 상태 관리: 선택된 버튼에 따라 컴포넌트를 변경
    const [selectedOption, setSelectedOption] = useState('AutoAdapt');
    

    useEffect(() => {
        if (userId && accessToken) {
            checkOnboardingStatus(userId, accessToken, navigation);
        } else {
            handlerLogOut(navigation);
        }
    }, [userId, accessToken]);

    // 이미지 선택 처리 함수
    const handlePress = (option) => {
        setSelectedOption(option);
    };


    // 선택된 옵션에 따라 다른 컴포넌트를 렌더링
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
            <ScrollView style={styles.scrollView}>
                <View style={styles.selectionContainer}>
                    <Pressable
                        style={styles.option}
                        onPress={() => handlePress('AutoAdapt')}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedOption === 'AutoAdapt' && styles.selectedTextColor
                            ]}
                        >
                            자동적응
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
                        style={styles.option}
                        onPress={() => handlePress('OnSchedule')}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedOption === 'OnSchedule' && styles.selectedTextColor
                            ]}
                        >
                            맞춤일정
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
                        style={styles.option}
                        onPress={() => handlePress('Custom')}
                    >
                        <Text
                            style={[
                                styles.optionText,
                                selectedOption === 'Custom' && styles.selectedTextColor
                            ]}
                        >
                            커스텀
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
                
                {/* 선택된 옵션에 맞는 컴포넌트를 렌더링 */}
                {renderSelectedComponent()}

                </ScrollView>
            <Footer navigation={navigation} />
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
        marginTop: 20,
        marginBottom: 20,
        borderWidth: 0.5,
        borderColor: 'white',
        borderRadius: 20,
        margin: 10,
        flexDirection: 'row',
        backgroundColor: '#15181C',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20,
    },
    option: {
        alignItems: 'center',
    },
    optionText: {
        color: '#9E9E9E',
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 9,
    },

    selectedTextColor: {
        color: '#3F97EF', // 버튼이 눌리면 적용될 색상
    },

    icon: {
        width: 33,
        height: 33,
    },


});

export default Exercise;
