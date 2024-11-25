// React Native (Bare Workflow) 메시지 수신 로직 
import messaging from '@react-native-firebase/messaging';

// 알림 수신 시 처리
messaging().onMessage(async (remoteMessage) => {
    console.log('포그라운드 메시지 수신:', remoteMessage);
});

// 알림 클릭 시 처리
messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log('알림 클릭으로 앱 열림:', remoteMessage);
});

// 앱 종료 상태에서 알림 클릭 시 처리
messaging().getInitialNotification().then((remoteMessage) => {
    if (remoteMessage) {
        console.log('앱 종료 상태에서 알림 클릭:', remoteMessage);
    }
});
