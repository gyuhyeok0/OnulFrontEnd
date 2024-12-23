import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';

const fetchExerciseData = async () => {
    const response = await fetch('https://example.com/api/exercise');
    if (!response.ok) throw new Error('Failed to fetch exercise data');
    return response.json();
};

const Exercise = () => {
    const [isRetrying, setIsRetrying] = useState(false); // 요청을 반복하는지 여부
    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['exerciseData'],
        queryFn: fetchExerciseData,
        enabled: false, // 처음에는 자동 요청이 실행되지 않도록 설정
        refetchInterval: isRetrying ? 5000 : false, // 데이터가 끊겼을 때 5초마다 요청을 반복
        onError: () => {
            // 데이터 요청 실패 시 로딩 반복 상태로 변경
            setIsRetrying(true);
        },
        onSuccess: () => {
            // 데이터가 정상적으로 돌아오면 로딩 상태 종료
            setIsRetrying(false);
        },
    });

    const handleFetchData = () => {
        refetch(); // 버튼 클릭 시 데이터를 요청하고 로딩 시작
    };

    return (
        <View style={styles.container}>
            <Button title="Fetch Exercise Data" onPress={handleFetchData} />

            {/* 로딩 중일 때 표시 */}
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Loading...</Text>
                </View>
            )}

            {/* 데이터 요청 실패 시 에러 메시지 */}
            {error && !isLoading && (
                <View style={styles.errorContainer}>
                    <Text>Error loading exercise data. Please try again later.</Text>
                </View>
            )}

            {/* 데이터가 성공적으로 요청되면 화면에 표시 */}
            {data && (
                <View style={styles.dataContainer}>
                    <Text>Fetched Data:</Text>
                    <Text>{JSON.stringify(data)}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dataContainer: {
        marginTop: 20,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#e0e0e0',
    },
});

export default Exercise;
