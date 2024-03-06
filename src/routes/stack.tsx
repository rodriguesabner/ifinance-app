import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import ReserveScreen from "../screens/Reserve";
import Login from "../screens/Login";
import TransactionDetail from "../screens/TransactionDetail";
import Register from "../screens/Register";
import TransactionScreen from "../screens/Transaction";
import {useSelector} from "react-redux";
import {RootState} from "../store/reducers";
import DateChooser from "../screens/DateChooser";
import Debts from "../screens/Debts";

const StackRoutes = createNativeStackNavigator();

function StackNativeRoutes() {
    const $balance = useSelector((state: RootState) => state.balance);

    return (
        <StackRoutes.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'none',
                navigationBarHidden: true,
                contentStyle: {
                    backgroundColor: 'transparent',
                },
            }}
            initialRouteName={$balance.isOffline ? "Home" : "Login"}
        >
            <StackRoutes.Screen name="Login" component={Login}/>
            <StackRoutes.Screen name="Register" component={Register}/>
            <StackRoutes.Screen
                name="Home"
                component={HomeScreen}
            />
            <StackRoutes.Screen
                name="Reserve"
                component={ReserveScreen}
                options={{
                    animation: 'slide_from_bottom',
                    presentation: 'modal',
                    statusBarStyle: 'dark',
                    statusBarColor: '#fff'
                }}
            />
            <StackRoutes.Screen
                name="Transaction"
                component={TransactionScreen}
                options={{
                    animation: 'slide_from_right',
                    presentation: 'modal',
                    statusBarStyle: 'dark',
                    statusBarColor: '#fff'
                }}
            />
            <StackRoutes.Screen
                name="TransactionDetail"
                component={TransactionDetail}
                options={{
                    animation: 'slide_from_bottom',
                    presentation: 'modal',
                    statusBarStyle: 'dark',
                    statusBarColor: '#fff',
                }}
            />
            <StackRoutes.Screen
                name="DateChooser"
                component={DateChooser}
                options={{
                    animation: 'slide_from_bottom',
                    presentation: 'modal',
                    statusBarStyle: 'dark',
                    statusBarColor: '#fff',
                }}
            />
            <StackRoutes.Screen
                name="Debts"
                component={Debts}
                options={{
                    animation: 'slide_from_left',
                }}
            />
        </StackRoutes.Navigator>
    );
}

export default StackNativeRoutes;
