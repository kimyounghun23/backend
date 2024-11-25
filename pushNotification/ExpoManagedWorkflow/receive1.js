// React Native (Expo Managed Workflow) 메시지 수신 로직 
import * as Notifications from 'expo-notifications';

// 알림 핸들러 설정
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// 메시지 수신 시 처리
Notifications.addNotificationReceivedListener((notification) => {
    console.log('알림 수신:', notification);
});

Notifications.addNotificationResponseReceivedListener((response) => {
    console.log('사용자가 알림을 클릭했습니다:', response);
});
