import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import DefaultHeader from '../../../src/screens/common/DefaultHeader';
import { MonthlyWeightAndDiet } from '../../../src/apis/AnalysisApi';
import { LineChart } from 'react-native-chart-kit';
import FoodGraph from './FoodGraph';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 임포트
import { useTranslation } from 'react-i18next';

const colors = ["#55CBF7", "#FA4638", "#39D76A", "#FFDD33", "#B452FF", "#FF8C00"];

const WeightAndDietGraph = ({ navigation }) => {
    const { t } = useTranslation();

    const memberId = useSelector((state) => state.member?.userInfo?.memberId);
    
    const [bodyData, setBodyData] = useState({});
    const [foodData, setFoodData] = useState({});
    const [weightUnit, setWeightUnit] = useState(null);

    // 단위 로드
    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const unitKg = await AsyncStorage.getItem('weightUnit');
                setWeightUnit(unitKg || 'kg'); // 기본값: 'kg'
            } catch (error) {
                console.error('Error fetching units:', error);
            }
        };

        fetchUnits();
    }, []);

    useEffect(() => {
        if (!memberId) return;
    
        const fetchData = async () => {
            try {
                const response = await MonthlyWeightAndDiet(memberId);
                
                const body = {};
                const food = {};

                response.forEach((item) => {
                    const dateKey = formatDate(item.date);

                    body[dateKey] = {
                        몸무게: item.averageWeight ?? null,
                        체지방량: item.averageBodyFatMass ?? null,
                        골격근량: item.averageSkeletalMuscleMass ?? null,
                    };

                    food[dateKey] = {
                        averageCalories: item.averageCalories ?? null,
                        averageCarbohydrates: item.averageCarbohydrates ?? null,
                        averageProtein: item.averageProtein ?? null,
                    };
                });

                setBodyData(body);
                setFoodData(food);

            } catch (error) {
                console.error("Error fetching exercise data:", error);
            }
        };
    
        fetchData();
    }, [memberId]);

    const formatDate = (dateArray) => {
        let [year, month] = dateArray;
        if (month === 12) {
            year += 1;
            month = 1;
        } else {
            month += 1;
        }
        return new Date(year, month - 1, 1).toISOString().split('T')[0];
    };

    const getChartData = () => {
        const currentMonth = new Date().getMonth() + 1;
        const labels = Array.from({ length: 10 }, (_, i) => ((currentMonth - i + 11) % 12) + 1 + t('weightAndDietGraph.month')).reverse();
    
        const dataKeys = Object.keys(bodyData).length > 0 ? Object.keys(Object.values(bodyData)[0]) : [];
    
        const datasets = dataKeys.map((key, index) => {
            let data = labels.map((month) => {
                const dateKey = Object.keys(bodyData).find(date => date.includes(month.replace(t('weightAndDietGraph.month'), "").padStart(2, '0')));
                return bodyData[dateKey]?.[key] ?? 0;  // Default to 0 instead of null
            });
    
            const validData = data.filter(value => value !== null && value !== 0);
            const volumeChange = validData.length > 1 ? validData[validData.length - 1] - validData[0] : 0; 
    
            return {
                key: `${key}-${index}`,
                data,
                color: (opacity = 1) => colors[index % colors.length],
                strokeWidth: 2,
                label: t(`weightAndDietGraph.${key}`), // Translate key labels
                volumeChange
            };
        });
    
        return { labels, datasets };
    };
    
    
    
    const chartData = getChartData();
    const hasData = chartData.datasets.length > 0;

    // Formatting volumeChange for two decimal places
    const formatVolumeChange = (value, isKg) => {
        if (value !== null) {
            // If the unit is 'kg', we don't need to convert, just format it.
            let formattedValue = value.toFixed(2);
            if (formattedValue.endsWith('.00')) formattedValue = formattedValue.slice(0, -3);
    
            // Convert the value to lbs if the unit is 'lbs'.
            if (!isKg) {
                formattedValue = (value * 2.20462).toFixed(2);  // Convert kg to lbs
                if (formattedValue.endsWith('.00')) formattedValue = formattedValue.slice(0, -3);  // Remove unnecessary decimals
            }
    
            return formattedValue;
        }
        return '';
    };

    return (
        <>    
            <DefaultHeader title={t('weightAndDietGraph.title')} navigation={navigation} />
            <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.weightAndDietContainer}>
                    <Text style={styles.graphTitle}>{t('weightAndDietGraph.monthlyAvgWeightStats')}</Text>

                    {hasData ? (
                        <>
                        <LineChart
                            data={{
                                labels: chartData.labels,
                                datasets: chartData.datasets.map(({ data, color }) => ({ data, color }))
                            }}
                            width={Dimensions.get('window').width - 30}
                            height={220}
                            yAxisSuffix={weightUnit === 'kg' ? 'kg' : 'lbs'}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chartStyle}
                        />
                        <View style={styles.legendContainer}>
                            {chartData.datasets.map(({ color, label, volumeChange }, index) => (
                                <View key={`${label}-${index}`} style={styles.legendItem}>
                                    <View style={[styles.legendColorBox, { backgroundColor: color() }]} />
                                    <Text style={styles.legendText}>{t(`${label}`)}</Text>
                                    <Text style={[styles.legendText2, { color: volumeChange > 0 ? '#4CAF50' : volumeChange < 0 ? '#F44336' : 'black' }]}>  
                                        {volumeChange !== null && volumeChange !== 0 ? (volumeChange > 0 ? "+" : "") + formatVolumeChange(volumeChange) + (weightUnit === 'kg' ? "kg" : "lbs") : ""}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        </>
                    ) : (
                        <Text style={styles.noDataText}>{t('weightAndDietGraph.noData')}</Text>
                    )}
                </View>
                <FoodGraph foodData={foodData}/>
                <View style={{height: 100}}/>
            </ScrollView>
        </>
    );
};

const chartConfig = {
    backgroundColor: "#222732",
    backgroundGradientFrom: "#222732",
    backgroundGradientTo: "#222732",
    decimalPlaces: 0, 
    color: (opacity = 1) => `rgba(200, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    fillShadowGradientOpacity: 0,
    fillShadowGradientFromOpacity: 0.08,
    fillShadowGradientToOpacity: 0,
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: '#1A1C22' },
    weightAndDietContainer: { backgroundColor: '#222732', borderRadius: 15, paddingVertical: 20, marginBottom: 40 },
    graphTitle: { color: 'white', textAlign: 'center', fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
    chartStyle: { marginVertical: 10, borderRadius: 16 },
    noDataText: { color: "#fff", textAlign: "center", marginTop: 20, marginBottom: 10 },
    legendContainer: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginBottom: 8 },
    legendColorBox: { width: 15, height: 15, marginRight: 8, borderRadius: 5 },
    legendText: { color: 'white', fontSize: 14 },
    legendText2: { color: 'white', fontSize: 14, fontWeight:'bold', marginLeft: 5 },
});

export default WeightAndDietGraph;
