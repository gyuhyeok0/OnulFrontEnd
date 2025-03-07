import React from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';


const DraggableItem = ({ item, index, activeIndex, translateY, onDragStart, onDragEnd }) => {
    const { t } = useTranslation();

    const handleGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: translateY } }],
        { useNativeDriver: false }
    );

    const handleGestureEnd = () => {
        const itemHeight = 42; // 아이템 높이
        const draggedOffset = Math.round(translateY._value / itemHeight);
        translateY.setValue(0); // 애니메이션 값 초기화
        onDragEnd(index, draggedOffset);
    };

    return (
        <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onBegan={() => onDragStart(index)}
            onEnded={handleGestureEnd}
        >
            <Animated.View
                style={[
                    styles.draggableItem,
                    activeIndex === index && styles.activeItem,
                    { transform: [{ translateY }] }
                ]}
            >
                <View style={styles.decorativeBoxContainer}>
                    <View style={styles.decorativeBox}>
                        {Array.from({ length: 3 }).map((_, rowIndex) => (
                            <View key={rowIndex} style={styles.row}>
                                {Array.from({ length: 4 }).map((_, colIndex) => (
                                    <View
                                        key={colIndex}
                                        style={styles.dot}
                                    />
                                ))}
                            </View>
                        ))}
                    </View>

                    <View style={{width: '70%'}}>
                        <Text style={styles.draggableItemText}>{t(`exerciseNames.${item.exerciseName}.name`, item.exerciseName)}</Text>
                    </View>

                    <View style={[styles.decorativeBox, styles.rightBox]}>
                        {Array.from({ length: 3 }).map((_, rowIndex) => (
                            <View key={rowIndex} style={styles.row}>
                                {Array.from({ length: 4 }).map((_, colIndex) => (
                                    <View
                                        key={colIndex}
                                        style={styles.dot}
                                    />
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            </Animated.View>
        </PanGestureHandler>
    );
};

const styles = StyleSheet.create({
    draggableItem: {
        padding: 3,
        backgroundColor: '#394452',
        minHeight:32,
        marginVertical: 5,
        borderRadius: 8,
    },
    activeItem: {
        opacity: 0.8, // 20% 투명도
        zIndex:10,
    },
    draggableItemText: {
        fontSize: 15,
        fontWeight:'bold',
        color: '#fff',
        textAlign: 'center',
    },
    decorativeBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    decorativeBox: {
        width: '15%',
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 3,
    },
    dot: {
        width: 3.5,
        height: 3.5,
        borderRadius: 4,
        backgroundColor: '#191717',
        marginHorizontal: 2.5,
    },
});

export default DraggableItem;
