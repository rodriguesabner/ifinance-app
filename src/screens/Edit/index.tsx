import React, {useEffect, useState} from 'react';
import {Button, Container, Form, Input, Label} from "./styles";
import WrapperTitle from "../../components/Home/WrapperTitle";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {ActivityIndicator, Alert, Platform, Text, View} from "react-native";
import {ref, update} from "firebase/database";
import {database} from "../../config/firebase.config";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {NavigationProp, RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {Picker} from "@react-native-picker/picker";
import {disableLoading, enableLoading} from "../../store/reducers/balance";

const Edit = () => {
    const dispatch = useDispatch();
    const route: RouteProp<any> = useRoute();
    const navigation: NavigationProp<any> = useNavigation();
    const $balance = useSelector((state: RootState) => state.balance);

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [type, setType] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(route.params?.transaction != null){
            const transaction = route.params?.transaction;

            setId(transaction.id)
            setName(transaction.title);
            setCategory(transaction.category);
            setDate(new Date(transaction.date));
            setType(transaction.type);

            const price = transaction.value.toString();
            setPrice(price.replace('.', ','));
        }
    }, [route.params?.transaction])

    async function save() {
        if(!name || !price || !category){
            Alert.alert('Ops!', 'Preencha todos os campos');
            return;
        }

        dispatch(enableLoading());

        const getMonth = date.getMonth() + 1;
        const getYear = date.getFullYear();

        const db = ref(database, $balance.databaseRef + `/${getYear}/${getMonth}/${id}`);
        const newExpense = {
            id,
            name,
            price: price.replace(',', '.'),
            category,
            date: date.toISOString(),
            type
        }

        await update(db, newExpense);

        dispatch(disableLoading());
        navigation.navigate('Home');
    }

    return (
        <Container>
            <WrapperTitle
                title={'Minhas Finanças'}
                subtitle={'Editar Transação'}
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
                    <Input placeholder="Netflix" value={name} onChangeText={setName}/>
                </View>

                <View>
                    <Label>Valor</Label>
                    <Input placeholder="35" value={price} onChangeText={setPrice} keyboardType="numeric"/>
                </View>

                {type !== 'income' && (
                    <View>
                        <Label>Categoria</Label>
                        <Picker
                            selectedValue={category}
                            onValueChange={(itemValue, itemIndex) => {
                                setCategory(itemValue);
                            }}
                        >
                            {$balance.categories.map((item, index) => (
                                <Picker.Item key={index} label={item.title} value={item.title}/>
                            ))}
                        </Picker>
                    </View>
                )}

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