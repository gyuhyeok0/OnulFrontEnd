import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import DefaultHeader from '../../../src/screens/common/DefaultHeader';
import { analysisExerciseVolume } from '../../../src/apis/AnalysisApi';
import { useDispatch, useSelector } from 'react-redux';
import WeeklyVolumeGraph from './WeeklyVolumeGraph';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage 임포트
import { useTranslation } from 'react-i18next';

const mainMuscleGroups = {
    "등": ["광배근", "승모근", "하부 등"],
    "가슴": ["대흉근", "상부 가슴", "중간 가슴", "하부 가슴"],
    "하체": ["둔근", "대퇴사두근", "외측 대퇴사두근", "내측 대퇴사두근", "햄스트링", "종아리"],
    "팔": ["이두근", "삼두근", "전완근"],
    "어깨": ["전면 삼각근", "측면 삼각근", "후면 삼각근", "회전근개"],
    "복근": ["복직근", "하복부", "측면 복근"],
};

const colors = ["#55CBF7", "#FA4638", "#39D76A", "#FFDD33", "#B452FF", "#FF8C00"];

const getLast7Days = () => {

    const today = new Date();
    today.setDate(today.getDate() - 1); // 어제로 설정

    return Array.from({ length: 7 }, (_, i) => {
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - (6 - i));
        return pastDate.getDate().toString().padStart(2, '0');
    });
};

const ExerciseVolumeGraph = ({ navigation }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const [sampleData, setSampleData] = useState([]);
    const [selectedMain, setSelectedMain] = useState("등");
    const last7Days = getLast7Days();
    const detailGroups = mainMuscleGroups[selectedMain] || [];
    const memberId = useSelector((state) => state.member?.userInfo?.memberId);
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
        const fetchData = async () => {
            try {
                const response = await analysisExerciseVolume(memberId);
                const records = response.records;
                const dates = response.dates;

                const transformedData = [];

                Object.keys(records).forEach(key => {
                    const [main, detail] = key.split(", ").map(item => item.split("=")[1]);
                    records[key].forEach((volume, index) => {
                        if (volume !== null) {
                            const date = dates[index].split("-")[2].padStart(2, '0');
                            transformedData.push({ date, main, detail, volume });
                        }
                    });
                });
                setSampleData(transformedData);
            } catch (error) {
                console.error("Error fetching exercise data:", error);
            }
        };
        fetchData();
    }, [memberId]);

    // kg에서 lbs로 변환하는 함수
    const convertToLbs = (kg) => {
        return kg * 2.20462; // kg -> lbs 변환
    };

    const filteredData = sampleData.filter(item => item.main === selectedMain && last7Days.includes(item.date));

    const datasets = detailGroups.map((detail, index) => {
        let lastKnownValue = null;
        let hasValidData = false;
        let volumeChange = 0;
    
        const dataWithPreviousValues = last7Days.map(date => {
            const entry = filteredData.find(item => item.date === date && item.detail === detail);
            if (entry) {
                if (lastKnownValue !== null) {
                    volumeChange = entry.volume - lastKnownValue; // 운동량 변화 계산
                }
                lastKnownValue = entry.volume;
                hasValidData = true;
            }
            return hasValidData ? (lastKnownValue !== null ? lastKnownValue : 0) : undefined;
        });

        // weightUnit이 'lbs'이면 데이터를 변환
        if (weightUnit === 'lbs') {
            return hasValidData && dataWithPreviousValues.every(value => value !== undefined) ? {
                data: dataWithPreviousValues.map(value => convertToLbs(value)), // lbs로 변환
                color: () => colors[index % colors.length],
                strokeWidth: 2,
                detail,
                volumeChange
            } : null;
        }

        return hasValidData && !dataWithPreviousValues.every(value => value === dataWithPreviousValues[0]) ? {
            data: dataWithPreviousValues,
            color: () => colors[index % colors.length],
            strokeWidth: 2,
            detail,
            volumeChange
        } : null;
    }).filter(Boolean);

    return (
        <>
            <DefaultHeader title={t('exerciseVolumeGraph.title')} navigation={navigation} />
            <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.graphContainer}>
                    <Text style={styles.graphTitle}>{t('exerciseVolumeGraph.recentVolumeChange')}</Text>
                    <LineChart
                        data={{ labels: last7Days, datasets: datasets.length ? datasets : [{ data: Array(7).fill(0) }] }}
                        width={Dimensions.get('window').width - 30}
                        height={220}
                        yAxisSuffix={weightUnit === 'lbs' ? "lbs" : "kg"} // 단위 표시
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chartStyle}
                    />
                
                <View style={styles.legendContainer}>
                    {datasets
                        .filter(({ data }) => data.some(volume => volume > 0))
                        .map(({ color, detail, volumeChange }) => (
                            <View key={detail} style={styles.legendItem}>
                                <View style={[styles.legendColorBox, { backgroundColor: color() }]} />
                                <Text style={styles.legendText}>{t(`muscleGroups.${detail}`)}</Text>

                                <Text style={[styles.legendText2, { color: volumeChange > 0 ? '#4CAF50' : volumeChange < 0 ? '#F44336' : 'black' }]}>
                                    {volumeChange !== 0 ? 
                                        (volumeChange > 0 ? "+" : "") + 
                                        (weightUnit === 'lbs' 
                                            ? (convertToLbs(volumeChange).toFixed(2).replace(/\.00$/, ''))  // lbs일 때 .00 제외
                                            : volumeChange.toFixed(2).replace(/\.00$/, '')  // kg일 때 .00 제외
                                        ) + 
                                        (weightUnit === 'lbs' ? "lbs" : "kg") 
                                    : ""}
                                </Text>

                            </View>
                        ))}
                </View>


                    <View style={styles.buttonContainer}>
                        {Object.keys(mainMuscleGroups).map(group => (
                            <TouchableOpacity key={group} onPress={() => setSelectedMain(group)} style={[styles.muscleButton, selectedMain === group && styles.selectedButton]}>
                                <Text style={styles.buttonText}>{t(`exerciseVolumeGraph.${group}`)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <WeeklyVolumeGraph memberId={memberId} weightUnit={weightUnit} />

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
    graphContainer: { backgroundColor: '#222732', borderRadius: 15, paddingVertical: 20, marginBottom: 40},
    graphTitle: { color: 'white', textAlign: 'center', fontSize: 14, fontWeight: 'bold', marginBottom:5 },
    chartStyle: { marginVertical: 10, borderRadius: 16 },
    buttonContainer: { flexDirection: "row", flexWrap: "wrap", gap: 5, paddingLeft: 5, marginTop: 5 },
    muscleButton: { paddingVertical: 10, paddingHorizontal: 15, margin: 2, backgroundColor: "#333", borderRadius: 10, borderColor: "#FFA726" },
    selectedButton: { backgroundColor: "#FFA726", borderColor: "#FF8C00", shadowColor: "#FF8C00" },
    buttonText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
    legendContainer: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 2 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginBottom: 8 },
    legendColorBox: { width: 15, height: 15, marginRight: 8, borderRadius: 5 },
    legendText: { color: 'white', fontSize: 14 },
    legendText2: { fontSize: 14, fontWeight: 'bold', marginLeft: 5 },
});

export default ExerciseVolumeGraph;
