// @react-native-firebase/messaging을 사용하여 푸시 토큰겟

import messaging from '@react-native-firebase/messaging';

export const getFirebasePushToken = async () => {
    try {
        // 권한 요청
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
            console.warn('푸시 알림 권한이 거부되었습니다.');
            return null;
        }

        // 푸시 토큰 가져오기
        const token = await messaging().getToken();
        console.log('Firebase 푸시 토큰:', token);

        return token; // 토큰을 반환하거나 서버로 전송
    } catch (error) {
        console.error('푸시 토큰 가져오기 오류:', error.message);
        return null;
    }
};
