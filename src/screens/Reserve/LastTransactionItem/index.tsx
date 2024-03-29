import React from 'react';
import {Category, Container, DateTransaction, Layout, LeftWrapper, TitleTransaction} from "./styles";
import {Alert, Text, Vibration, View} from "react-native";
import moment from 'moment';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import {convertToPrice, disableLoading, enableLoading} from "../../../store/reducers/balance";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import Toast from "react-native-root-toast";
import api from "../../../services/api";

export interface LastTransactionProps {
    backgroundColor?: string,
    transaction: {
        id: string,
        name: string
        price: number
        type: string
        category: string,
        date: Date,
        paid: boolean
    }
}

const LastTransactionItem = (props: LastTransactionProps) => {
    const navigation: NavigationProp<any> = useNavigation();

    const dispatch = useDispatch();
    const $balance = useSelector((state: RootState) => state.balance);

    const renderValue = () => {
        if (props.transaction.type === 'outcome') {
            return `-R$${convertToPrice(props.transaction.price)}`
        }

        return `R$${convertToPrice(props.transaction.price)}`
    }

    const hiddeTitleValue = (): string => {
        if ($balance.hiddeValue) return '*****';

        return props.transaction.name;
    }

    const hiddePriceValue = (): string => {
        if ($balance.hiddeValue) return '*****';

        return renderValue();
    }

    function onLongPress(transaction: any) {
        Vibration.vibrate(50);
        Alert.alert(
            'O que deseja fazer?',
            'Você pode editar ou excluir essa transação.',
            [
                {
                    text: 'Editar',
                    onPress: () => navigation.navigate('Edit', {transaction: transaction}),
                },
                {
                    text: 'Excluir',
                    onPress: () => deleteItem(transaction.id),
                }
            ],
            {
                cancelable: true,
            },
        );
    }

    function deleteItem(idTransaction: string) {
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
                    onPress: () => deleteTransaction(idTransaction),
                }
            ],
            {cancelable: false},
        );
    }

    async function deleteTransaction(idTransaction: string) {
        dispatch(enableLoading());

        await api.delete(`/v1/transactions/${idTransaction}`);

        dispatch(disableLoading());
        Toast.show('A transação foi excluída com sucesso!');
    }

    return (
        <Layout>
            <View>
                <DateTransaction>{moment(props.transaction.date).format('MMM YY')}</DateTransaction>
                <LeftWrapper>
                    <Container>
                        <TitleTransaction>{hiddeTitleValue()}</TitleTransaction>
                        <Category>Valor reservado</Category>
                    </Container>
                </LeftWrapper>
            </View>

            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>
                {hiddePriceValue()}
            </Text>
        </Layout>
    );
};

export default LastTransactionItem;
