import { API_URL } from '@env';

export const inspection = async () => {
    try {
        const response = await fetch(`${API_URL}/inspection/selectInspection`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {

        const errorMessage = "networkError";
        return errorMessage;
    }
};
