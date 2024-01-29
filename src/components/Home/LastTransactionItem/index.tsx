import React from 'react';
import {
    Category,
    Container,
    DateTransactions,
    Layout,
    LeftWrapper,
    PayedTick,
    TitleTransaction,
    TypeTransaction
} from "./styles";
import {Alert, Text, Vibration, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import {convertToPrice, disableLoading, enableLoading} from "../../../store/reducers/balance";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import Toast from "react-native-root-toast";
import {Bank, Coin, Money, Receipt} from "phosphor-react-native"
import api from "../../../services/api";

export interface LastTransactionProps {
    backgroundColor?: string,
    transaction: {
        date: string,
        values: [{
            id: string,
            name: string
            price: number
            type: string
            category: string,
            date: Date,
            paid: boolean
        }]
    }
}

const LastTransactionItem = (props: LastTransactionProps) => {
    const navigation: NavigationProp<any> = useNavigation();

    const dispatch = useDispatch();
    const $balance = useSelector((state: RootState) => state.balance);

    const renderValue = (type: string, value: number) => {
        if (type === 'outcome') {
            return `-R$${convertToPrice(value)}`
        }

        return `R$${convertToPrice(value)}`
    }

    const hiddeTitleValue = (title: string): string => {
        if ($balance.hiddeValue) return '*****';

        return title;
    }

    const hiddePriceValue = (type: string, value: number): string => {
        if ($balance.hiddeValue) return '*****';

        return renderValue(type, value);
    }

    function onLongPress(transaction: any) {
        Vibration.vibrate(50);
        Alert.alert(
            'O que deseja fazer?',
            'Você pode editar ou excluir essa transação.',
            [
                {
                    text: 'Editar',
                    onPress: () => navigation.navigate('Edit', {transaction}),
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

    async function deleteTransaction(transaction: any) {
        dispatch(enableLoading());

        await api.delete(`/v1/transactions/${transaction.id}`);

        dispatch(disableLoading());
        Toast.show('A transação foi excluída com sucesso!');
    }

    const RenderIcon = ({category, type, paid}: { category: string, type: string, paid: boolean }): JSX.Element => {
        if (paid) {
            if (category === 'Reserva') {
                return (
                    <PayedTick backgroundColor={'rgba(178,232,197,0.5)'}>
                        <Bank size={20} color={'#3f694b'}/>
                    </PayedTick>
                )
            }

            return (
                <PayedTick backgroundColor={'rgba(178,232,197,0.5)'}>
                    <Coin size={20} color={'#0d2514'}/>
                </PayedTick>
            )
        }

        if (category === 'Reserva') {
            return (
                <PayedTick backgroundColor={"#9fe771"}>
                    <Bank size={20} color={'#1e5b02'}/>
                </PayedTick>
            )
        }

        return (
            type === 'income'
                ? <PayedTick backgroundColor={'rgba(178,224,232,0.5)'}><Money size={20} color={'#000'}/></PayedTick>
                : <PayedTick><Receipt size={20} color={'#000'}/></PayedTick>
        )
    }

    const RenderTypeTransaction = ({category, type, paid}: {
        category: string,
        type: string,
        paid: boolean
    }): JSX.Element | null => {
        if (type === 'income') {
            if (category === 'Saldo Conta') {
                return null;
            }

            return <TypeTransaction>Transferência Recebida</TypeTransaction>
        }

        if (type === 'outcome') {
            if (category === 'Saldo Conta') {
                return null;
            }

            if (paid) {
                return <TypeTransaction>Transferência Enviada (Pago)</TypeTransaction>
            }

            return <TypeTransaction>Transferência Enviada</TypeTransaction>
        }

        return null;
    }

    return (
        <View>
            <DateTransactions>
                {props.transaction.date}
            </DateTransactions>

            {props.transaction.values.map((transaction) => (
                <Layout
                    key={transaction.id}
                    onPress={() => !$balance.hiddeValue && navigation.navigate('TransactionDetail', {transaction: transaction})}
                    onLongPress={() => !$balance.hiddeValue && onLongPress(transaction)}
                >
                    <LeftWrapper>
                        <RenderIcon type={transaction.type} paid={transaction.paid} category={transaction.category}/>

                        <Container>
                            <RenderTypeTransaction type={transaction.type} paid={transaction.paid}
                                                   category={transaction.category}/>
                            <TitleTransaction>{hiddeTitleValue(transaction.name)}</TitleTransaction>
                            <Category>{transaction.category}</Category>
                        </Container>
                    </LeftWrapper>

                    <Text style={{fontSize: 16, fontWeight: 'bold', color: "#000"}}>
                        {hiddePriceValue(transaction.type, transaction.price)}
                    </Text>
                </Layout>
            ))}
        </View>
    );
};

export default LastTransactionItem;
