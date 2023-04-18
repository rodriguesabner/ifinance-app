import {View} from 'react-native';
import {Suspense, useEffect, useRef, useState} from "react";
import {Routes} from "./src/routes";
import {Provider} from "react-redux";
import store from "./src/store";
import {Layout} from "./src/styles";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { RootSiblingParent } from 'react-native-root-siblings';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener: any = useRef();
    const responseListener: any = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then((token: any) => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    return (
        <Suspense fallback={<View/>}>
            <Provider store={store}>
                <RootSiblingParent>
                    <Layout>
                        <Routes/>
                    </Layout>
                </RootSiblingParent>
            </Provider>
        </Suspense>
    );
}
