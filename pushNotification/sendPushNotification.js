const admin = require('firebase-admin');

// Firebase Admin SDK 초기화
const serviceAccount = require('./service-account-file.json'); // Firebase 서비스 계정 키 파일

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// 푸시 알림 전송 함수
const sendPushNotification = async (token, title, body, data = {}) => {
    try {
        const message = {
            token: token, // FCM 토큰
            notification: {
                title: title, // 알림 제목
                body: body, // 알림 내용
            },
            data: data, // 추가 데이터 (선택 사항)
        };

        const response = await admin.messaging().send(message);
        console.log('푸시 알림 전송 성공:', response);
    } catch (error) {
        console.error('푸시 알림 전송 실패:', error.message);
    }
};

// 테스트용 호출
const testToken = '사용자_디바이스의_FCM_토큰';
sendPushNotification(
    testToken,
    '테스트 알림',
    '이것은 테스트 메시지입니다!',
    { key: 'value' } // 추가 데이터
);
