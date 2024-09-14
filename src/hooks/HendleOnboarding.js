import axios from 'axios';

// checkOnboardingStatus 함수는 useEffect 외부에 선언, 매개변수로 userId, accessToken, navigation 전달
export const checkOnboardingStatus = async (userId, accessToken, navigation) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/onboarding/check?memberId=${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // 토큰 추가
                },
            }
        );
        const needsOnboarding = response.data;

        console.log("Onboarding 필요 여부: ", needsOnboarding);

        if (needsOnboarding) {
            console.log("온보딩이 필요합니다.");
            // 온보딩 페이지로 이동
            navigation.navigate('Onboarding');
        } else {
            console.log("온보딩이 필요하지 않습니다.");
        }
    } catch (error) {
        console.error("온보딩 상태 확인 중 오류 발생: ", error);
    }
};