import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import ExpenseScreen from "../screens/Expense";
import RevenueScreen from "../screens/Revenue";
import ReserveScreen from "../screens/Reserve";
import OnBoarding from "../screens/OnBoarding";
import Edit from "../screens/Edit";

const StackRoutes = createNativeStackNavigator();

function StackNativeRoutes() {
    return (
        <StackRoutes.Navigator
            screenOptions={{
                headerShown: false,
                animation: 'none',
                contentStyle: {
                    backgroundColor: 'transparent',
                }
            }}
            initialRouteName="OnBoarding"
        >
            <StackRoutes.Screen name="OnBoarding" component={OnBoarding}/>
            <StackRoutes.Screen name="Home" component={HomeScreen}/>
            <StackRoutes.Screen
                name="Edit"
                component={Edit}
                options={{
                    animation: 'slide_from_right',
                    presentation: 'modal',
                }}
            />
            <StackRoutes.Screen
                name="Reserve"
                component={ReserveScreen}
                options={{
                    animation: 'slide_from_right',
                    presentation: 'modal',
                }}
            />
            <StackRoutes.Screen
                name="Expense"
                component={ExpenseScreen}
                options={{
                    animation: 'slide_from_right',
                    presentation: 'modal',
                }}
            />
            <StackRoutes.Screen
                name="Revenue"
                component={RevenueScreen}
                options={{
                    animation: 'slide_from_right',
                    presentation: 'modal',
                }}
            />
        </StackRoutes.Navigator>
    );
}

export default StackNativeRoutes;
