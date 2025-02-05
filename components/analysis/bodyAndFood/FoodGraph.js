import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colors = ["#FFA726", "#66BB6A", "#29B6F6"];

const FoodGraph = ({ foodData = {} }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('calories');
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [unit, setUnit] = useState('g'); // 기본 단위는 'g'
    

    useEffect(() => {

        const fetchUnit = async () => {
            try {
                let storedUnit = await AsyncStorage.getItem('gOrOzUnit');
    
                if (!storedUnit) {
                    // gOrOzUnit이 없으면 weightUnit을 확인
                    const weightUnit = await AsyncStorage.getItem('weightUnit');
                    
                    // weightUnit에 따라 gOrOzUnit 설정
                    if (weightUnit === 'kg') {
                        storedUnit = 'g';
                    } else if (weightUnit === 'lbs') {
                        storedUnit = 'oz';
                    } else {
                        storedUnit = 'g'; // 기본값으로 'g' 설정
                    }
    
                    // gOrOzUnit에 값 설정
                    await AsyncStorage.setItem('gOrOzUnit', storedUnit);
                }
    
                setUnit(storedUnit); // 단위 상태 업데이트
            } catch (error) {
                console.error('Failed to fetch unit:', error);
            }
        };
    
        fetchUnit(); // 비동기 함수 호출
    }, []);

    useEffect(() => {
        if (!foodData || Object.keys(foodData).length === 0) {
            setChartData({ labels: [], datasets: [] });
            return;
        }

        const getChartData = () => {
            const currentMonth = new Date().getMonth() + 1;
            const labels = Array.from({ length: 10 }, (_, i) => ((currentMonth - i + 11) % 12) + 1 + "월").reverse();
            
            const processData = (key) => {
                let data = labels.map(month => {
                    const dateKey = Object.keys(foodData).find(date => date.includes(month.replace("월", "").padStart(2, '0')));

                    return foodData[dateKey]?.[key] ?? 0; // null을 0으로 변환

                });
                
                for (let i = 1; i < data.length; i++) {
                    if (data[i] === null) {
                        data[i] = data[i - 1] !== null ? data[i - 1] : 0;
                    }
                }
                
                const validData = data.filter(value => value !== null && value !== 0);
                const volumeChange = validData.length > 1 ? validData[validData.length - 1] - validData[0] : null;
                
                return { data, volumeChange };
            };

            if (selectedPeriod === 'calories') {
                const { data, volumeChange } = processData('averageCalories');
                return {
                    labels,
                    datasets: [{ data, color: () => colors[0], strokeWidth: 2, label: "칼로리", volumeChange }]
                };
            } else {
                const carbs = processData('averageCarbohydrates');
                const protein = processData('averageProtein');
                return {
                    labels,
                    datasets: [
                        { data: carbs.data, color: () => colors[1], strokeWidth: 2, label: "탄수화물", volumeChange: carbs.volumeChange },
                        { data: protein.data, color: () => colors[2], strokeWidth: 2, label: "단백질", volumeChange: protein.volumeChange }
                    ]
                };
            }
        };

        setChartData(getChartData());
    }, [selectedPeriod, foodData]);

    // Format volume change to two decimal places, removing .00 for whole numbers
    const formatVolumeChange = (value) => {
        if (value === null || value === undefined || isNaN(value)) return '';  // Null 또는 NaN 체크 추가
    
        // 단위 변환 (g → oz)
        if (unit === 'oz') {
            value = value * 0.03527396;
        }
    
        // 값 포맷팅 (소수점 두 자리까지, 필요 없으면 제거)
        const formattedValue = Number(value).toFixed(2);
        return formattedValue.endsWith('.00') ? formattedValue.slice(0, -3) : formattedValue;
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.graphTitle}>월별 평균 영양소 통계</Text>
            
            {chartData.datasets.length > 0 ? (
                <>
                    <LineChart
                        data={{
                            labels: chartData.labels,
                            datasets: chartData.datasets.map(({ data, color }) => ({ data, color }))
                        }}
                        width={Dimensions.get('window').width - 30}
                        height={220}
                        yAxisSuffix={selectedPeriod === 'calories' ? "kcal" : unit === 'g' ? "g" : "oz"}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chartStyle}
                    />
                    

                    <View style={styles.toggleContainer}>
                        <TouchableOpacity onPress={() => setSelectedPeriod('calories')} style={[styles.toggleButton, selectedPeriod === 'calories' && styles.activeButton]}>
                            <Text style={styles.toggleText}>칼로리</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedPeriod('nutrient')} style={[styles.toggleButton, selectedPeriod === 'nutrient' && styles.activeButton]}>
                            <Text style={styles.toggleText}>탄수화물 & 단백질</Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <Text style={styles.noDataText}>기론된 데이터가 없습니다.</Text>
            )}


            <View style={styles.legendContainer}>
                {chartData.datasets.map(({ color, label, volumeChange }, index) => (
                    <View key={`${label}-${index}`} style={styles.legendItem}>
                        <View style={[styles.legendColorBox, { backgroundColor: color() }]} />
                        <Text style={styles.legendText}>{label}</Text>
                        <Text style={[styles.legendText2, { color: volumeChange > 0 ? '#4CAF50' : volumeChange < 0 ? '#F44336' : 'black' }]}>  
                            {volumeChange !== null && volumeChange !== 0 ? (volumeChange > 0 ? "+" : "") + formatVolumeChange(volumeChange) + (selectedPeriod === 'calories' ? "kcal" : unit === 'g' ? "g" : "oz") : ""}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
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
    container: { backgroundColor: '#222732', borderRadius: 15, paddingVertical: 20, marginBottom: 40 },
    toggleContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 5 },
    toggleButton: { padding: 10, marginHorizontal: 5, backgroundColor: "#333", borderRadius: 10 },
    activeButton: { backgroundColor: "#FFA726" },
    graphTitle: { color: 'white', textAlign: 'center', fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
    toggleText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
    chartStyle: { marginVertical: 10, borderRadius: 16 },
    noDataText: { color: "#fff", textAlign: "center", marginTop: 20, marginBottom: 10 },
    legendContainer: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginBottom: 8 },
    legendColorBox: { width: 15, height: 15, marginRight: 8, borderRadius: 5 },
    legendText: { color: 'white', fontSize: 14 },
    legendText2: { color: 'white', fontSize: 14, fontWeight:'bold', marginLeft: 5 },
});

export default FoodGraph;
