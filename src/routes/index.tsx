import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackRoutes from './stack';

function Routes() {
    return (
        <NavigationContainer>
            <StackRoutes/>
        </NavigationContainer>
    );
}

export {Routes};
