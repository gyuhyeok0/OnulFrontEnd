import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, TextInput ,TouchableOpacity} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useCurrentWeekAndDay } from '../../src/hooks/useCurrentWeekAndDay';
import { resetBodyData } from '../../src/modules/BodySlice';
import { saveBodyData } from '../../src/apis/BodyApi';

import { selectBodyDataByDate } from '../../src/modules/BodySlice';
import Foodmodal from '../../src/screens/modal/foodModal/Foodmodal';


const Food = () => {
    const dispatch = useDispatch();
    const [mealType, setMealType] = useState(''); // 현재 선택된 식사 타입

    const [isModalVisible, setModalVisible] = useState(false);

    const memberId = useSelector((state) => state.member?.userInfo?.memberId);

    const openFindPasswordModal = (type) => {
        setMealType(type); // 선택된 타입 설정
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setMealType(''); // 초기화
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.body}>
                    <Text style={styles.titleText}>식단</Text>

                    <Text style={styles.subtitle}>오늘의 식단을 추가해주세요</Text>

                    <View style={[styles.rowCommon, styles.row1]}>    

                        <TouchableOpacity style={styles.recordContainer}                            
                            onPress={() => openFindPasswordModal('breakfast')}
                        >
                            <Text style={styles.subTitle}>아침</Text>
                            
                            <View style={styles.rowCenter}>

                                <View style={styles.recordBox}>
                                    <View style={styles.rowFlexStart}>
                                        <Text style={styles.valueText}>00.0</Text>
                                        <Text style={styles.unitText}>kcal</Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.rowFlexStart}>
                                        <Text style={styles.valueText}>00.0</Text>
                                        <Text style={styles.unitText}>g</Text>
                                    </View>
                                </View>


                                <View style={styles.marginLeft8}>

                                    <View style={styles.recordStatusContainer}>
                                        <Text style={styles.recordStatusText}>아직 기록이 없습니다</Text>
                                    </View>
                                    
                                    <View style={styles.macroContainer}>
                                        <View style={styles.macroItem}>
                                            <Text style={styles.macroLabel}>탄수화물</Text>
                                            <Text style={styles.macroValue}>0g</Text>
                                        </View>

                                        <View style={styles.divider2} />

                                        <View style={styles.macroItem}>
                                            <Text style={styles.macroLabel}>탄수화물</Text>
                                            <Text style={styles.macroValue}>0g</Text>
                                        </View>

                                        <View style={styles.divider2} />

                                        <View style={styles.macroItem}>
                                            <Text style={styles.macroLabel}>지방</Text>
                                            <Text style={styles.macroValue}>0g</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={styles.recordContainer}
                            onPress={() => openFindPasswordModal('lunch')}
                        >                            
                            <Text style={styles.subTitle}>점심</Text>
                            
                            <View style={styles.rowCenter}>

                                <View style={styles.recordBox}>
                                    <View style={styles.rowFlexStart}>
                                        <Text style={styles.valueText}>00.0</Text>
                                        <Text style={styles.unitText}>kcal</Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.rowFlexStart}>
                                        <Text style={styles.valueText}>00.0</Text>
                                        <Text style={styles.unitText}>g</Text>
                                    </View>
                                </View>


                                <View style={styles.marginLeft8}>

                                    <View style={styles.recordStatusContainer}>
                                        <Text style={styles.recordStatusText}>아직 기록이 없습니다</Text>
                                    </View>
                                    
                                    <View style={styles.macroContainer}>
                                        <View style={styles.macroItem}>
                                            <Text style={styles.macroLabel}>탄수화물</Text>
                                            <Text style={styles.macroValue}>0g</Text>
                                        </View>

                                        <View style={styles.divider2} />

                                        <View style={styles.macroItem}>
                                            <Text style={styles.macroLabel}>탄수화물</Text>
                                            <Text style={styles.macroValue}>0g</Text>
                                        </View>

                                        <View style={styles.divider2} />

                                        <View style={styles.macroItem}>
                                            <Text style={styles.macroLabel}>지방</Text>
                                            <Text style={styles.macroValue}>0g</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.recordContainer}
                            onPress={() => openFindPasswordModal('dinner')}
                        >
                            <Text style={styles.subTitle}>저녁</Text>
                            
                            <View style={styles.rowCenter}>

                                <View style={styles.recordBox}>
                                    <View style={styles.rowFlexStart}>
                                        <Text style={styles.valueText}>00.0</Text>
                                        <Text style={styles.unitText}>kcal</Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.rowFlexStart}>
                                        <Text style={styles.valueText}>00.0</Text>
                                        <Text style={styles.unitText}>g</Text>
                                    </View>
                                </View>


                                <View style={styles.marginLeft8}>

                                    <View style={styles.recordStatusContainer}>
                                        <Text style={styles.recordStatusText}>아직 기록이 없습니다</Text>
                                    </View>
                                    
                                    <View style={styles.macroContainer}>
                                        <View style={styles.macroItem}>
                                            <Text style={styles.macroLabel}>탄수화물</Text>
                                            <Text style={styles.macroValue}>0g</Text>
                                        </View>

                                        <View style={styles.divider2} />

                                        <View style={styles.macroItem}>
                                            <Text style={styles.macroLabel}>탄수화물</Text>
                                            <Text style={styles.macroValue}>0g</Text>
                                        </View>

                                        <View style={styles.divider2} />

                                        <View style={styles.macroItem}>
                                            <Text style={styles.macroLabel}>지방</Text>
                                            <Text style={styles.macroValue}>0g</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.recordContainer}
                            onPress={() => openFindPasswordModal('snack')}
                        >                            
                            <Text style={styles.subTitle}>간식</Text>
                            
                            <View style={styles.rowCenter}>

                                <View style={styles.recordBox}>
                                    <View style={styles.rowFlexStart}>
                                        <Text style={styles.valueText}>00.0</Text>
                                        <Text style={styles.unitText}>kcal</Text>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.rowFlexStart}>
                                        <Text style={styles.valueText}>00.0</Text>
                                        <Text style={styles.unitText}>g</Text>
                                    </View>
                                </View>


                                <View style={styles.marginLeft8}>

                                    <View style={styles.recordStatusContainer}>
                                        <Text style={styles.recordStatusText}>아직 기록이 없습니다</Text>
                                    </View>
                                    
                                    <View style={styles.macroContainer}>
                                        <View style={styles.macroItem}>
                                            <Text style={styles.macroLabel}>탄수화물</Text>
                                            <Text style={styles.macroValue}>0g</Text>
                                        </View>

                                        <View style={styles.divider2} />

                                        <View style={styles.macroItem}>
                                            <Text style={styles.macroLabel}>탄수화물</Text>
                                            <Text style={styles.macroValue}>0g</Text>
                                        </View>

                                        <View style={styles.divider2} />

                                        <View style={styles.macroItem}>
                                            <Text style={styles.macroLabel}>지방</Text>
                                            <Text style={styles.macroValue}>0g</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>


                </View>
            </View>            

            {/* isModalVisible이 true일 때만 Foodmodal 렌더링 */}
            {isModalVisible && (
                <Foodmodal isVisible={isModalVisible} onClose={closeModal} mealType={mealType} />
            )}                            
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    body: {
        minHeight: 150,
        backgroundColor: '#222732',
        borderRadius: 15,
    },
    titleText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
    },
    subtitle: {
        marginLeft: 10,
        color: '#B8BFD1',
        fontWeight: 'bold',
        fontSize: 13,
    },
    rowCommon: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    recordContainer: {
        padding: 5,
        backgroundColor: '#515C78',
        minHeight: 80,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 3
    },
    subTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 8,
    },
    weightDisplay: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    weightUnit: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    recordButton: {
        backgroundColor: '#497CF4',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 30,
        marginBottom: 10,
    },
    recordButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    divider: {
        width: 70,
        height: 0.5,
        backgroundColor: '#fff',
        marginVertical: 4,
    },
    divider2: {
        height: 45,
        borderRadius: 50,
        width: 1,
        backgroundColor: '#fff',
        marginVertical: 2,
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    recordBox: {
        width: 85,
        height: 75,
        padding: 8,
        backgroundColor: '#222732',
        borderRadius: 10,
        justifyContent: 'center',
    },
    rowFlexStart: {
        flexDirection: 'row',
    },
    valueText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    unitText: {
        fontSize: 11,
        marginTop: 9,
        marginLeft: 3,
        color: '#fff',
        fontWeight: 'bold',
    },
    marginLeft8: {
        marginLeft: 8,
        justifyContent: 'center',
    },
    recordStatusContainer: {
        backgroundColor: '#497CF4',
        padding: 3,
        borderRadius: 5,
        marginBottom: 3,
    },
    recordStatusText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    macroContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        gap: 3,
        minWidth: 20,
    },
    macroItem: {
        justifyContent: 'center',
        width: 65,
        alignItems: 'center',
    },
    macroLabel: {
        color: 'white',
        fontWeight: 'medium',
    },
    macroValue: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 3,
    },
    flexRowMargin5: {
        flexDirection: 'row',
        margin: 5,
    },
    percentSymbol: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5,
    },
});

export default Food;
