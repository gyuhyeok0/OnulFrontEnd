import React, { useState } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import DefaultHeader from '../common/DefaultHeader';

const DraggableItem = ({ item, index, activeIndex, translateY, onDragStart, onDragEnd }) => {
    const handleGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: translateY } }],
        { useNativeDriver: false }
    );

    const handleGestureEnd = () => {
        translateY.flattenOffset(); // 드래그 애니메이션 값 초기화
        onDragEnd(index, translateY);
    };

    return (
        <PanGestureHandler
            onGestureEvent={handleGestureEvent}
            onBegan={() => onDragStart(index)}
            onEnded={handleGestureEnd}
        >
            <Animated.View
                style={[
                    styles.item,
                    activeIndex === index && styles.activeItem,
                    {
                        transform: [{ translateY }],
                        zIndex: activeIndex === index ? 1 : 0, // 드래그 중 zIndex 설정
                        elevation: activeIndex === index ? 5 : 1, // 안드로이드 지원을 위해 elevation 추가
                        opacity: activeIndex === index ? 0.7 : 1, // 드래그 중 반투명 효과
                    },
                ]}
            >
                <Text style={styles.itemText}>{item}</Text>
            </Animated.View>
        </PanGestureHandler>
    );
};

const Page = ({ navigation }) => {
    const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
    const [activeIndex, setActiveIndex] = useState(null);

    const handleDragStart = (index) => {
        setActiveIndex(index);
    };

    const handleDragEnd = (draggedIndex, translateY) => {
        const itemHeight = 70; // 각 아이템의 높이
        const draggedOffset = Math.round(translateY._value / itemHeight); // 이동한 거리에 따라 새 위치 계산

        translateY.setValue(0); // 애니메이션 값 초기화

        const newIndex = draggedIndex + draggedOffset;

        // 배열 범위를 벗어나지 않도록 제한
        if (newIndex >= 0 && newIndex < items.length && newIndex !== draggedIndex) {
            const updatedItems = [...items];
            const [removedItem] = updatedItems.splice(draggedIndex, 1);
            updatedItems.splice(newIndex, 0, removedItem);

            setItems(updatedItems);
        }
        setActiveIndex(null); // 드래그 완료 후 초기화
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <DefaultHeader title="메뉴" navigation={navigation} />

            <View style={styles.listContainer}>
                <Text style={styles.listTitle}>드래그하여 순서 변경</Text>
                {items.map((item, index) => {
                    const translateY = new Animated.Value(0);

                    return (
                        <DraggableItem
                            key={item}
                            item={item}
                            index={index}
                            activeIndex={activeIndex}
                            translateY={translateY}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        />
                    );
                })}
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
        height: 70, // 아이템 높이
        justifyContent: 'center',
        position: 'relative', // zIndex가 적용되기 위해 설정
    },
    activeItem: {
        backgroundColor: '#e0e0ff', // 드래그 중 스타일
    },
    itemText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
});

export default Page;
