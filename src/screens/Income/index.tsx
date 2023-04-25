import React, {useEffect, useState} from 'react';
import {Button, Container, Form, Input, Label} from "./styles";
import WrapperTitle from "../../components/Home/WrapperTitle";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {ActivityIndicator, Alert, Image, Platform, Pressable, Text, View} from "react-native";
import {ref, set} from "firebase/database";
import {database} from "../../config/firebase.config";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {NavigationProp, RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {
    CurrencyFormat,
    CurrentCategory,
    PriceItem,
    TextCurrentCategory,
    WrapperCurrency,
    WrapperPrices
} from "../Expense/styles";
import {Picker} from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {DateText, DateWrapper} from "../Home/styles";
import moment from "moment";

const Income = () => {
    const route: RouteProp<any> = useRoute();
    const navigation: NavigationProp<any> = useNavigation();
    const $balance = useSelector((state: RootState) => state.balance);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

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

        const user: any = await AsyncStorage.getItem('@iFinance-status');
        const sanitizedUser = JSON.parse(user);

        const sanitizedPrice = price
            .replace('.', '')
            .replace(',', '.')

        const newExpense = {
            id,
            name,
            price: sanitizedPrice,
            category: 'Salário',
            date: date.toISOString(),
            type: 'income',
            paid: false,
            userId: sanitizedUser.id
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

    const handleToggleDatePicker = () => {
        setShowDatePicker((prevState) => !prevState)
    };

    const renderMonthYear = () => {
        const month = moment(date).format('MM');
        const year = moment(date).format('YYYY');

        return `${month}/${year}`;
    }

    return (
        <Container>
            <Pressable onPress={() => navigation.goBack()} style={{marginBottom: 20}}>
                <Image
                    source={require('../../assets/caret-left.png')}
                    style={{
                        width: 30,
                        height: 30,
                    }}
                />
            </Pressable>

            <WrapperTitle
                title={'Minhas Finanças'}
                subtitle={'Nova Receita'}
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

                <View>
                    <Label>Categoria</Label>
                    {Platform.OS === 'ios' ? (
                        <View>
                            <CurrentCategory onPress={() => setShowCategoryPicker(!showCategoryPicker)}>
                                <TextCurrentCategory color={category === '' ? '#999' : '#000'}>
                                    {category === '' ? 'Escolher uma categoria' : category}
                                </TextCurrentCategory>
                            </CurrentCategory>
                            {showCategoryPicker && (
                                <Picker
                                    selectedValue={category}
                                    onValueChange={(itemValue, itemIndex) => {
                                        setCategory(itemValue)
                                        setShowCategoryPicker(false)
                                    }}
                                >
                                    {$balance.categoriesIncome.map((item, index) => (
                                        <Picker.Item key={index} label={item.title} value={item.title}/>
                                    ))}
                                </Picker>
                            )}
                        </View>
                    ) : (
                        <Picker
                            style={{backgroundColor: '#fafafa', borderRadius: 4}}
                            prompt={'Selecione uma categoria'}
                            selectedValue={category}
                            onValueChange={(itemValue, itemIndex) => {
                                setCategory(itemValue)
                                setShowCategoryPicker(false)
                            }}
                        >
                            {$balance.categoriesIncome.map((item, index) => (
                                <Picker.Item key={index} label={item.title} value={item.title}/>
                            ))}
                        </Picker>
                    )}
                </View>

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
