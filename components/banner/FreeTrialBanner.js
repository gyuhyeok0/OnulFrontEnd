import { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { useTranslation } from 'react-i18next';

const FreeTrialBanner = ({ fourWeeksLater }) => {
    const { t } = useTranslation();
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        if (fourWeeksLater) {
            const today = new Date();
            const trialEndDate = new Date(fourWeeksLater);
            const daysUntilEnd = Math.ceil((trialEndDate - today) / (1000 * 60 * 60 * 24)); // 남은 일수 계산

            if (daysUntilEnd <= 5) {
                setShowBanner(true); // 5일 이내면 배너 표시
            }
        }
    }, [fourWeeksLater]);

    if (!showBanner) return null; // 배너를 표시하지 않을 경우 렌더링 안 함
    

    return (
        <View style={{
            backgroundColor: "#6A5ACD",
            paddingVertical: 10,
            paddingHorizontal: 20,
            position: "absolute",
            top: 0,
            width: "100%",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            zIndex: 1000
        }}>
            <Text style={{ fontWeight: "bold", color: "white" }}>
                {t('freeTrialEnds')} {new Date(fourWeeksLater).toLocaleDateString()}
            </Text>

            <Pressable onPress={() => setShowBanner(false)}>
                <Text style={{ fontWeight: "bold", color: "black", marginLeft: 10 }}>X</Text>
            </Pressable>
        </View>
    );
};

export default FreeTrialBanner;
