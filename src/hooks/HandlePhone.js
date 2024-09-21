
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