import React, {useEffect, useState} from 'react';
import {Button, Container, Form, Input, Label} from "./styles";
import WrapperTitle from "../../components/Home/WrapperTitle";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {ActivityIndicator, Alert, Image, Platform, Pressable, Text, View} from "react-native";
import {ref, update} from "firebase/database";
import {database} from "../../config/firebase.config";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {NavigationProp, RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {Picker} from "@react-native-picker/picker";
import {disableLoading, enableLoading} from "../../store/reducers/balance";
import Toast from "react-native-root-toast";
import {CurrentCategory, TextCurrentCategory} from "../Expense/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {DateText, DateWrapper} from "../Home/styles";
import moment from "moment/moment";

const Edit = () => {
    const dispatch = useDispatch();
    const route: RouteProp<any> = useRoute();
    const navigation: NavigationProp<any> = useNavigation();
    const $balance = useSelector((state: RootState) => state.balance);

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [type, setType] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (route.params?.transaction != null) {
            const transaction = route.params?.transaction;

            setId(transaction.id)
            setName(transaction.title);
            setCategory(transaction.category);
            setDate(new Date(transaction.date));
            setType(transaction.type);
            setDescription(transaction.description)

            const price = transaction.value.toString();
            setPrice(price.replace('.', ','));
        }
    }, [route.params?.transaction])

    async function save() {
        if (!name || !price || !category) {
            Alert.alert('Ops!', 'Preencha todos os campos');
            return;
        }

        setLoading(true);
        dispatch(enableLoading());

        const getMonth = date.getMonth() + 1;
        const getYear = date.getFullYear();

        const user: any = await AsyncStorage.getItem('@iFinance-status');
        const sanitizedUser = JSON.parse(user);

        const sanitizedPrice = price
            .replace('.', '')
            .replace(',', '.')

        const db = ref(database, $balance.databaseRef + `/${getYear}/${getMonth}/${id}`);
        const expense = {
            id,
            name,
            price: sanitizedPrice,
            category,
            date: date.toISOString(),
            type,
            description: description ?? '',
            userId: sanitizedUser.id
        }

        await update(db, expense);

        setLoading(false);
        dispatch(disableLoading());
        navigation.navigate('Home');
        Toast.show('A transação foi editada com sucesso!');
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
                subtitle={'Editar Transação'}
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
                    <Input placeholder="Netflix" value={name} onChangeText={setName}/>
                </View>

                {type === 'outcome' && (
                    <View>
                        <Label>Descrição (opcional)</Label>
                        <Input placeholder="Código do boleto/pix ou alguma observação" value={description}
                               onChangeText={setDescription}/>
                    </View>
                )}

                <View>
                    <Label>Valor</Label>
                    <Input placeholder="35" value={price} onChangeText={setPrice} keyboardType="numeric"/>
                </View>

                <View>
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
                                    {type === 'income' ? (
                                        $balance.categoriesIncome.map((item, index) => (
                                            <Picker.Item key={index} label={item.title} value={item.title}/>
                                        ))
                                    ) : (
                                        $balance.categories.map((item, index) => (
                                            <Picker.Item key={index} label={item.title} value={item.title}/>
                                        ))
                                    )}
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
                            {type === 'income' ? (
                                $balance.categoriesIncome.map((item, index) => (
                                    <Picker.Item key={index} label={item.title} value={item.title}/>
                                ))
                            ) : (
                                $balance.categories.map((item, index) => (
                                    <Picker.Item key={index} label={item.title} value={item.title}/>
                                ))
                            )}
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

export default Edit;
