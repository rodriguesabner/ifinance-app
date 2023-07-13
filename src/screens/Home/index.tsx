import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Alert, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {
    DateText,
    DateWrapper,
    FlatList,
    HeaderWrapper,
    Layout,
    LoadingWrapper,
    TitleGreenText,
    TitleHeader
} from "./styles";
import CurrentBalance from "../../components/Home/CurrentBalance";
import LastTransactionItem from "../../components/Home/LastTransactionItem";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {onValue, ref} from "firebase/database";
import {database} from "../../config/firebase.config";
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
import {CaretLeft, CaretRight, SignOut} from "phosphor-react-native";
import OverviewMoney from "../../components/Home/OverviewMoney";
import MostOutcome from "../../components/Home/MostOutcome";
import Actions from "../../components/Home/Actions";
import RNDateTimePicker from "@react-native-community/datetimepicker";

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

        const ret = $balance.databaseRef + `/${year}/${month}`;
        const user: any = await AsyncStorage.getItem('@iFinance-status');
        const sanitizedUser = JSON.parse(user);

        onValue(ref(database, ret), (snapshot) => {
            const data = snapshot.val();
            const values: any[] = [];

            for (let key in data) {
                if (data[key].userId !== sanitizedUser?.id) continue;

                values.push({
                    id: key,
                    title: data[key].name,
                    value: data[key].price,
                    category: data[key].category,
                    date: data[key].date,
                    type: data[key].type,
                    paid: data[key].paid,
                    description: data[key].description,
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
        });
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
                        <TitleHeader>
                            <TitleGreenText style={{color: '#a1f062'}}>
                            Economize tempo e esforço</TitleGreenText> deixando
                            {"\n"}
                            todo trabalho <TitleGreenText>conosco!</TitleGreenText>
                        </TitleHeader>

                        <TouchableOpacity onPress={() => logout()}>
                            <SignOut color={"#fff"} size={24} weight={"bold"}/>
                        </TouchableOpacity>
                    </HeaderWrapper>

                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20}}>
                        <TouchableOpacity
                            onPress={() => {
                                const dateSelected = moment(date).subtract(1, 'month').toDate();
                                setDate(dateSelected);
                            }}
                        >
                            <CaretLeft color={"#fff"} size={24} weight={"bold"}/>
                        </TouchableOpacity>

                        <DateWrapper
                            onPress={() => handleToggleDatePicker()}
                        >
                            <DateText>{renderMonthYear()}</DateText>
                        </DateWrapper>
                        <TouchableOpacity
                            onPress={() => {
                                const dateSelected = moment(date).add(1, 'month').toDate();
                                setDate(dateSelected);
                            }}
                        >
                            <CaretRight color={"#fff"} size={24} weight={"bold"}/>
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%'
                        }}>
                            <RNDateTimePicker
                                style={{marginTop: 10}}
                                mode={'date'}
                                value={date}
                                display={'spinner'}
                                locale={'pt-BR'}
                                onChange={(event, selectedDate) => {
                                    const currentDate = selectedDate || date;
                                    setDate(currentDate);
                                    setShowDatePicker(false);
                                }}
                            />
                        </View>
                    )}

                    <CurrentBalance/>
                    <OverviewMoney/>
                </View>

                <Actions date={date}/>

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
                barStyle={'light-content'}
            />

            {$balance.loading && (
                <LoadingWrapper>
                    <ActivityIndicator size={'large'} color={'#fff'}/>
                </LoadingWrapper>
            )}

            <FlatList
                data={transactions}
                keyExtractor={item => item.date}
                contentContainerStyle={{gap: 10, paddingBottom: 200, paddingHorizontal: 16}}
                renderItem={({item}) => <LastTransactionItem transaction={item}/>}
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
