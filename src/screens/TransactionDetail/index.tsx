import React, {useEffect, useState} from 'react';
import {Alert, Image, Text, TouchableOpacity, View, ViewStyle} from "react-native";
import moment from "moment/moment";
import {NavigationProp, RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {
    Category,
    DateText,
    Label,
    Layout,
    Price,
    Title,
    WrapperDetail,
    WrapperPaidTransaction,
    WrapperView
} from "./styles";
import {
    convertToPrice,
    disableLoading,
    enableLoading,
    setTransactionsAction,
    setTransactionsChanged
} from "../../store/reducers/balance";
import Toast from "react-native-root-toast";
import {Checkbox} from "expo-checkbox";
import * as Clipboard from "expo-clipboard";
import {BackButton} from "../Transaction/SelectCategory/styles";
import {ArrowLeft, Clipboard as ClipboardIcon, Pencil, Ticket} from "phosphor-react-native";
import api from "../../services/api";
import {TransactionProps} from "../../interfaces/transaction.interface";
import {SQLiteDatabase, useSQLiteContext} from "expo-sqlite";

export interface TransactionDetailProps {
    transaction: {
        id: string,
        title: string
        value: number
        type: string
        category: string,
        date: Date,
    }
}

const TransactionDetail = () => {
    const db: SQLiteDatabase = useSQLiteContext();
    const route: RouteProp<any> = useRoute();
    const dispatch = useDispatch();
    const $balance = useSelector((state: RootState) => state.balance);
    const navigation: NavigationProp<any> = useNavigation();

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [type, setType] = useState('');
    const [paid, setPaid] = useState(false);
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (route.params?.transaction != null) {
            const transaction = route.params?.transaction;

            setId(transaction.id)
            setName(transaction.name);
            setCategory(transaction.category);
            setDate(new Date(transaction.date));
            setType(transaction.type);
            setPaid(transaction.paid ?? false);
            setDescription(transaction.description ?? '')

            const price = transaction.price.toString();
            setPrice(price);
        }
    }, [route.params?.transaction]);

    const renderValue = () => {
        if (type === 'outcome') {
            return `-R$${convertToPrice(price)}`
        }

        return `R$${convertToPrice(price)}`
    }

    const renderDetailValue = () => {
        if (type === 'outcome') {
            return `Valor Gasto`
        }

        return `Valor Recebido`
    }

    const renderCategory = () => {
        if (type === 'income') {
            return `${category}/receita`
        }

        return category;
    }

    async function markPaid(isPaid: TransactionProps) {
        dispatch(enableLoading());
        if ($balance.isOffline) {
            const transaction = route.params?.transaction;
            const newTransaction = {
                ...transaction,
                id,
                date: new Date(transaction.date),
                paid: isPaid,
            }

            navigation.goBack();
            await db.runAsync(
                `UPDATE transactions
                 SET name        = ?,
                     price       = ?,
                     category    = ?,
                     date        = ?,
                     type        = ?,
                     description = ?,
                     paid        = ?
                 WHERE id = ?;`,
                [
                    newTransaction.name,
                    newTransaction.price,
                    newTransaction.category,
                    newTransaction.date.toISOString(),
                    newTransaction.type,
                    newTransaction.description,
                    newTransaction.paid,
                    newTransaction.id,
                ],
            )
        } else {
            await api.put(`/v1/transactions/${route.params?.transaction.id}`);
        }

        const result = $balance.transactions.map((transaction) => {
            if (transaction.id === id) {
                return {
                    ...transaction,
                    paid: isPaid,
                };
            }

            return transaction;
        });

        dispatch(disableLoading());
        dispatch(setTransactionsAction(result));
        dispatch(setTransactionsChanged(true));
        dispatch(setTransactionsChanged(false));
        Toast.show('A transação foi atualizada com sucesso!');
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

        if ($balance.isOffline) {
            await db.runAsync(
                `DELETE
                 FROM transactions
                 WHERE id = ?;`,
                [route.params?.transaction.id],
            );
        } else {
            await api.delete(`/v1/transactions/${route.params?.transaction.id}`);
        }

        const result = $balance.transactions.filter((t) => t.id !== route.params?.transaction.id)

        dispatch(disableLoading());
        dispatch(setTransactionsAction(result));
        dispatch(setTransactionsChanged(true));
        dispatch(setTransactionsChanged(false));
        Toast.show('A transação foi excluída com sucesso!');

        navigation.goBack();
    }

    const copyDescription = async () => {
        const value = description.toString()
        await Clipboard.setStringAsync(value);

        Alert.alert(
            'Descrição copiada',
            'A descrição foi copiada para a área de transferência',
        )
    }

    return (
        <Layout>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10
                }}
            >
                <BackButton onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color={'#000'}/>
                </BackButton>
                <View style={{width: 30}}/>
            </View>

            <WrapperView>
                <DateText>
                    {moment(date).format('LL')}
                </DateText>
                <Title>{name}</Title>
                <Category>{renderCategory()}</Category>
            </WrapperView>

            <WrapperView>
                <Price>{renderValue()}</Price>
            </WrapperView>

            {(
                type === 'outcome'
                && category !== 'Saldo Conta'
            ) && (
                <WrapperPaidTransaction>
                    <Checkbox
                        style={{marginRight: 10, borderColor: '#000', borderRadius: 5}}
                        value={paid}
                        onValueChange={(value) => void markPaid(value)}
                    />
                    <Label style={{
                        marginBottom: 0,
                        fontSize: 14,
                        color: '#000',
                        opacity: .5,
                        fontWeight: '500'
                    }}>
                        Essa transação foi paga?
                    </Label>
                </WrapperPaidTransaction>
            )}

            <View style={{gap: 10}}>
                <WrapperDetail style={{marginTop: 42}}>
                    <Ticket size={30} color={'#999'} style={{marginRight: 15}}/>
                    <View>
                        <Text style={{fontSize: 16, fontWeight: '500', color: '#000'}}>
                            Tipo de transação
                        </Text>
                        <Text style={{fontSize: 15, fontWeight: '500', marginTop: 5, color: '#999'}}>
                            {type === 'income' ? 'Receita' : 'Despesa'}
                        </Text>
                    </View>
                </WrapperDetail>

                {(
                    type === 'outcome'
                    && category !== 'Saldo Conta'
                    && description !== ''
                ) && (
                    <WrapperDetail>
                        <ClipboardIcon size={30} color={'#999'} style={{marginRight: 15}}/>
                        <TouchableOpacity onLongPress={() => copyDescription()}>
                            <Text style={{fontSize: 16, fontWeight: '500', color: '#000'}}>
                                Descrição/Observação
                            </Text>
                            <Text
                                numberOfLines={1}
                                style={{fontSize: 15, fontWeight: '500', marginTop: 5, color: '#999'}}
                            >
                                {description}
                            </Text>
                        </TouchableOpacity>
                    </WrapperDetail>
                )}

                <WrapperDetail>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Transaction', {transaction: route.params?.transaction})}
                        style={{width: "100%", flexDirection: 'row'}}
                    >
                        <Pencil size={30} color={'#999'} style={{marginRight: 15}}/>
                        <View>
                            <Text style={{fontSize: 16, fontWeight: '500', color: '#000'}}>
                                Há algo errado?
                            </Text>
                            <Text style={{fontSize: 15, fontWeight: '500', marginTop: 5, color: '#999'}}>
                                Editar transação
                            </Text>
                        </View>
                    </TouchableOpacity>
                </WrapperDetail>

                <WrapperDetail>
                    <TouchableOpacity
                        onPress={() => deleteItem()}
                        style={{width: "100%", flexDirection: 'row'}}
                    >
                        <Image source={require('../../assets/trash.png')}
                               style={{width: 30, height: 30, marginRight: 15}}/>
                        <View>
                            <Text style={{fontSize: 16, fontWeight: '500', color: '#000'}}>
                                Cadastrou errado?
                            </Text>
                            <Text style={{fontSize: 15, fontWeight: '500', marginTop: 5, color: '#999'}}>
                                Deletar transação
                            </Text>
                        </View>
                    </TouchableOpacity>
                </WrapperDetail>
            </View>
        </Layout>
    );
};

export default TransactionDetail;
