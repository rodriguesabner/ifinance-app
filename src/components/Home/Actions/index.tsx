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
            id: 1,
            name: 'Despesa',
            icon: <Minus color={'#fff'}/>,
            onPress: () => goToScreen('Expense')
        },
        {
            id: 2,
            name: 'Receita',
            icon: <Plus color={'#fff'}/>,
            onPress: () => goToScreen('Revenue')
        },
        {
            id: 3,
            name: 'Reserva',
            icon: <Wallet color={'#fff'}/>,
            onPress: () => goToScreen('Reserve')
        },
        {
            id: 4,
            name: 'Investimentos',
            icon: <Bank color={'#fff'}/>,
            onPress: () => goToScreen('Investments')
        },
        {
            id: 5,
            name: 'Gerar Planilha',
            icon: <Table color={'#fff'}/>,
            onPress: () => generateSheet()
        }
    ]
    const navigation: NavigationProp<any> = useNavigation();

    const goToScreen = (path: string) => {
        navigation.navigate(path, {date: moment(props.date).toISOString()});
    }

    return (
        <Layout>
            <WrapperActions
                data={items}
                renderItem={({item}) => (
                    <ActionItem onPress={item.onPress}>
                        <ActionIcon>{item.icon}</ActionIcon>
                        <ActionText>{item.name}</ActionText>
                    </ActionItem>
                )}
            />
        </Layout>
    );
};

export default Actions;
