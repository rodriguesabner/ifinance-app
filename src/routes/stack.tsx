import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import ExpenseScreen from "../screens/Expense";
import RevenueScreen from "../screens/Income";
import ReserveScreen from "../screens/Reserve";
import Login from "../screens/Login";
import Edit from "../screens/Edit";
import TransactionDetail from "../screens/TransactionDetail";
import Register from "../screens/Register";

const StackRoutes = createNativeStackNavigator();

function StackNativeRoutes() {
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
            initialRouteName="Login"
        >
            <StackRoutes.Screen name="Login" component={Login}/>
            <StackRoutes.Screen name="Register" component={Register}/>
            <StackRoutes.Screen
                name="Home"
                component={HomeScreen}
            />
            <StackRoutes.Screen
                name="Edit"
                component={Edit}
                options={{
                    animation: 'slide_from_right',
                    presentation: 'modal',
                    statusBarStyle: 'dark',
                    statusBarColor: '#fff'
                }}
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
                name="Expense"
                component={ExpenseScreen}
                options={{
                    animation: 'slide_from_left',
                    presentation: 'modal',
                    statusBarStyle: 'dark',
                    statusBarColor: '#fff'
                }}
            />
            <StackRoutes.Screen
                name="Revenue"
                component={RevenueScreen}
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
        </StackRoutes.Navigator>
    );
}

export default StackNativeRoutes;
