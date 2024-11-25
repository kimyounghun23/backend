// Expo Managed Workflow 사용시
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const requestNotificationPermissions = async () => {
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('푸시 알림 권한이 없습니다.');
            return false;
        }

        console.log('푸시 알림 권한 허용됨');
        return true;
    } else {
        alert('푸시 알림은 실제 디바이스에서만 작동합니다.');
        return false;
    }
};

// 권한 요청 실행
requestNotificationPermissions();
