import 'intl-pluralrules';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import DefaultHeader from '../common/DefaultHeader';

const DraggableItem = ({ item, index, onDragStart, onDragEnd, activeIndex }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleGestureEvent = (event) => {
        if (isDragging) {
            onDragEnd(index, event.nativeEvent.translationY);
        }
    };

    return (
        <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onBegan={() => {
                setIsDragging(true);
                onDragStart(index);
            }}
            onEnded={() => {
                setIsDragging(false);
                onDragEnd(index);
            }}
        >
            <View
                style={[
                    styles.item,
                    isDragging && { backgroundColor: '#d3d3d3' }, // 드래그 중 스타일
                    activeIndex === index && { backgroundColor: '#e0e0ff' }, // 현재 활성화된 항목 스타일
                ]}
            >
                <Text style={styles.itemText}>{item}</Text>
            </View>
        </PanGestureHandler>
    );
};

const Page = ({ navigation }) => {
    const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']); // 드래그 가능한 항목
    const [activeIndex, setActiveIndex] = useState(null); // 현재 드래그 중인 항목의 인덱스

    const handleDragStart = (index) => {
        setActiveIndex(index);
    };

    const handleDragEnd = (index, translationY) => {
        if (activeIndex !== null) {
            const newIndex = activeIndex + Math.round(translationY / 50); // 50은 아이템 높이
            if (newIndex >= 0 && newIndex < items.length) {
                const updatedItems = [...items];
                const [removed] = updatedItems.splice(activeIndex, 1);
                updatedItems.splice(newIndex, 0, removed);
                setItems(updatedItems);
            }
        }
        setActiveIndex(null); // 드래그 완료 후 초기화
    };

    useEffect(() => {
        console.log("=====================실험 페이지 ========================");
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <DefaultHeader title="메뉴" navigation={navigation} />

            <View style={styles.listContainer}>
                <Text style={styles.listTitle}>드래그하여 순서 변경</Text>
                {items.map((item, index) => (
                    <DraggableItem
                        key={item}
                        item={item}
                        index={index}
                        activeIndex={activeIndex}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
                ))}
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 20,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginVertical: 5,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
    },
});

export default Page;
