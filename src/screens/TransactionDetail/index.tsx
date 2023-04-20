import React, {useEffect, useState} from 'react';
import {Image, Pressable, Text, View} from "react-native";
import moment from "moment/moment";
import {NavigationProp, RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {Category, Label, Layout, Price, Title, WrapperDetail, WrapperInput, WrapperPaidTransaction} from "./styles";
import {convertToPrice} from "../../store/reducers/balance";
import {ref, update} from "firebase/database";
import {database} from "../../config/firebase.config";
import Toast from "react-native-root-toast";
import {Checkbox} from "expo-checkbox";

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
    const $balance = useSelector((state: RootState) => state.balance);
    const navigation: NavigationProp<any> = useNavigation();

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [type, setType] = useState('');
    const [paid, setPaid] = useState(false);

    useEffect(() => {
        if (route.params?.transaction != null) {
            const transaction = route.params?.transaction;

            setId(transaction.id)
            setName(transaction.title);
            setCategory(transaction.category);
            setDate(new Date(transaction.date));
            setType(transaction.type);
            setPaid(transaction.paid ?? false);

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

    return (
        <Layout>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 30
                }}
            >
                <Pressable onPress={() => navigation.goBack()}>
                    <Text>
                        <Image
                            source={require('../../assets/caret-left.png')}
                            style={{
                                width: 30,
                                height: 30,
                            }}
                        />
                    </Text>
                </Pressable>

                <WrapperInput style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 0
                }}>
                    <Text style={{fontSize: 16, color: '#666'}}>
                        {moment(date).format('LL')}
                    </Text>
                </WrapperInput>

                <View/>
            </View>

            <WrapperInput style={{
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Title>{name}</Title>
                <Category>{renderCategory()}</Category>
            </WrapperInput>

            <WrapperInput style={{
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Price>{renderValue()}</Price>
            </WrapperInput>

            {(
                type === 'outcome'
                && category !== 'Saldo Conta'
            ) && (
                <WrapperPaidTransaction>
                    <Checkbox
                        style={{marginRight: 10}}
                        value={paid}
                        onValueChange={(value) => void markPaid(value)}
                    />
                    <Label style={{marginBottom: 0, fontSize: 14, color: '#000', opacity: .5, fontWeight: '500'}}>
                        Essa transação foi paga?
                    </Label>
                </WrapperPaidTransaction>
            )}

            <WrapperDetail style={{marginTop: 42}}>
                <Image source={require('../../assets/ticket.png')} style={{width: 35, height: 35, marginRight: 15}}/>
                <View>
                    <Text style={{fontSize: 16, fontWeight: '500'}}>
                        Tipo de transação
                    </Text>
                    <Text style={{fontSize: 15, fontWeight: '500', opacity: .5, marginTop: 5}}>
                        {type === 'income' ? 'Receita' : 'Despesa'}
                    </Text>
                </View>
            </WrapperDetail>
        </Layout>
    );
};

export default TransactionDetail;
