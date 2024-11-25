//React Native    Bare Workflow로 전환할시 
import messaging from '@react-native-firebase/messaging';

const requestNotificationPermissions = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('푸시 알림 권한 허용됨:', authStatus);
        return true;
    } else {
        console.log('푸시 알림 권한 거부됨:', authStatus);
        return false;
    }
};

// 권한 요청 실행
requestNotificationPermissions();
