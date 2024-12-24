import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Modal } from 'react-native';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

const LoadingOverlay = ({ visible }) => {
    const isFetching = useIsFetching(); // 전역 fetching 상태
    const isMutating = useIsMutating(); // 전역 mutation 상태

    const [debouncedLoading, setDebouncedLoading] = useState(false); // debounce 상태 관리

    // 로딩 상태 계산
    const isLoading = visible || isFetching > 0 || isMutating > 0;

    // debounce 적용
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedLoading(isLoading);
        }, 200); // 200ms 딜레이 설정

        return () => clearTimeout(timer); // 클린업
    }, [isLoading]);

    return (
        <Modal visible={debouncedLoading} transparent animationType="fade">
            <View style={styles.modalContainer}>
                {debouncedLoading && (
                    <>
                        <ActivityIndicator size="large" color="#ffffff" />
                        <Text style={styles.modalText}>Loading...</Text>
                    </>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.15)', // 반투명 배경
    },
    modalText: {
        color: '#ffffff',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
});

export default LoadingOverlay;
