import React, {useEffect, useState} from 'react';
import {Alert, Text} from "react-native";
import moment from "moment/moment";
import {NavigationProp, RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {Category, Label, Layout, Price, Title, WrapperInput} from "./styles";
import {convertToPrice, disableLoading, enableLoading} from "../../store/reducers/balance";
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

        if(newPaidState) Toast.show('A transação foi marcada como paga!');
        else Toast.show('A transação foi marcada como não paga!');

        navigation.goBack();
    }

    return (
        <Layout>
            <Text style={{fontSize: 28}}>
                Detalhe da <Text style={{fontWeight: 'bold'}}>Transação</Text>
            </Text>

            <Text
                style={{
                    marginTop: 26,
                    opacity: .3,
                }}
            >
                #{id}
            </Text>

            <WrapperInput>
                <Label>
                    Data:
                </Label>
                <Text style={{fontSize: 18}}>
                    {moment(date).format('LL')}
                </Text>
            </WrapperInput>

            <WrapperInput>
                <Category>{renderCategory()}</Category>
                <Title>{name}</Title>
            </WrapperInput>

            <WrapperInput>
                <Label>
                    {renderDetailValue()}
                </Label>
                <Price>{renderValue()}</Price>
            </WrapperInput>

            {type === 'outcome' && (
                <WrapperInput>
                    <Label>
                        Essa transação foi paga?
                    </Label>
                    <Checkbox
                        value={paid}
                        onValueChange={(value) => void markPaid(value)}
                    />
                </WrapperInput>
            )}
        </Layout>
    );
};

export default TransactionDetail;
