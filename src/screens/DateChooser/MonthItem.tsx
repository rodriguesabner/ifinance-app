import React from 'react';
import {Text} from 'react-native';
import {Month} from "./styles";

const MonthItem = ({month}: {month: string}) => {
    return (
        <Month>
            <Text>
                {month}
            </Text>
        </Month>
    );
};

export default MonthItem;
