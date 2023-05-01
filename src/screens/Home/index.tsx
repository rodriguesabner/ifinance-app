import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Image, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {
    ActionIcon,
    ActionItem,
    DateText,
    DateWrapper,
    FlatList,
    FlatListMonths,
    Layout,
    LoadingWrapper,
    WrapperActions
} from "./styles";
import WrapperTitle from "../../components/Home/WrapperTitle";
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
import RNDateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import 'moment/locale/pt-br';
import BottomNavigation from "../../components/BottomNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
    const dispatch = useDispatch();
    const $balance = useSelector((state: RootState) => state.balance);
    const navigation: NavigationProp<any> = useNavigation();

    const flatListMonthsRef = useRef<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [mostOutcome, setMostOutcome] = useState<any[]>([]);
    const [date, setDate] = useState(new Date());
    const [totalBalance, setTotalBalance] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [months, setMonths] = useState<any>([]);

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

        const outcomeValue = transactions
            .filter((item) => item.type === 'outcome')
            .reduce((acc, item) => {
                return acc + parseFloat(item.value);
            }, 0);

        const incomeValue = transactions
            .filter((item) => item?.type === 'income')
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
                //without duplication
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

            setTransactions(orderedValues)
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

    const handleChooseMonth = (selectedMonth: string) => {
        const day = moment().format('DD');
        const month = months.find((item: any) => item.name === selectedMonth)?.id;
        const year = moment().format('YYYY');

        const selectedDate = moment(`${day}/${month}/${year}`, 'DD/MM/YYYY').toDate();
        const currentDate = selectedDate || date;
        setDate(currentDate);
    }

    const TopContent = () => {
        return (
            <View style={{marginBottom: 20}}>
                <View style={{alignItems: 'flex-start'}}>
                    <WrapperTitle
                        title={'Minhas Finanças'}
                        subtitle={'Controle Financeiro'}
                    />

                    <View
                        style={{
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            marginTop: 15
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                const dateSelected = moment(date).subtract(1, 'month').toDate();
                                setDate(dateSelected);
                            }}
                        >
                            <Image
                                style={{
                                    width: 24,
                                    height: 24
                                }}
                                source={require('../../assets/caret-left.png')}
                            />
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
                            <Image
                                style={{
                                    width: 24,
                                    height: 24
                                }}
                                source={require('../../assets/caret-right.png')}
                            />
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
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
                    )}
                </View>

                <CurrentBalance/>
                <WrapperActions>
                    <ActionItem onPress={() => goToScreen('Expense')}>
                        <ActionIcon>
                            <Text style={{color: '#fff', fontSize: 32}}>-</Text>
                        </ActionIcon>
                        <Text>Despesa</Text>
                    </ActionItem>

                    <ActionItem onPress={() => goToScreen('Revenue')}>
                        <ActionIcon>
                            <Text style={{color: '#fff', fontSize: 32}}>+</Text>
                        </ActionIcon>
                        <Text>Receita</Text>
                    </ActionItem>
                </WrapperActions>

                <WrapperTitle
                    title={'Últimas Transações'}
                    subtitle={'Transações'}
                />

                <Text>
                    Suas maiores saídas são em {
                    mostOutcome.map((item: any, index) => (
                        <Text key={index}>
                            {item.title}{index < mostOutcome.length - 1 ? ', ' : ''}
                        </Text>
                    ))}
                </Text>

                {months.length > 0 && (
                    <FlatListMonths
                        ref={flatListMonthsRef}
                        data={months}
                        horizontal
                        keyExtractor={(item) => item.name}
                        refreshing={false}
                        maintainVisibleContentPosition={{
                            minIndexForVisible: 0,
                            autoscrollToTopThreshold: 10,
                            // @ts-ignore
                            key: months.findIndex((item: any) => item.name === moment(date).format('MMMM'))
                        }}
                        onContentSizeChange={() => {
                            flatListMonthsRef.current?.scrollToIndex({
                                index: months.findIndex((item: any) => item.name === moment(date).format('MMMM')),
                            });
                        }}
                        onScrollToIndexFailed={(info) => {
                            const wait = new Promise(resolve => setTimeout(resolve, 500));
                            wait.then(() => {
                                flatListMonthsRef.current?.scrollToIndex({
                                    index: info.index,
                                    animated: true,
                                    viewPosition: 0.5
                                });
                            })
                        }}
                        contentContainerStyle={{gap: 10}}
                        renderItem={({item}) => (
                            <DateWrapper
                                isActive={item.name === moment(date).format('MMMM')}
                                onPress={() => handleChooseMonth(item.name)}
                            >
                                <DateText>{item.name}</DateText>
                            </DateWrapper>
                        )}
                    />
                )}
            </View>
        )
    }

    return (
        <Layout
            backgroundColor={totalBalance < 0 ? '#f0cccc' : '#ccf0e3'}
        >
            <StatusBar
                translucent
                backgroundColor={totalBalance < 0 ? '#f0cccc' : '#ccf0e3'}
                barStyle={'dark-content'}
            />

            {$balance.loading && (
                <LoadingWrapper>
                    <ActivityIndicator size={'large'} color={'#fff'}/>
                </LoadingWrapper>
            )}

            <FlatList
                data={transactions}
                keyExtractor={item => item.id}
                contentContainerStyle={{gap: 10, paddingBottom: 200, paddingHorizontal: 20}}
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

            <BottomNavigation/>
        </Layout>
    );
};

export default Home;
