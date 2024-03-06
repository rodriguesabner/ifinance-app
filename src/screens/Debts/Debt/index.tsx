import React, {useEffect, useState} from 'react';
import {BackButton, Button, CancelButton, Container, Footer, Form, Input, Label, WrapperCurrency} from "./styles";
import {useDispatch, useSelector} from "react-redux";
import {ActivityIndicator, Alert, Text, View} from "react-native";
import {NavigationProp, RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {ArrowLeft} from "phosphor-react-native";
import Toast from "react-native-root-toast";
import {RootState} from "../../../store/reducers";
import WrapperTitle from "../../../components/Home/WrapperTitle";

const Debt = () => {
    const route: RouteProp<any> = useRoute();
    const navigation: NavigationProp<any> = useNavigation();
    const dispatch = useDispatch();
    const $balance = useSelector((state: RootState) => state.balance);

    const [loading, setLoading] = useState(false);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [installmentPrice, setInstallmentPrice] = useState('');
    const [installmentQtd, setInstallmentQtd] = useState('');
    const [installmentCurrent, setInstallmentCurrent] = useState('');
    const [reason, setReason] = useState('');
    const [paid, setPaid] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    useEffect(() => {
        setIsEdit(false);

        if (route.params?.transaction != null) {
            const transaction = route.params?.transaction;

            setId(transaction.id)
            setName(transaction.name);
            setReason(transaction.description)
            setPaid(transaction.paid)
            setInstallmentQtd(transaction.paid)

            const price = transaction.price.toString();
            setInstallmentPrice(price.replace('.', ','));
            setIsEdit(true);
        }
    }, [route.params])

    async function save() {
        if (!name || !installmentPrice) {
            Alert.alert('Ops!', 'Preencha todos os campos');
            return;
        }

        setLoading(true);

        const sanitizedPrice = installmentPrice
            .replace('.', '')
            .replace(',', '.')

        const transactionToInsert: any = {
            name,
            price: sanitizedPrice,
            date: new Date(),
            reason,
            paid,
            installmentPrice,
            installmentQtd,
            installmentCurrent
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
        const sanitizedPrice = installmentPrice
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
                    description: reason,
                };
            }

            return transaction;
        });
    }

    async function handleSave(transactionToInsert: TransactionProps) {
        let ret: any;
        const sanitizedPrice = installmentPrice
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
            description: reason,
        }]

        return result;
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

        setInstallmentPrice(ret);
    }

    return (
        <Container>
            <BackButton onPress={() => navigation.goBack()}>
                <ArrowLeft size={24} color={'#000'}/>
            </BackButton>

            <WrapperTitle
                title={''}
                subtitle={isEdit ? 'Editar Dívida' : 'Cadastrar Dívida'}
            />

            <Form>
                <View>
                    <Label>Nome da Empresa</Label>
                    <Input
                        placeholder={"Renner"}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View>
                    <Label>Motivo</Label>
                    <Input
                        placeholder="Qual o motívo da dívida"
                        value={reason}
                        onChangeText={setReason}
                    />
                </View>

                <View>
                    <Label>Valor da Parcela</Label>

                    <WrapperCurrency>
                        <Input
                            keyboardType="numeric"
                            placeholder={"R$590"}
                            value={installmentPrice}
                            onChangeText={(value: string) => maskMoneyBr(value)}
                        />
                    </WrapperCurrency>
                </View>

                <View>
                    <Label>Quantidade de Parcelas</Label>
                    <Input
                        keyboardType="numeric"
                        placeholder={"5"}
                        value={installmentQtd}
                        onChangeText={setInstallmentQtd}
                    />
                </View>

                <View>
                    <Label>Parcela Atual</Label>
                    <Input
                        keyboardType="numeric"
                        placeholder={"2"}
                        value={installmentCurrent}
                        onChangeText={setInstallmentCurrent}
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

export default Debt;
