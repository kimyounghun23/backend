const admin = require('firebase-admin');

// Firebase Admin 초기화
admin.initializeApp({
    credential: admin.credential.cert(require('./service-account-file.json')),
});

// 푸시 알림 전송
const sendPushNotification = async (deviceToken, title, body, data = {}) => {
    const message = {
        token: deviceToken,
        notification: {
            title: title,
            body: body,
        },
        data: data,
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('푸시 알림 전송 성공:', response);
    } catch (error) {
        console.error('푸시 알림 전송 실패:', error.message);
    }
};

sendPushNotification(
    '<DEVICE_TOKEN>',
    '테스트 알림',
    '이것은 테스트 메시지입니다!',
    { key1: 'value1' }
);
