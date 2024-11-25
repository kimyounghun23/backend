import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export default function App() {
    useEffect(() => {
        // 푸시 알림 권한 요청 및 토큰 등록
        const registerForPushNotifications = async () => {
            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;

                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus !== 'granted') {
                    Alert.alert('알림 권한 없음', '푸시 알림 권한이 필요합니다.');
                    return;
                }

                const token = (await Notifications.getExpoPushTokenAsync()).data;
                console.log('푸시 알림 토큰:', token);

                // 서버에 토큰 전송
                // sendTokenToServer(token);
            } else {
                Alert.alert('디바이스 필요', '푸시 알림은 실제 디바이스에서만 작동합니다.');
            }
        };

        registerForPushNotifications();

        // Foreground 상태에서 알림 처리
        const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
            console.log('Foreground 알림 수신:', notification);
            Alert.alert('알림 수신', notification.request.content.body);
        });

        // Background 또는 Quit 상태에서 알림 클릭 시 처리
        const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log('Background/Quit 알림 클릭:', response);
            Alert.alert('알림 클릭', '알림 클릭으로 앱이 열렸습니다.');
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
        };
    }, []);

    return null;
}
