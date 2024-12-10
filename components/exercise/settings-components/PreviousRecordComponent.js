// PreviousRecordComponent.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PreviousRecordComponent = ({ previousRecords }) => (
    <View style={styles.eachInformation}>
        <Text style={styles.exerciseInfoText}>이전 기록</Text>
    </View>
);


const styles = StyleSheet.create({

    eachInformation: {
        minHeight: 60,
        flex: 1,
        // backgroundColor:'gray'
    },
    
    exerciseInfoText:{
        color: 'white'
    },

});

export default PreviousRecordComponent;
