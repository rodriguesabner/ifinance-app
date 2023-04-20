import React from 'react';
import {Container, Layout} from "./styles";
import {Image, Text, TouchableOpacity} from "react-native";
import {disableLoading, enableLoading} from "../../store/reducers/balance";
import Toast from "react-native-root-toast";
import moment from "moment/moment";
import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {NavigationProp, useNavigation} from "@react-navigation/native";

const BottomNavigation = () => {
    const dispatch = useDispatch();
    const $balance = useSelector((state: RootState) => state.balance);
    const navigation: NavigationProp<any> = useNavigation();

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

    return (
        <Layout>
            <Container>
                <TouchableOpacity onPress={() => navigation.navigate('Reserve')}>
                    <Text>
                        <Image source={require('../../assets/piggy-bank.png')} style={{width: 32, height: 32}}/>
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => generateSheet()}>
                    <Text>
                        <Image source={require('../../assets/table.png')} style={{width: 32, height: 32}}/>
                    </Text>
                </TouchableOpacity>
            </Container>
        </Layout>
    );
};

export default BottomNavigation;
