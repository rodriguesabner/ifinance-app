import React from 'react';
import {Layout, Text} from "./styles";
import {NavigationProp, useNavigation} from "@react-navigation/native";

interface MenuItemProps {
    name: string;
}

const MenuItem = (props: MenuItemProps) => {
    const navigation: NavigationProp<any> = useNavigation();

    const goToScreen = () => {
        switch (props.name) {
            case 'Finanças':
                navigation.navigate('Home');
                break;
            case 'Reserva':
                navigation.navigate('Reserve');
                break;
            default:
                navigation.navigate('Home');
                break;
        }
    }

    return (
        <Layout onPress={() => goToScreen()}>
            <Text>{props.name}</Text>
        </Layout>
    );
};

export default MenuItem;
