import React from 'react';
import {Container, Date, Layout, LeftWrapper, TitleTransaction, TypeTransaction} from "./styles";
import {Alert, Text} from "react-native";
import moment from 'moment';
import {useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import {database} from "../../../config/firebase.config";
import {ref, remove} from "firebase/database";

export interface LastTransactionProps {
    backgroundColor?: string,
    transaction: {
        id: string,
        title: string
        value: number
        type: string
        category: {
            name: string,
        },
        date: Date,
    }
}

const LastTransactionItem = (props: LastTransactionProps) => {
    const $balance = useSelector((state: RootState) => state.balance);
    const renderValue = () => {
        if (props.transaction.type === 'outcome') {
            return `-R$${props.transaction.value}`
        }

        return `R$${props.transaction.value}`
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
        const month = moment(props.transaction.date).format('M');
        const year = moment(props.transaction.date).format('YYYY');

        const path = $balance.databaseRef + `${year}/${month}/${props.transaction.id}`;
        console.log(path)
        await remove(ref(database, path));

        Alert.alert(
            'Sucesso',
            'Transação excluída com sucesso!',
        );
    }

    return (
        <Layout
            onLongPress={() => deleteItem()}
            backgroundColor={props.backgroundColor != null ? props.backgroundColor :  $balance.total < 0 ? '#fde5e5' : '#e5fdf5'}
        >
            <LeftWrapper>
                {props.transaction.type === 'income'
                    ? (<TypeTransaction>+</TypeTransaction>)
                    : (<TypeTransaction>-</TypeTransaction>)
                }

                <Container>
                    <TitleTransaction>{props.transaction.title}</TitleTransaction>
                    <Date>{moment(props.transaction.date).format('LL')}</Date>
                </Container>
            </LeftWrapper>

            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{renderValue()}</Text>
        </Layout>
    );
};

export default LastTransactionItem;
