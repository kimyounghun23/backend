import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export default function App() {
    useEffect(() => {
        // 푸시 알림 권한 요청 및 토큰 등록
        const registerForPushNotifications = async () => {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('알림 권한 허용됨');
                const token = await messaging().getToken();
                console.log('푸시 알림 토큰:', token);

                // 서버에 토큰 전송
                // sendTokenToServer(token);
            } else {
                Alert.alert('알림 권한 없음', '푸시 알림 권한이 필요합니다.');
            }
        };

        registerForPushNotifications();

        // Foreground 상태에서 알림 처리 //        앱이 현재 화면에 표시되고 있는 상태       
        const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
            console.log('Foreground 알림 수신:', remoteMessage);
            Alert.alert('알림 수신', remoteMessage.notification?.body || '알림 내용이 없습니다.');
        });

        // Background 상태에서 알림 클릭 처리   //앱이 백그라운드에서 실행 중인 상태
        const unsubscribeOnNotificationOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log('Background 알림 클릭:', remoteMessage);
            Alert.alert('알림 클릭', '알림 클릭으로 앱이 열렸습니다.');
        });

        // Quit 상태에서 알림 클릭 처리    //앱이 완전히 종료된 상태
        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (remoteMessage) {
                    console.log('Quit 알림 클릭:', remoteMessage);
                    Alert.alert('앱 종료 상태에서 알림 클릭', remoteMessage.notification?.body || '알림 내용이 없습니다.');
                }
            });

        return () => {
            unsubscribeOnMessage();
            unsubscribeOnNotificationOpened();
        };
    }, []);

    return null;
}
