//firebase 푸시 알림 기능 로직 
//Firebase FCM 토큰 기능 정의 
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-your-service-account-key.json');

// Firebase Admin 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const messaging = admin.messaging();

/**
 * 단일 사용자 대상 푸시 알림 전송
 * @param {string} token - FCM 토큰
 * @param {string} title - 알림 제목
 * @param {string} message - 알림 메시지
 */
async function sendPushNotification(token, title, message) {
  const payload = {
    notification: { title, body: message },
    token,
  };

  try {
    const response = await messaging.send(payload);
    console.log('푸시 알림 전송 성공:', response);
    return response;
  } catch (error) {
    console.error('푸시 알림 전송 실패:', error);
    throw error;
  }
}

/**
 * 다중 사용자 대상 푸시 알림 전송
 * @param {string[]} tokens - FCM 토큰 배열
 * @param {string} title - 알림 제목
 * @param {string} message - 알림 메시지
 */
async function sendPushNotificationToMultiple(tokens, title, message) {
  const payload = {
    notification: { title, body: message },
    tokens,
  };

  try {
    const response = await messaging.sendMulticast(payload);
    console.log('다중 푸시 알림 전송 성공:', response);
    if (response.failureCount > 0) {
      console.warn(
        '실패한 토큰 목록:',
        response.responses.filter(r => !r.success).map((r, idx) => tokens[idx])
      );
    }
    return response;
  } catch (error) {
    console.error('다중 푸시 알림 전송 실패:', error);
    throw error;
  }
}

module.exports = { sendPushNotification, sendPushNotificationToMultiple };
