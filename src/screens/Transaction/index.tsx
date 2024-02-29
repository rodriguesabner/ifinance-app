import React, {useEffect, useState} from 'react';
import {
    BackButton,
    Button,
    CancelButton,
    Container,
    Footer,
    Form,
    Input,
    Label,
    PriceItem,
    WrapperCurrency,
    WrapperPrices
} from "./styles";
import WrapperTitle from "../../components/Home/WrapperTitle";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {ActivityIndicator, Alert, Text, View} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {NavigationProp, RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {DateText, DateWrapper} from "../Home/styles";
import moment from "moment";
import {ArrowLeft} from "phosphor-react-native";
import CategorySelect from "./SelectCategory";
import {setTransactionsAction, setTransactionsChanged} from "../../store/reducers/balance";
import {insertTransaction, updateTransaction} from "../../database/config.database";
import {TransactionProps} from "../../interfaces/transaction.interface";
import api from "../../services/api";
import Toast from "react-native-root-toast";

const Transaction = () => {
    const route: RouteProp<any> = useRoute();
    const navigation: NavigationProp<any> = useNavigation();
    const dispatch = useDispatch();
    const $balance = useSelector((state: RootState) => state.balance);

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [type, setType] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [description, setDescription] = useState('');
    const [paid, setPaid] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    useEffect(() => {
        setIsEdit(false);
        setDate(route.params?.date != null ? new Date(route.params.date) : new Date());
        setType(route.params?.type ?? 'income');

        if (route.params?.transaction != null) {
            const transaction = route.params?.transaction;

            setId(transaction.id)
            setName(transaction.name);
            setCategory(transaction.category);
            setDate(new Date(transaction.date));
            setType(transaction.type);
            setDescription(transaction.description)
            setPaid(transaction.paid)

            const price = transaction.price.toString();
            setPrice(price.replace('.', ','));
            setIsEdit(true);
        }
    }, [route.params])

    async function save() {
        if (!name || !price) {
            Alert.alert('Ops!', 'Preencha todos os campos');
            return;
        }

        setLoading(true);

        const sanitizedPrice = price
            .replace('.', '')
            .replace(',', '.')

        const transactionToInsert: TransactionProps = {
            name,
            price: sanitizedPrice,
            category,
            date: new Date(),
            type,
            description,
            paid,
        };

        let result;

        if (isEdit) {
            result = await handleUpdate(transactionToInsert);
        } else {
            result = await handleSave(transactionToInsert);
        }

        setLoading(false);
        navigation.navigate('Home');

        dispatch(setTransactionsAction(result));
        dispatch(setTransactionsChanged(true));
        dispatch(setTransactionsChanged(false));
    }

    async function handleUpdate(transactionToInsert: TransactionProps) {
        const sanitizedPrice = price
            .replace('.', '')
            .replace(',', '.')

        if ($balance.isOffline) {
            await updateTransaction({...transactionToInsert, id});
        } else {
            await api.patch(`/v1/transactions/${id}?type=${type}`, transactionToInsert)
        }

        Toast.show('A transação foi editada com sucesso!');

        return $balance.transactions.map((transaction) => {
            if (transaction.id === id) {
                return {
                    ...transaction,
                    name,
                    price: sanitizedPrice,
                    category,
                    date: date.toISOString(),
                    type,
                    paid,
                    description,
                };
            }

            return transaction;
        });
    }

    async function handleSave(transactionToInsert: TransactionProps) {
        let ret: any;
        const sanitizedPrice = price
            .replace('.', '')
            .replace(',', '.')

        if ($balance.isOffline) {
            ret = await insertTransaction(transactionToInsert)
        } else {
            ret = await api.post(`/v1/transactions?type=${type}`, transactionToInsert);
        }

        const result = [...$balance.transactions, {
            id: ret.insertId ?? ret.InsertedID,
            name,
            price: sanitizedPrice,
            category,
            date: date.toISOString(),
            type: type,
            paid: false,
            description: description,
        }]

        return result;
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

    const handleToggleDatePicker = () => {
        setShowDatePicker((prevState) => !prevState)
    };

    const renderMonthYear = () => {
        const month = moment(date).format('MM');
        const year = moment(date).format('YYYY');

        return `${month}/${year}`;
    }

    const maskMoneyBr = (value: string) => {
        const opts = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }

        const valueMask: any = value
            .replace(/\D/g, '')

        const ret = new Intl
            .NumberFormat('pt-BR', opts)
            .format(valueMask / 100);

        setPrice(ret);
    }

    return (
        <Container>
            <BackButton onPress={() => navigation.goBack()}>
                <ArrowLeft size={24} color={'#000'}/>
            </BackButton>

            <WrapperTitle
                title={''}
                subtitle={isEdit ? 'Editar Transação' : type === 'income' ? 'Nova Receita' : 'Nova Despesa'}
            />

            <Form>
                <View style={{alignItems: 'flex-start'}}>
                    <Label>Data</Label>
                    <DateWrapper
                        onPress={() => handleToggleDatePicker()}
                    >
                        <DateText>{renderMonthYear()}</DateText>
                    </DateWrapper>

                    {showDatePicker && (
                        <RNDateTimePicker
                            style={{marginTop: 10}}
                            mode={'date'}
                            display={'spinner'}
                            value={date}
                            onChange={(event, selectedDate) => {
                                const currentDate = selectedDate || date;
                                setDate(currentDate);
                                setShowDatePicker(false)
                            }}
                        />
                    )}
                </View>

                <View>
                    <Label>Título</Label>
                    <Input
                        placeholder={type === 'income' ? "Salário" : "Netflix"}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View>
                    <Label>Descrição (opcional)</Label>
                    <Input placeholder="Código do boleto/pix ou alguma observação" value={description}
                           onChangeText={setDescription}/>
                </View>

                <View>
                    <Label>Valor</Label>

                    <WrapperCurrency>
                        <Input
                            keyboardType="numeric"
                            placeholder={type === 'income' ? "R$5900" : 'R$30'}
                            value={price}
                            onChangeText={(value: string) => maskMoneyBr(value)}
                        />
                    </WrapperCurrency>
                </View>
                <WrapperPrices
                    data={prices()}
                    keyExtractor={(item: any) => item.value}
                    contentContainerStyle={{gap: 10}}
                    renderItem={({item}: { item: any }) => (
                        <PriceItem onPress={() => handleClickPrice(item.label)}>
                            <Text style={{color: '#000'}}>{item.label}</Text>
                        </PriceItem>
                    )}
                />

                <View>
                    <Label>Categoria</Label>
                    <CategorySelect
                        category={category}
                        setShowCategoryPicker={setShowCategoryPicker}
                        setCategory={setCategory}
                        showCategoryPicker={showCategoryPicker}
                        type={type}
                    />
                </View>

                <Footer>
                    <CancelButton onPress={() => navigation.goBack()}>
                        <Text style={{color: "#000", fontSize: 16}}>Cancelar</Text>
                    </CancelButton>
                    <Button disabled={loading} onPress={() => save()}>
                        <Text style={{color: "#000", fontSize: 16}}>Salvar</Text>
                        {loading && (
                            <ActivityIndicator size="small" color="#000" style={{marginLeft: 15}}/>
                        )}
                    </Button>
                </Footer>
            </Form>
        </Container>
    );
};

export default Transaction;
