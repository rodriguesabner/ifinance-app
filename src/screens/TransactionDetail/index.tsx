import React, {useEffect, useState} from 'react';
import {Text} from "react-native";
import moment from "moment/moment";
import {NavigationProp, RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {Category, Label, Layout, Price, Title, WrapperInput} from "./styles";
import {convertToPrice} from "../../store/reducers/balance";

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

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [type, setType] = useState('');

    useEffect(() => {
        if (route.params?.transaction != null) {
            const transaction = route.params?.transaction;

            setId(transaction.id)
            setName(transaction.title);
            setCategory(transaction.category);
            setDate(new Date(transaction.date));
            setType(transaction.type);

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
        </Layout>
    );
};

export default TransactionDetail;
