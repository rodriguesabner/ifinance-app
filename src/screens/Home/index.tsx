import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, StatusBar, Text, View} from "react-native";
import {FlatList, HeaderWrapper, Layout, LoadingWrapper} from "./styles";
import CurrentBalance from "../../components/Home/CurrentBalance";
import LastTransactionItem from "../../components/Home/LastTransactionItem";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {
    disableLoading,
    enableLoading,
    setBalance,
    setIncome,
    setOutcome,
    setTransactionsAction
} from "../../store/reducers/balance";
import moment from "moment";
import 'moment/locale/pt-br';
import AsyncStorage from "@react-native-async-storage/async-storage";
import OverviewMoney from "../../components/Home/OverviewMoney";
import MostOutcome from "../../components/Home/MostOutcome";
import Actions from "../../components/Home/Actions";
import api from "../../services/api";

const Home = () => {
    const dispatch = useDispatch();
    const $balance = useSelector((state: RootState) => state.balance);
    const navigation: NavigationProp<any> = useNavigation();

    const [transactions, setTransactions] = useState<any[]>([]);
    const [mostOutcome, setMostOutcome] = useState<any[]>([]);
    const [date, setDate] = useState(new Date());
    const [totalBalance, setTotalBalance] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [months, setMonths] = useState<any>([]);
    const [countTransactions, setCountTransactions] = useState(0);

    useEffect(() => {
        getMonthsMoment();
        getTransactions();
    }, [date])

    function onSwipeLeft() {
        const newDate = moment(date).add(1, 'month').toDate();
        setDate(newDate);
        setShowDatePicker(false);
    }

    function onSwipeRight() {
        const newDate = moment(date).subtract(1, 'month').toDate();
        setDate(newDate);
        setShowDatePicker(false);
    }

    function calculateBalance(transactions: any[]) {
        let total: number = 0;

        const incomeValue = transactions
            .filter((item) => item?.type === 'income')
            .reduce((acc, item) => {
                return acc + parseFloat(item.value);
            }, 0);

        const outcomeValue = transactions
            .filter((item) => item.type === 'outcome')
            .reduce((acc, item) => {
                return acc + parseFloat(item.value);
            }, 0);

        total = incomeValue - outcomeValue;

        setTotalBalance(total);
        dispatch(setOutcome(outcomeValue));
        dispatch(setIncome(incomeValue));
        dispatch(setBalance(total));
    }

    async function getTransactions() {
        dispatch(enableLoading());
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const {data} = await api.get(`/v1/transactions?month=${month}&year=${year}`);
        const values: any[] = [];

        for (const transaction of data) {
            //TODO: trocar values para uma variavel 'global', dentro de redux
            values.push({
                id: transaction.ID,
                title: transaction.name,
                value: transaction.price,
                category: transaction.category,
                date: transaction.date,
                type: transaction.type,
                paid: transaction.paid,
                description: transaction.description,
            })
        }

        const mostOutcome = values
            .filter((item) => item.type === 'outcome' && item.category !== 'Saldo Conta')
            .sort((a, b) => {
                return parseFloat(b.value) - parseFloat(a.value);
            })
            .slice(0, 3)
            .filter((item, index, self) =>
                    index === self.findIndex((t) => (
                        t.category === item.category
                    ))
            )
            .map((item) => ({
                title: item.category.toLowerCase()
            }));

        setMostOutcome(mostOutcome);

        const orderedValues = values.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setCountTransactions(orderedValues.length)

        //group by date
        const groupedValues = orderedValues.reduce((acc, item) => {
            const date = moment(item.date).format('DD/MM/YYYY');

            if (!acc[date]) {
                acc[date] = [];
            }

            acc[date].push(item);

            return acc;
        }, {});

        const valuesGrouped = Object
            .keys(groupedValues)
            .map((item) => {
                return {
                    date: item,
                    values: groupedValues[item]
                }
            });

        setTransactions(valuesGrouped);
        dispatch(setTransactionsAction(orderedValues));

        calculateBalance(values)
        dispatch(disableLoading());
    }

    const goToScreen = (path: string) => {
        navigation.navigate(path, {date: moment(date).toISOString()});
    }

    const renderMonthYear = () => {
        const month = moment(date).format('MM');
        const year = moment(date).format('YYYY');

        return `${month}/${year}`;
    }

    const handleToggleDatePicker = () => setShowDatePicker((prevState) => !prevState);

    const getMonthsMoment = () => {
        const months = moment
            .months()
            .map((item, index) => {
                return {
                    id: index + 1,
                    name: item
                }
            });

        setMonths(months);
    }

    async function logout() {
        Alert.alert(
            'Sair da conta',
            'Tem certeza que deseja sair da sua conta?',
            [
                {
                    text: 'Sim, sair',
                    onPress: async () => {
                        await AsyncStorage.removeItem('@iFinance-status');

                        navigation.reset({
                            index: 0,
                            routes: [{name: 'Login'}],
                        })
                    }
                },
                {
                    text: 'Não, ficar na conta'
                }
            ])
    }

    const TopContent = () => {
        return (
            <View>
                <View style={{alignItems: 'flex-start'}}>
                    <HeaderWrapper>
                        <CurrentBalance/>

                        <Actions date={date}/>
                        <OverviewMoney/>
                    </HeaderWrapper>
                </View>

                <MostOutcome
                    countTransactions={countTransactions}
                    mostOutcome={mostOutcome}
                />
            </View>
        )
    }

    return (
        <Layout>
            <StatusBar
                translucent
                backgroundColor={'#222222'}
                barStyle={'dark-content'}
            />

            {$balance.loading && (
                <LoadingWrapper>
                    <ActivityIndicator size={'large'} color={'#fff'}/>
                </LoadingWrapper>
            )}

            <FlatList
                data={transactions}
                keyExtractor={(item: any) => item.date}
                contentContainerStyle={{gap: 10, paddingBottom: 200, paddingHorizontal: 16}}
                renderItem={({item}: {item: any}) => <LastTransactionItem transaction={item}/>}
                ListHeaderComponent={() => <TopContent/>}
                ListEmptyComponent={() => (
                    <View>
                        <Text style={{fontSize: 18, color: '#333', opacity: .5}}>
                            Nenhuma transação encontrada
                        </Text>
                    </View>
                )}
            />
        </Layout>
    );
};

export default Home;
