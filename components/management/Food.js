import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,Pressable, Modal } from 'react-native';

const Food = ({ volumeUnit, setVolumeUnit }) => {
    
    const handleUnitChange = () => {
        // 단위 변경 로직 (예: 'ml' <-> 'oz')
        const newUnit = volumeUnit === 'ml' ? 'oz' : 'ml';
        setVolumeUnit(newUnit);
    };

    return (
        
        <>
            <View>
                <Text>Volume Unit: {volumeUnit}</Text>
                <Pressable onPress={handleUnitChange}>
                    <Text>Change Volume Unit</Text>
                </Pressable>
            </View>
        </>
    );
};

const styles = StyleSheet.create({

});

export default Food;
