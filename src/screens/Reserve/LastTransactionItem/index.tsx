import React from 'react';
import {Category, Container, DateTransaction, Layout, LeftWrapper, PayedTick, TitleTransaction} from "./styles";
import {Alert, Text, Vibration, View} from "react-native";
import moment from 'moment';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import {database} from "../../../config/firebase.config";
import {ref, remove} from "firebase/database";
import {convertToPrice, disableLoading, enableLoading} from "../../../store/reducers/balance";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import Toast from "react-native-root-toast";

export interface LastTransactionProps {
    backgroundColor?: string,
    transaction: {
        id: string,
        title: string
        value: number
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
            return `-R$${convertToPrice(props.transaction.value)}`
        }

        return `R$${convertToPrice(props.transaction.value)}`
    }

    const hiddeTitleValue = (): string => {
        if ($balance.hiddeValue) return '*****';

        return props.transaction.title;
    }

    const hiddePriceValue = (): string => {
        if ($balance.hiddeValue) return '*****';

        return renderValue();
    }

    function onLongPress() {
        Vibration.vibrate(50);
        Alert.alert(
            'O que deseja fazer?',
            'Você pode editar ou excluir essa transação.',
            [
                {
                    text: 'Editar',
                    onPress: () => navigation.navigate('Edit', {transaction: props.transaction}),
                },
                {
                    text: 'Excluir',
                    onPress: () => deleteItem(),
                }
            ],
            {
                cancelable: true,
            },
        );
    }

    function deleteItem() {
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
                    onPress: () => deleteTransaction(),
                }
            ],
            {cancelable: false},
        );
    }

    async function deleteTransaction() {
        dispatch(enableLoading());

        const month = moment(props.transaction.date).format('M');
        const year = moment(props.transaction.date).format('YYYY');

        const path = $balance.databaseRef + `${year}/${month}/${props.transaction.id}`;
        await remove(ref(database, path));

        dispatch(disableLoading());
        Toast.show('A transação foi excluída com sucesso!');
    }

    return (
        <Layout
            backgroundColor={props.backgroundColor != null ? props.backgroundColor : $balance.total < 0 ? '#fde5e5' : '#e5fdf5'}
        >
            <View>
                <DateTransaction>{moment(props.transaction.date).format('MMM YY')}</DateTransaction>
                <LeftWrapper>
                    <Container>
                        <TitleTransaction>{hiddeTitleValue()}</TitleTransaction>
                        <Category>Valor reservado</Category>
                    </Container>
                </LeftWrapper>
            </View>

            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{hiddePriceValue()}</Text>
        </Layout>
    );
};

export default LastTransactionItem;
