import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import DefaultHeader from '../../src/screens/common/DefaultHeader';
import { analysisExerciseVolume } from '../../src/apis/AnalysisApi';
import { useDispatch, useSelector } from 'react-redux';

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
    const dispatch = useDispatch();
    const [sampleData, setSampleData] = useState([]);
    const [selectedMain, setSelectedMain] = useState("복근");
    const last7Days = getLast7Days();
    const detailGroups = mainMuscleGroups[selectedMain] || [];
    const memberId = useSelector((state) => state.member?.userInfo?.memberId);

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

    useEffect(() => {
        console.log(sampleData);
    }, [sampleData]);

    const filteredData = sampleData.filter(item => item.main === selectedMain && last7Days.includes(item.date));

    const datasets = detailGroups.map((detail, index) => {
        let lastKnownValue = null;
        let hasValidData = false;
        const dataWithPreviousValues = last7Days.map(date => {
            const entry = filteredData.find(item => item.date === date && item.detail === detail);
            if (entry) {
                lastKnownValue = entry.volume;
                hasValidData = true;
            }
            return hasValidData ? (lastKnownValue !== null ? lastKnownValue : 0) : undefined;
        });
    
        // 수평 직선 데이터를 처리하는 부분
        const isFlatLine = dataWithPreviousValues.every(value => value === dataWithPreviousValues[0]);
    
        // 수평 직선인 경우 strokeWidth를 작게 설정하거나 아예 그리지 않음
        return hasValidData && !isFlatLine ? {
            data: dataWithPreviousValues,
            color: () => colors[index % colors.length],
            strokeWidth: 2,  // 기본 strokeWidth
            detail // detailGroups 정보를 함께 저장
        } : null;  // 직선은 데이터셋에서 제외
    }).filter(Boolean);  // null 값 제거
    
    

    return (
        <>    
            <DefaultHeader title="운동량 그래프" navigation={navigation} />
            <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.graphContainer}>
                    <Text style={styles.graphTitle}>최근 운동량 변화</Text>
                    <LineChart
                        data={{ labels: last7Days, datasets: datasets.length ? datasets : [{ data: Array(7).fill(0) }] }}
                        width={Dimensions.get('window').width - 30}
                        height={220}
                        yAxisSuffix="kg"
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chartStyle}
                    />
                    <View style={styles.legendContainer}>
                        {datasets
                            .filter(({ data }) => data.some(volume => volume > 0)) // 0보다 큰 데이터만 필터링
                            .map(({ color, detail }) => (
                                <View key={detail} style={styles.legendItem}>
                                    <View style={[styles.legendColorBox, { backgroundColor: color() }]} />
                                    <Text style={styles.legendText}>{detail}</Text>
                                </View>
                            ))}
                    </View>

                    <View style={styles.buttonContainer}>
                        {Object.keys(mainMuscleGroups).map(group => (
                            <TouchableOpacity key={group} onPress={() => setSelectedMain(group)} style={[styles.muscleButton, selectedMain === group && styles.selectedButton]}>
                                <Text style={styles.buttonText}>{group}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
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
    color: (opacity = 1) => `rgba(200, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    fillShadowGradientOpacity: 0,
    fillShadowGradientFromOpacity: 0.08,
    fillShadowGradientToOpacity: 0,
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15, backgroundColor: '#1A1C22' },
    graphContainer: { backgroundColor: '#222732', borderRadius: 15, paddingVertical: 20},
    graphTitle: { color: 'white', textAlign: 'center', fontSize: 14, fontWeight: 'bold' },
    chartStyle: { marginVertical: 10, borderRadius: 16 },
    buttonContainer: { flexDirection: "row", flexWrap: "wrap", gap: 5, paddingLeft: 5, marginTop: 5 },
    muscleButton: { paddingVertical: 12, paddingHorizontal: 18, margin: 2, backgroundColor: "#333", borderRadius: 10, borderWidth: 1, borderColor: "#FFA726" },
    selectedButton: { backgroundColor: "#FFA726", borderColor: "#FF8C00", shadowColor: "#FF8C00" },
    buttonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
    legendContainer: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 5 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginBottom: 8 },
    legendColorBox: { width: 15, height: 15, marginRight: 8, borderRadius: 5 },
    legendText: { color: 'white', fontSize: 14 },
});

export default ExerciseVolumeGraph;
