import { useRef, useMemo, useCallback } from 'react';
import { Animated } from 'react-native';

export const useBoxAnimations = () => {
    const activeAnimation = useRef(null);

    // 애니메이션 값 초기화
    const oneWeekAnimations = useMemo(() => [...Array(7)].map(() => new Animated.Value(0)), []);
    const twoWeekAnimations = useMemo(() => [...Array(7)].map(() => new Animated.Value(0)), []);

    // 애니메이션 시작
    const startAnimating = useCallback((animation, weekType) => {
        activeAnimation.current = Animated.loop(
        Animated.sequence([
            Animated.timing(animation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
            }),
            Animated.timing(animation, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
            }),
        ])
        );
        activeAnimation.current.start();
    }, []);

    // 애니메이션 정지
    const stopAnimating = useCallback(() => {
        oneWeekAnimations.forEach(anim => anim.setValue(0));
        twoWeekAnimations.forEach(anim => anim.setValue(0));
        if (activeAnimation.current) {
        activeAnimation.current.stop();
        }
    }, [oneWeekAnimations, twoWeekAnimations]);

    return {
        oneWeekAnimations,
        twoWeekAnimations,
        startAnimating,
        stopAnimating
    };
};
