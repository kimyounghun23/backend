// 권한 요청 및 알림 전송과 관련된 에러를 처리
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const requestPushNotificationPermissions = async () => {
    try {
        if (!Device.isDevice) {
            console.warn('푸시 알림은 실제 디바이스에서만 작동합니다.');
            return null;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.warn('푸시 알림 권한이 거부되었습니다.');
            return null;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo 푸시 토큰:', token);

        return token;
    } catch (error) {
        console.error('푸시 알림 권한 요청 오류:', error.message);
        return null;
    }
};

export const sendTestNotification = async (token) => {
    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: token,
                title: '테스트 알림',
                body: '이것은 테스트 알림입니다.',
            }),
        });

        if (response.ok) {
            console.log('푸시 알림 전송 성공');
        } else {
            console.error('푸시 알림 전송 실패:', response.statusText);
        }
    } catch (error) {
        console.error('푸시 알림 전송 오류:', error.message);
    }
};
