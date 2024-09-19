import axios from 'axios';

// 온보딩 상태 확인 함수
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
            // console.log("온보딩이 필요합니다.");
            // 온보딩 페이지로 이동
            navigation.navigate('Onboarding');
        } else {
            console.log("온보딩이 필요하지 않습니다.");
        }
    } catch (error) {
        console.error("온보딩 상태 확인 중 오류 발생: ", error);
    }
};

// 무게 변환 함수
const convertToKg = (weight) => {
    if (weight && typeof weight === 'object') {
        if (weight.kg) return { kg: parseFloat(weight.kg) }; // kg로 주어진 경우 그대로 반환
        if (weight.lbs) return { kg: parseFloat((weight.lbs * 0.453592).toFixed(2)) }; // lbs -> kg 변환
    }
    if (typeof weight === 'number') {
        return { kg: parseFloat(weight) }; // 이미 kg이면 반환
    }
    throw new Error('Invalid weight format'); // 예상치 못한 형식일 경우 오류 발생
};

// 높이 변환 함수
const convertToCm = (height) => {
    if (height && typeof height === 'object') {
        if (height.cm) return { cm: parseFloat(height.cm) }; // cm로 주어진 경우 그대로 반환
        if (height.feet && height.inches) {
            const feetToCm = height.feet * 30.48;
            const inchesToCm = height.inches * 2.54;
            return { cm: parseFloat((feetToCm + inchesToCm).toFixed(2)) }; // feet와 inches -> cm 변환
        }
    }
    if (typeof height === 'number') {
        return { cm: parseFloat(height.toFixed(2)) }; // 이미 cm이면 반환
    }
    throw new Error('Invalid height format'); // 예상치 못한 형식일 경우 오류 발생
};

// 온보딩 등록 함수
export const registrationOnboarding = async (onboardingData, navigation) => {
    const { memberId, accessToken, gender, height, weight, benchPress1rm, deadlift1rm, squat1rm, heightUnit, weightUnit, basicUnit } = onboardingData;

    // 단위 변환 적용
    const { cm: convertedHeight } = convertToCm(height);
    const { kg: convertedWeight } = convertToKg(weight);

    console.log("변환된 높이:", convertedHeight);
    console.log("변환된 무게:", convertedWeight);

    // 서버에 보낼 데이터 객체 생성
    const dataToSend = {
        memberId,
        accessToken,
        gender,
        height: convertedHeight,
        weight: convertedWeight,
        benchPress1rm,
        deadlift1rm,
        squat1rm,
        heightUnit,
        weightUnit,
        basicUnit,
    };

    // 서버에 데이터 전송 예시
    try {
        const response = await axios.post('http://localhost:8080/onboarding/register', dataToSend, {
            headers: {
                Authorization: `Bearer ${accessToken}`, // 토큰 추가
            },
        });
        // console.log("온보딩 등록 응답:", response.data);

        navigation.navigate('Exercise');
    } catch (error) {
        console.error("온보딩 등록 중 오류 발생:", error);
    }
};
