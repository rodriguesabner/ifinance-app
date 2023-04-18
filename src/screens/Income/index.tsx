import React, {useEffect, useState} from 'react';
import {Button, Container, Form, Input, Label} from "./styles";
import WrapperTitle from "../../components/Home/WrapperTitle";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {ActivityIndicator, Alert, Platform, Text, View} from "react-native";
import {ref, set} from "firebase/database";
import {database} from "../../config/firebase.config";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {NavigationProp, RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {CurrencyFormat, PriceItem, WrapperCurrency, WrapperPrices} from "../Expense/styles";

const Income = () => {
    const route: RouteProp<any> = useRoute();
    const navigation: NavigationProp<any> = useNavigation();
    const $balance = useSelector((state: RootState) => state.balance);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (route.params?.date) {
            setDate(new Date(route.params.date));
        } else {
            setDate(new Date());
        }
    }, [route.params?.date])

    async function save() {
        if (!name || !price) {
            Alert.alert('Ops!', 'Preencha todos os campos');
            return;
        }

        setLoading(true);

        const getMonth = date.getMonth() + 1;
        const getYear = date.getFullYear();

        const id = Date.now();
        const db = ref(database, $balance.databaseRef + `/${getYear}/${getMonth}/${id}`);
        const newExpense = {
            id,
            name,
            price: price.replace(',', '.'),
            category: 'Salário',
            date: date.toISOString(),
            type: 'income'
        }

        await set(db, newExpense);

        setLoading(false);
        navigation.navigate('Home');
    }

    const prices = () => ([
        {value: '1', label: 'R$1'},
        {value: '2', label: 'R$10'},
        {value: '3', label: 'R$100'},
        {value: '4', label: 'R$500'},
        {value: '5', label: 'R$1000'},
    ])

    const handleClickPrice = (value: string) => {
        const sanitizedValue = value.replace('R$', '');

        const currentPrice = price === '' ? 0 : parseInt(price, 10);
        const total = currentPrice + parseInt(sanitizedValue, 10);

        setPrice(total.toString());
    }

    return (
        <Container>
            <WrapperTitle
                title={'Minhas Finanças'}
                subtitle={'Nova Receita'}
            />

            <Form>
                <View style={{alignItems: 'flex-start'}}>
                    <Label>Data</Label>
                    <RNDateTimePicker
                        style={{marginTop: 10}}
                        mode={'date'}
                        value={date}
                        onChange={(event, selectedDate) => {
                            const currentDate = selectedDate || date;
                            setDate(currentDate);
                        }}
                        locale="pt-BR"
                    />
                </View>

                <View>
                    <Label>Título</Label>
                    <Input placeholder="Salário" value={name} onChangeText={setName}/>
                </View>

                <View>
                    <Label>Valor</Label>

                    <WrapperCurrency>
                        <CurrencyFormat>R$</CurrencyFormat>
                        <Input placeholder="5900" value={price} onChangeText={setPrice} keyboardType="numeric"/>
                    </WrapperCurrency>
                </View>
                <WrapperPrices
                    data={prices()}
                    keyExtractor={(item) => item.value}
                    contentContainerStyle={{gap: 10}}
                    renderItem={({item}) => (
                        <PriceItem onPress={() => handleClickPrice(item.label)}>
                            <Text>{item.label}</Text>
                        </PriceItem>
                    )}
                />

                <Button disabled={loading} onPress={() => save()}>
                    <Text style={{color: "#fff", fontSize: 16}}>Salvar</Text>
                    {loading && (
                        <ActivityIndicator size="small" color="#fff" style={{marginLeft: 15}}/>
                    )}
                </Button>
            </Form>
        </Container>
    );
};

export default Income;