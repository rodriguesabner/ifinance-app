import React, {useEffect, useState} from 'react';
import WrapperTitle from "../../components/Home/WrapperTitle";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {ActivityIndicator, Alert, Text, View} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {NavigationProp, RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {disableLoading, enableLoading} from "../../store/reducers/balance";
import Toast from "react-native-root-toast";
import {
    BackButton,
    Button,
    CancelButton,
    Container,
    Footer,
    Form,
    Input,
    Label
} from "../Transaction/SelectCategory/styles";
import {DateText, DateWrapper} from "../Home/styles";
import moment from "moment/moment";
import {ArrowLeft} from "phosphor-react-native";
import CategorySelect from "../Transaction/SelectCategory";
import api from "../../services/api";

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

        const sanitizedPrice = price
            .replace('.', '')
            .replace(',', '.')

        await api.patch(`/v1/transactions/${id}?type=${type}`, {
            name,
            price: sanitizedPrice,
            category,
            type,
            date: date.toISOString(),
            description,
            paid: false,
        })

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

                <View>
                    <Label>Descrição (opcional)</Label>
                    <Input placeholder="Código do boleto/pix ou alguma observação" value={description}
                           onChangeText={setDescription}/>
                </View>

                <View>
                    <Label>Valor</Label>
                    <Input
                        placeholder="35"
                        value={price}
                        onChangeText={(value: any) => maskMoneyBr(value)}
                        keyboardType="numeric"
                    />
                </View>

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
                        <Text style={{color: "#000", fontSize: 16}}>
                            Cancelar
                        </Text>
                    </CancelButton>
                    <Button disabled={loading} onPress={() => save()}>
                        <Text style={{color: "#000", fontSize: 16}}>
                            Salvar
                        </Text>
                        {loading && (
                            <ActivityIndicator size="small" color="#000" style={{marginLeft: 15}}/>
                        )}
                    </Button>
                </Footer>
            </Form>
        </Container>
    );
};

export default Edit;
