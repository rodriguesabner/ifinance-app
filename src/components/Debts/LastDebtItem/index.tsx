import React, {useEffect, useState} from 'react';
import {Category, Container, Layout, LeftWrapper, TitleTransaction, TypeTransaction} from "./styles";
import {Alert, Text, Vibration, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import {
    convertToPrice,
    disableLoading,
    enableLoading,
    setTransactionsAction,
    setTransactionsChanged
} from "../../../store/reducers/balance";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import Toast from "react-native-root-toast";
import {Receipt} from "phosphor-react-native"
import api from "../../../services/api";
import {TransactionProps} from "../../../interfaces/transaction.interface";
import {deleteTransactionDb} from "../../../database/config.database";
import {DebtProps} from "../../../interfaces/debts.interface";

export interface LastDebtItemProps {
    debts: DebtProps
}

const LastDebtItem = (props: LastDebtItemProps) => {
    const navigation: NavigationProp<any> = useNavigation();

    const dispatch = useDispatch();
    const $balance = useSelector((state: RootState) => state.balance);

    const [totalDebt, setTotalDebt] = useState(0)

    useEffect(() => {
        const total = props.debts.installmentValue * (props.debts.installmentNumbers - props.debts.installmentCurrent);
        setTotalDebt(total)
    }, [props.debts.installmentValue]);

    const renderValue = (value: number) => {
        return `-R$${convertToPrice(value)}`
    }

    const hiddeTitleValue = (title: string): string => {
        if ($balance.hiddeValue) return '*****';

        return title;
    }

    const hiddePriceValue = (value: number): string => {
        if ($balance.hiddeValue) return '*****';

        return renderValue(value);
    }

    function onLongPress(transaction: any) {
        Vibration.vibrate(50);
        Alert.alert(
            'O que deseja fazer?',
            'Você pode editar ou excluir essa transação.',
            [
                {
                    text: 'Editar',
                    onPress: () => navigation.navigate('Transaction', {transaction}),
                },
                {
                    text: 'Excluir',
                    onPress: () => deleteItem(transaction),
                }
            ],
            {
                cancelable: true,
            },
        );
    }

    function deleteItem(transaction: any) {
        Alert.alert(
            'Excluir transação',
            'Tem certeza que deseja excluir essa transação?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    onPress: () => deleteTransaction(transaction),
                }
            ],
            {cancelable: false},
        );
    }

    async function deleteTransaction(transaction: TransactionProps) {
        dispatch(enableLoading());

        if ($balance.isOffline) {
            await deleteTransactionDb(transaction)
        } else {
            await api.delete(`/v1/transactions/${transaction.id}`);
        }

        const result = $balance.transactions.filter((t) => t.id !== transaction.id)

        dispatch(disableLoading());
        dispatch(setTransactionsAction(result));
        dispatch(setTransactionsChanged(true));
        dispatch(setTransactionsChanged(false));
        Toast.show('A transação foi excluída com sucesso!');
    }

    return (
        <View>
            <Layout
                key={props.debts.id}
                onPress={() => !$balance.hiddeValue && navigation.navigate('TransactionDetail', {transaction: transaction})}
                onLongPress={() => !$balance.hiddeValue && onLongPress(props.debts)}
            >
                <LeftWrapper>
                    <Receipt size={20} color={'#000'}/>

                    <Container>
                        <TitleTransaction>{hiddeTitleValue(props.debts.company)}</TitleTransaction>
                        <Category>Parcela: {props.debts.installmentCurrent} de {props.debts.installmentNumbers}</Category>
                    </Container>
                </LeftWrapper>

                <View style={{flexDirection: 'column', alignItems: 'flex-end'}}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: "#000"}}>
                        {hiddePriceValue(props.debts.installmentValue)}
                    </Text>
                    <Text style={{fontSize: 13, color: "#000", opacity: .5}}>
                        {hiddePriceValue(totalDebt)}
                    </Text>
                </View>
            </Layout>
        </View>
    );
};

export default LastDebtItem;
