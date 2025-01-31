import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { WeeklyAndMonthlyExerciseVolume } from '../../src/apis/AnalysisApi';

const WeeklyVolumeGraph = ({ memberId }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('weekly');
    const [weeklyVolume, setWeeklyVolume] = useState([]);
    const [monthlyVolume, setMonthlyVolume] = useState([]);
    const [formattedData, setFormattedData] = useState({ labels: [], datasets: [] });
    
    const colors = ["#55CBF7", "#FA4638", "#39D76A", "#FFDD33", "#B452FF", "#FF8C00"];

    useEffect(() => {
        if (!memberId) return;

        const fetchData = async () => {
            try {
                const response = await WeeklyAndMonthlyExerciseVolume(memberId);
                setWeeklyVolume(response.weeklyVolume);
                setMonthlyVolume(response.monthlyVolume);
            } catch (error) {
                console.error("Error fetching exercise data:", error);
            }
        };
        fetchData();
    }, [memberId]);

    useEffect(() => {
        if (selectedPeriod === 'weekly') {
            processChartData(weeklyVolume, true);
        } else {
            processChartData(monthlyVolume, false);
        }
    }, [selectedPeriod, weeklyVolume, monthlyVolume]);

    const processChartData = (data, isWeekly) => {
        const muscleGroups = {};
        const currentMonth = new Date().getMonth() + 1;
        const labels = isWeekly
            ? ['5주 전', '4주 전', '3주 전', '2주 전', '저번주', '이번주']
            : Array.from({ length: 10 }, (_, i) => ((currentMonth - i + 11) % 12) + 1 + "월").reverse();
    
        data.forEach(({ mainMuscleGroup, startDate, totalVolume }) => {
            if (!muscleGroups[mainMuscleGroup]) {
                muscleGroups[mainMuscleGroup] = Array(labels.length).fill(null);
            }
    
            const entryDate = new Date(startDate[0], startDate[1] - 1, startDate[2]);
            const currentDate = new Date();
            const timeDiff = isWeekly
                ? Math.floor((currentDate - entryDate) / (7 * 24 * 60 * 60 * 1000))
                : currentDate.getMonth() - entryDate.getMonth() + (currentDate.getFullYear() - entryDate.getFullYear()) * 12;
    
            if (timeDiff >= 0 && timeDiff < labels.length) {
                muscleGroups[mainMuscleGroup][labels.length - 1 - timeDiff] = totalVolume;
            }
        });
    
        const datasets = Object.keys(muscleGroups).map((group, index) => {
            let data = muscleGroups[group];
            for (let i = 1; i < data.length; i++) {
                if (data[i] === null) {
                    data[i] = data[i - 1] !== null ? data[i - 1] : 0;
                }
            }
            
            const validData = data.filter(value => value !== null && value !== 0);
            const volumeChange = validData.length > 1 ? validData[validData.length - 1] - validData[0] : null; // 0과 null 제외 후 계산
            
            return {
                key: `${group}-${index}`,  // ✅ 올바르게 key 추가
                data,
                color: (opacity = 1) => colors[index % colors.length],
                strokeWidth: 2,
                label: group,
                volumeChange
            };
        });
    
    
        setFormattedData({
            labels,
            datasets: datasets.length > 0 ? datasets : [{ data: Array(labels.length).fill(0), color: () => `rgba(255,255,255,1)`, strokeWidth: 2 }]
        });
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.graphTitle}>기간별 운동량 통계</Text>
            <LineChart
                data={formattedData.datasets.length > 0 ? formattedData : { labels: [], datasets: [{ data: [0] }] }}
                width={Dimensions.get('window').width - 30}
                height={220}
                yAxisSuffix="kg"
                chartConfig={chartConfig}
                bezier
                style={styles.chartStyle}
            />
            <View style={styles.toggleContainer}>
                <TouchableOpacity onPress={() => setSelectedPeriod('weekly')} style={[styles.toggleButton, selectedPeriod === 'weekly' && styles.activeButton]}>
                    <Text style={styles.toggleText}>주별</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedPeriod('monthly')} style={[styles.toggleButton, selectedPeriod === 'monthly' && styles.activeButton]}>
                    <Text style={styles.toggleText}>월별</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.legendContainer}>

            {formattedData.datasets.map(({ color, label, volumeChange }, index) => (
                        <View key={`${label}-${index}`} style={styles.legendItem}>

                        <View style={[styles.legendColorBox, { backgroundColor: color() }]} />
                        <Text style={styles.legendText}>{label}</Text>

                        <Text style={[styles.legendText2, { color: volumeChange > 0 ? '#4CAF50' : volumeChange < 0 ? '#F44336' : 'black' }]}>
                            {volumeChange !== null && volumeChange !== 0 ? (volumeChange > 0 ? "+" : "") + volumeChange + "kg" : ""}
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
    graphTitle: { color: 'white', textAlign: 'center', fontSize: 14, fontWeight: 'bold', marginBottom:5 },
    toggleText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
    chartStyle: { marginVertical: 10, borderRadius: 16 },
    legendContainer: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginBottom: 8 },
    legendColorBox: { width: 15, height: 15, marginRight: 8, borderRadius: 5 },
    legendText: { color: 'white', fontSize: 14 },
    legendText2: { color: 'white', fontSize: 14, fontWeight:'bold', marginLeft: 5 },

});

export default WeeklyVolumeGraph;
