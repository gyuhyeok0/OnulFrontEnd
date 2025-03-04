import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';
import DefaultHeader from '../../../src/screens/common/DefaultHeader';
import { getMuscleFaigue } from '../../../src/apis/AnalysisApi';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const screenWidth = Dimensions.get('window').width;

const MuscleFatigue = ({ navigation }) => {
    const { t } = useTranslation();
    const [data, setData] = useState(null);
    const memberId = useSelector((state) => state.member?.userInfo?.memberId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMuscleFaigue(memberId);
                
                if (response && Object.keys(response).length > 0) {
                    const chartData = {
                        labels: Object.keys(response).map(muscle => t(`muscleGroups.${muscle}`)), // 🔥 X축 라벨 번역
                        datasets: [
                            {
                                data: Object.values(response).map(
                                    (item) => Math.round(item[0]?.fatigueScore || 0)
                                ),
                            },
                        ],
                    };
                    setData({ chartData, rawData: response });
                } else {
                    setData(null);
                }
            } catch (error) {
                console.error("Error fetching exercise data:", error);
            }
        };
        fetchData();
    }, [memberId, t]); // 🔥 `t`를 의존성 배열에 추가 (언어 변경 시 자동 업데이트)
    

    const getRecoveryStatus = (score) => {
        if (score < 3) return t('muscleFatigue.normal');
        if (score < 5) return t('muscleFatigue.fatigueAccumulated');
        return t('muscleFatigue.overtrainingRisk');
    };
    

    return (
        <>
            <DefaultHeader title={t('muscleFatigue.title')} navigation={navigation} />
            <ScrollView style={styles.container}>
                <View style={styles.graphContainer}>
                    {data ? (
                        <>
                            <Text style={styles.graphTitle}>{t('muscleFatigue.monthlyAvgWeightStats')}</Text>

                
                            {/* Horizontal scrollable BarChart */}
                            <ScrollView horizontal={true} style={styles.chartScrollView}>
                                <BarChart
                                    data={data.chartData}
                                    width={Math.max(Object.keys(data.rawData).length * 60, screenWidth - 40)}  // 최소 너비 300
                                    height={220}
                                    yAxisLabel=""
                                    chartConfig={chartConfig}
                                    style={styles.chart}
                                    fromZero={true} // 0부터 시작
                                    yAxisMin={0}
                                    
                                />
                            </ScrollView>
            
                            <View style={{position:'relative'}}>
                            <Text style={styles.infoText}>{t('muscleFatigue.fatigueInfo')}</Text>

                            <View style={styles.scrollHint}>
                                <Text style={styles.scrollHintText}>{t('muscleFatigue.scrollRight')}</Text>
                            </View>
                            </View>
                            <View style={styles.legendContainer}>
                                {Object.entries(data.rawData).map(([muscle, fatigueArray]) => (
                                    fatigueArray.length > 0 ? (
                                        <View key={muscle} style={styles.legendItem}>
                                
                                            <Text style={styles.legendText}>{t(`muscleGroups.${muscle}`)} :</Text>

                                            <Text style={[styles.legendText2, 
                                                fatigueArray[0].fatigueScore >= 5 ? styles.highFatigue :
                                                fatigueArray[0].fatigueScore >= 3 ? styles.mediumFatigue :
                                                styles.lowFatigue]}>
                                                {getRecoveryStatus(fatigueArray[0].fatigueScore)}
                                            </Text>
                                        </View>
                                    ) : null
                                ))}
                            </View>
                        </>
                    ) : (
                        <Text style={styles.noDataText}>{t('muscleFatigue.noData')}</Text>
                    )}
                </View>
            </ScrollView>
        </>
    );
};

const chartConfig = {
    backgroundColor: "#222732",
    backgroundGradientFrom: "#222732",
    backgroundGradientTo: "#222732",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(135, 206, 250, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    fillShadowGradientOpacity: 1,
    fillShadowGradientToOpacity: 0.7,
    barPercentage: 0.6,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#1A1C22',
    },
    graphContainer: {
        backgroundColor: '#222732',
        borderRadius: 15,
        paddingVertical: 20,
        marginBottom: 40,
    },
    chartScrollView: {
        marginBottom: 20,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    infoText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
    },
    legendContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: 10,
        paddingHorizontal: 5,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: '#2A2F3C',
    },
    legendText: {
        color: 'white',
        fontSize: 14,
        fontWeight:'bold'
    },
    legendText2: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    lowFatigue: {
        color: '#4CAF50', // Green for normal
    },
    mediumFatigue: {
        color: '#FFC107', // Yellow for accumulated fatigue
    },
    highFatigue: {
        color: '#F44336', // Red for overtraining risk
    },
    noDataText: {
        color: '#AAB2C8',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    scrollHint: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position:'absolute',
        right: 10,
        top:-35
    },
    scrollHintText: {
        color: '#AAB2C8',
        marginLeft: 8,
        fontSize: 12,
    },
    graphTitle: { color: 'white', textAlign: 'center', fontSize: 14, fontWeight: 'bold', marginBottom: 5 },

});

export default MuscleFatigue;
