// expo-notifications 사용 푸시 토큰 겟 
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const getExpoPushToken = async () => {
    try {
        if (!Device.isDevice) {
            console.warn('푸시 알림은 실제 디바이스에서만 작동합니다.');
            return null;
        }

        // 권한 요청
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

        // 푸시 토큰 가져오기
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo 푸시 토큰:', token);

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'Default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token; // 토큰을 반환하거나 서버로 전송
    } catch (error) {
        console.error('푸시 토큰 가져오기 오류:', error.message);
        return null;
    }
};
