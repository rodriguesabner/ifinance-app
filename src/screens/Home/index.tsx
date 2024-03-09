import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StatusBar, Text, TouchableOpacity, View} from "react-native";
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
import OverviewMoney from "../../components/Home/OverviewMoney";
import MostOutcome from "../../components/Home/MostOutcome";
import Actions from "../../components/Home/Actions";
import api from "../../services/api";
import {Calendar, SignOut} from "phosphor-react-native";
import {getTransactionsDb} from "../../database/transaction";

const Home = () => {
    const dispatch = useDispatch();
    const $balance = useSelector((state: RootState) => state.balance);
    const navigation: NavigationProp<any> = useNavigation();

    const [transactions, setTransactions] = useState<any[]>([]);
    const [mostOutcome, setMostOutcome] = useState<any[]>([]);
    const [, setTotalBalance] = useState(0);
    const [countTransactions, setCountTransactions] = useState(0);

    useEffect(() => {
        getTransactions([]);
    }, [$balance.currentDate])

    useEffect(() => {
        if ($balance.transactionChanged) {
            getTransactions($balance.transactions);
        }
    }, [$balance.transactionChanged, $balance.transactions])

    function calculateBalance(transactions: any[]) {
        let total: number = 0;

        const incomeValue = transactions
            .filter((item) => item?.type === 'income')
            .reduce((acc, item) => {
                return acc + parseFloat(item.price);
            }, 0);

        const outcomeValue = transactions
            .filter((item) => item.type === 'outcome')
            .reduce((acc, item) => {
                return acc + parseFloat(item.price);
            }, 0);

        total = incomeValue - outcomeValue;

        setTotalBalance(total);
        dispatch(setOutcome(outcomeValue));
        dispatch(setIncome(incomeValue));
        dispatch(setBalance(total));
    }

    async function fetchTransactions() {
        const month = new Date($balance.currentDate).getMonth() + 1;
        const year = new Date($balance.currentDate).getFullYear();

        let data: any;
        if ($balance.isOffline) {
            const {rows} = await getTransactionsDb(month, year);
            data = rows._array;
        } else {
            const ret = await api.get(`/v1/transactions?month=${month}&year=${year}`);
            data = ret.data;
        }

        if (data == null) {
            return [];
        }

        return data;
    }

    async function getTransactions(transactions: any[]) {
        dispatch(enableLoading());

        if (transactions.length <= 0) {
            transactions = await fetchTransactions();
        }

        const list: any[] = [];

        for (const transaction of transactions) {
            list.push({
                id: transaction.ID ?? transaction.id,
                name: transaction.name,
                price: transaction.price,
                category: transaction.category,
                date: transaction.date,
                type: transaction.type,
                paid: transaction.paid === 1 || transaction.paid === true,
                description: transaction.description,
            })
        }

        const mostOutcome = list
            .filter((item) => item.type === 'outcome' && item.category !== 'Saldo Conta')
            .sort((a, b) => {
                return parseFloat(b.price) - parseFloat(a.price);
            })
            .slice(0, 3)
            .filter((item, index, self) =>
                    index === self.findIndex((t) => (
                        t.category === item.category
                    ))
            )
            .map((item) => ({
                name: item.category.toLowerCase()
            }));

        setMostOutcome(mostOutcome);

        const orderedValues = list.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setCountTransactions(orderedValues.length)

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

        calculateBalance(list)
        dispatch(disableLoading());
    }

    const TopContent = () => {
        return (
            <View>
                <View style={{alignItems: 'flex-start'}}>
                    <HeaderWrapper>
                        <View style={{flexDirection: 'row', justifyContent: "space-between"}}>
                            <CurrentBalance/>

                            <View style={{flexDirection: 'row', gap: 20, marginTop: 10}}>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('DateChooser')
                                }}>
                                    <Calendar/>
                                </TouchableOpacity>

                                {!$balance.isOffline && <SignOut/>}
                            </View>
                        </View>

                        <Actions date={new Date($balance.currentDate)}/>
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
                backgroundColor={"#fff"}
                barStyle={'dark-content'}
            />

            {$balance.loading && (
                <LoadingWrapper>
                    <ActivityIndicator size={'large'} color={'#fff'}/>
                </LoadingWrapper>
            )}

            <FlatList
                data={transactions}
                contentContainerStyle={{gap: 10, paddingBottom: 200, paddingHorizontal: 16}}
                renderItem={({item}: { item: any }) => <LastTransactionItem transaction={item}/>}
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
