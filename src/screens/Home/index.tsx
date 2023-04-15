import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StatusBar, Text, View} from "react-native";
import {ActionIcon, ActionItem, LoadingWrapper, DateText, DateWrapper, FlatList, Layout, WrapperActions} from "./styles";
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
import Header from "../../components/Header";
import 'moment/locale/pt-br';
import {useSwipe} from "../../hooks/useSwipe";

const Home = () => {
    const dispatch = useDispatch();
    const $balance = useSelector((state: RootState) => state.balance);
    const navigation: NavigationProp<any> = useNavigation();
    const {onTouchStart, onTouchEnd} = useSwipe(onSwipeLeft, onSwipeRight, 6)

    const [transactions, setTransactions] = useState<any[]>([]);
    const [date, setDate] = useState(new Date());
    const [totalBalance, setTotalBalance] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        getTransactions();
    }, [date])

    function onSwipeLeft() {
        const newDate = moment(date).add(1, 'month').toDate();
        setDate(newDate);
    }

    function onSwipeRight() {
        const newDate = moment(date).subtract(1, 'month').toDate();
        setDate(newDate);
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

        onValue(ref(database, ret), (snapshot) => {
            const data = snapshot.val();
            const values: any[] = [];

            for (let key in data) {
                values.push({
                    id: key,
                    title: data[key].name,
                    value: data[key].price,
                    category: data[key].category,
                    date: data[key].date,
                    type: data[key].type
                })
            }

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

    const TopContent = () => {
        return (
            <View>
                <StatusBar
                    translucent
                    backgroundColor={totalBalance < 0 ? '#f0cccc' : '#ccf0e3'}
                    barStyle={'dark-content'}
                />

                <Header/>

                <View style={{alignItems: 'flex-start'}}>
                    <WrapperTitle
                        title={'Minhas Finanças'}
                        subtitle={'Controle Financeiro'}
                    />

                    <DateWrapper
                        onPress={() => handleToggleDatePicker()}
                    >
                        <DateText>{renderMonthYear()}</DateText>
                    </DateWrapper>

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
            </View>
        )
    }

    return (
        <Layout
            backgroundColor={totalBalance < 0 ? '#f0cccc' : '#ccf0e3'}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {$balance.loading && (
                <LoadingWrapper>
                    <ActivityIndicator size={'large'} color={'#fff'}/>
                </LoadingWrapper>
            )}

            <FlatList
                data={transactions}
                keyExtractor={item => item.id}
                contentContainerStyle={{gap: 20, paddingBottom: 160, paddingHorizontal: 20}}
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
