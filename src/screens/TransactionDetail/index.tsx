import React, {useEffect, useState} from 'react';
import {Alert, Image, Pressable, Text, TouchableOpacity, View} from "react-native";
import moment from "moment/moment";
import {NavigationProp, RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {
    Category,
    Label,
    Layout,
    Price,
    Title,
    WrapperDetail,
    WrapperView,
    WrapperPaidTransaction,
    DateText
} from "./styles";
import {convertToPrice, disableLoading, enableLoading} from "../../store/reducers/balance";
import {ref, remove, update} from "firebase/database";
import {database} from "../../config/firebase.config";
import Toast from "react-native-root-toast";
import {Checkbox} from "expo-checkbox";
import * as Clipboard from "expo-clipboard";
import {BackButton} from "../Income/styles";
import {ArrowLeft, Pencil, Clipboard as ClipboardIcon, Ticket} from "phosphor-react-native";

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
            setName(transaction.title);
            setCategory(transaction.category);
            setDate(new Date(transaction.date));
            setType(transaction.type);
            setPaid(transaction.paid ?? false);
            setDescription(transaction.description ?? '')

            const price = transaction.value.toString();
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

    async function markPaid(newPaidState: boolean) {
        setPaid(newPaidState);

        const getMonth = date.getMonth() + 1;
        const getYear = date.getFullYear();

        const db = ref(database, $balance.databaseRef + `/${getYear}/${getMonth}/${id}`);
        const newExpense = {
            id,
            name,
            price: price.replace(',', '.'),
            category,
            date: date.toISOString(),
            type,
            paid: newPaidState
        }

        await update(db, newExpense);

        if (newPaidState) Toast.show('A transação foi marcada como paga!');
        else Toast.show('A transação foi marcada como não paga!');

        navigation.goBack();
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

        const month = moment(route.params?.transaction.date).format('M');
        const year = moment(route.params?.transaction.date).format('YYYY');

        const path = $balance.databaseRef + `${year}/${month}/${route.params?.transaction.id}`;
        await remove(ref(database, path));

        dispatch(disableLoading());
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
                    <ArrowLeft size={24} color={'#fff'}/>
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
                        style={{marginRight: 10, borderColor: '#fff', borderRadius: 5}}
                        value={paid}
                        onValueChange={(value) => void markPaid(value)}
                    />
                    <Label style={{marginBottom: 0, fontSize: 14, color: '#fff', opacity: .5, fontWeight: '500'}}>
                        Essa transação foi paga?
                    </Label>
                </WrapperPaidTransaction>
            )}

            <View style={{gap: 10}}>
                <WrapperDetail style={{marginTop: 42}}>
                    <Ticket size={30} color={'#fff'} style={{marginRight: 15}}/>
                    <View>
                        <Text style={{fontSize: 16, fontWeight: '500', color: '#fff'}}>
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
                        <ClipboardIcon size={30} color={'#fff'} style={{marginRight: 15}}/>
                        <TouchableOpacity onLongPress={() => copyDescription()}>
                            <Text style={{fontSize: 16, fontWeight: '500', color: '#fff'}}>
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
                        onPress={() => navigation.navigate('Edit', {transaction: route.params?.transaction})}
                        style={{width: "100%", flexDirection: 'row'}}
                    >
                        <Pencil size={30} color={'#fff'} style={{marginRight: 15}}/>
                        <View>
                            <Text style={{fontSize: 16, fontWeight: '500', color: '#fff'}}>
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
                            <Text style={{fontSize: 16, fontWeight: '500', color: '#fff'}}>
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
