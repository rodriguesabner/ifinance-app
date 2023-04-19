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
    const dispatch = useDispatch();
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
            case 'Gerar Planilha':
                generateSheet();
                break;
            default:
                navigation.navigate('Home');
                break;
        }
    }

    const generateSheet = () => {
        dispatch(enableLoading());

        Toast.show('Gerando planilha do mês de ' + moment().format('MMMM-y'));

        const wb = XLSX.utils.book_new();
        const transactions = $balance.transactions.map((transaction) => ({
            title: transaction.title,
            value: transaction.value,
            category: transaction.category,
            date: moment(transaction.date).format('DD/MM/YYYY'),
            type: transaction.type === 'income' ? 'Entrada' : 'Saída',
            paid: transaction.type === 'outcome' ? transaction.paid ? 'Pago' : 'Não pago' : 'Não se aplica',
        }));

        const ws = XLSX.utils.json_to_sheet(transactions);
        XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');

        const base64 = XLSX.write(wb, {bookType: 'xlsx', type: 'base64'});
        const monthYear = moment().format('MMM-y');
        const filename = FileSystem.documentDirectory + `Financas-${monthYear}.xlsx`;

        dispatch(disableLoading())

        FileSystem
            .writeAsStringAsync(filename, base64, {encoding: FileSystem.EncodingType.Base64})
            .then(() => Sharing.shareAsync(filename));
    }

    return (
        <Layout onPress={() => goToScreen()}>
            <Text>{props.name}</Text>
        </Layout>
    );
};

export default MenuItem;
