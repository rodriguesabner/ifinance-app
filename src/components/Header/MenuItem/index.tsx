import React from 'react';
import {Layout, Text} from "./styles";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {RootState} from "../../../store/reducers";
import {useDispatch, useSelector} from "react-redux";
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import moment from "moment";
import Toast from "react-native-root-toast";
import {disableLoading, enableLoading} from "../../../store/reducers/balance";

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
