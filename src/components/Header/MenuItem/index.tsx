import React from 'react';
import {Layout, Text} from "./styles";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {RootState} from "../../../store/reducers";
import {useSelector} from "react-redux";

interface MenuItemProps {
    name: string;
}

const MenuItem = (props: MenuItemProps) => {
    const $balance = useSelector((state: RootState) => state.balance);
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
