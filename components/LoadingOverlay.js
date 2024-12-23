import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Modal, Button } from 'react-native';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';

const LoadingOverlay = ({ visible, errorMessage, onRetry }) => {
  const isFetching = useIsFetching(); // 전역 fetching 상태
  const isMutating = useIsMutating(); // 전역 mutation 상태

  const isLoading = visible || isFetching > 0 || isMutating > 0; // 로딩 상태

    return (
        <Modal visible={isLoading} transparent animationType="fade">
            <View style={styles.modalContainer}>
                {isLoading && !errorMessage && (
                <>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={styles.modalText}>Loading...</Text>
                </>
                )}
                {errorMessage && (
                <>
                    <Text style={styles.modalText}>{errorMessage}</Text>
                    {onRetry && <Button title="Retry" onPress={onRetry} />}
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // 반투명 배경
    },
    modalText: {
        color: '#ffffff',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
});

export default LoadingOverlay;
