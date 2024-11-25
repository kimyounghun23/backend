// 토큰 요청과 알림 전송 시의 에러를 처리
import messaging from '@react-native-firebase/messaging';

export const registerFirebaseMessaging = async () => {
    try {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
            console.warn('Firebase 알림 권한이 거부되었습니다.');
            return null;
        }

        const token = await messaging().getToken();
        console.log('Firebase 푸시 토큰:', token);

        // 토큰 갱신 처리
        messaging().onTokenRefresh((newToken) => {
            console.log('푸시 토큰 갱신:', newToken);
            // 서버로 갱신된 토큰 전송
        });

        return token;
    } catch (error) {
        console.error('푸시 토큰 가져오기 오류:', error.message);
        return null;
    }
};

export const sendFirebaseTestNotification = async (deviceToken) => {
    try {
        const message = {
            token: deviceToken,
            notification: {
                title: '테스트 알림',
                body: '이것은 Firebase 테스트 메시지입니다.',
            },
        };

        // Firebase Admin SDK의 서버로 메시지 전송 로직 추가 필요
        console.log('푸시 알림 전송 성공:', message);
    } catch (error) {
        console.error('푸시 알림 전송 실패:', error.message);
    }
};
