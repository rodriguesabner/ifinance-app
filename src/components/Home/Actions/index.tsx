import React from 'react';
import {ActionIcon, ActionItem, ActionText, Layout, WrapperActions} from "./styles";
import {FlatList} from "react-native";
import moment from "moment/moment";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {Bank, Minus, Plus, Table, Wallet} from "phosphor-react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import {disableLoading, enableLoading} from "../../../store/reducers/balance";
import Toast from "react-native-root-toast";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

interface ActionsProps {
    date: Date;
}

const Actions = (props: ActionsProps) => {
    const dispatch = useDispatch();
    const $balance = useSelector((state: RootState) => state.balance);

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
        XLSX.utils.book_append_sheet(wb, ws, 'Finanças - ' + moment().format('MMMM-y'));

        const base64 = XLSX.write(wb, {bookType: 'xlsx', type: 'base64'});
        const monthYear = moment().format('MMM-y');
        const filename = FileSystem.documentDirectory + `Financas-${monthYear}.xlsx`;

        dispatch(disableLoading())

        FileSystem
            .writeAsStringAsync(filename, base64, {encoding: FileSystem.EncodingType.Base64})
            .then(() => Sharing.shareAsync(filename));
    }

    const items = [
        {
            id: 2,
            name: 'Receita',
            icon: <Plus size={20} color={'#1e5b02'}/>,
            onPress: () => goToScreen('Transaction', 'income'),
            backgroundColor: "#9fe771"
        },
        {
            id: 1,
            name: 'Despesa',
            icon: <Minus size={20} color={'#1e5b02'}/>,
            onPress: () => goToScreen('Transaction', 'outcome')
        },
        {
            id: 3,
            name: 'Reserva',
            icon: <Wallet size={20} color={'#1e5b02'}/>,
            onPress: () => goToScreen('Reserve')
        },
        {
            id: 5,
            name: 'Gerar Planilha',
            icon: <Table size={20} color={'#1e5b02'}/>,
            onPress: () => generateSheet()
        }
    ]
    const navigation: NavigationProp<any> = useNavigation();

    const goToScreen = (path: string, type?: string) => {
        const propsNavigation = {};

        if(type === 'outcome' || type === 'income') {
            Object.assign(propsNavigation, {
                date: moment(props.date).toISOString(),
                type: type.toLowerCase()
            })

            navigation.navigate(path, propsNavigation);
            return;
        }

        navigation.navigate(path);
    }

    return (
        <Layout>
            <WrapperActions
                data={items}
                renderItem={({item}: {item: any}) => (
                    <ActionItem backgroundColor={item.backgroundColor} onPress={item.onPress}>
                        <ActionIcon>{item.icon}</ActionIcon>
                        <ActionText>{item.name}</ActionText>
                    </ActionItem>
                )}
            />
        </Layout>
    );
};

export default Actions;
