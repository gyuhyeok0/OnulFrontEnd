import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import Agree from './Agree';

export default function AgreeModal({ visible, onComplete }) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Agree setIsAllAgreed={(isAllAgreed) => {
                        if (isAllAgreed) {
                            onComplete(); // 모든 항목 동의 시 콜백 호출
                        }
                    }} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        padding: 20,
    },
});
