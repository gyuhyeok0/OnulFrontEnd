export const handleNext = async (formattedValue, userId, setTimeLeft, setIsTimerRunning) => {
    const isValid = phoneInput.current?.isValidNumber(formattedValue);

    if (!isValid) {
        Alert.alert("유효하지 않은 전화번호", "올바른 전화번호를 입력해 주세요.");
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/sms/verificationAndSend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: formattedValue,
                memberId: userId,
            }),
        });

        const data = await response.json();

        switch (data.status) {
            case 'SUCCESS':
                Alert.alert("성공", "인증번호를 입력해주세요.");
                setTimeLeft(300);
                setIsTimerRunning(true);
                break;
            case 'INVALID_USER_ID':
                Alert.alert("오류", "유효하지 않은 사용자 ID입니다.");
                break;
            case 'PHONE_NOT_REGISTERED':
                Alert.alert("오류", "등록된 휴대전화가 아닙니다.");
                break;
            case 'LIMIT_EXCEEDED':
                Alert.alert("오류", "요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.");
                break;
            case 'DAILY_LIMIT_EXCEEDED':
                Alert.alert("오류", "일일 요청 횟수를 초과했습니다. 내일 다시 시도해 주세요.");
                break;
            default:
                Alert.alert("오류", "인증번호 전송 중 문제가 발생했습니다.");
                break;
        }
    } catch (error) {
        Alert.alert("오류", "서버에 연결할 수 없습니다.");
        console.error('Error:', error);
    }
};


// 인증번호 검증
export const handleVerification = async () => {
    try {
        const response = await fetch('http://localhost:8080/sms/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber: formattedValue,
                code: verificationCode,
            }),
        });

        const data = await response.text();

        if (response.ok) {
            if (data === "Verification successful") {
                Alert.alert("성공", "인증이 완료되었습니다.");
                setIsVerified(true); 
                clearInterval(timerRef.current);
            } else if (data === "Invalid or expired code") {
                Alert.alert("오류", "잘못 입력하셨습니다.");
                setVerificationCode(''); 
            } else {
                Alert.alert("오류", data);
            }
        } else {
            Alert.alert("오류", data || "인증번호 검증 중 문제가 발생했습니다.");
        }
    } catch (error) {
        Alert.alert("오류", "서버에 연결할 수 없습니다.");
    }
};


// 비번찾기
export const fetchUserPhoneNumber = async (userId) => {
    const response = await fetch(`http://localhost:8080/sms/check-id`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data; // { exists: true/false, phoneNumber: 'userPhoneNumber' }
};