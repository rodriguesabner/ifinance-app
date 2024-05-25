import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {FlatList, HeaderWrapper, Layout, LoadingWrapper} from "./styles";
import CurrentBalance from "../../components/Home/CurrentBalance";
import LastTransactionItem from "../../components/Home/LastTransactionItem";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {
    calculateBalance,
    disableLoading,
    enableLoading,
    setBalance,
    setIncome,
    setOutcome, setRawTransactionsAction,
    setTransactionsAction
} from "../../store/reducers/balance";
import moment from "moment";
import 'moment/locale/pt-br';
import MostOutcome from "../../components/Home/MostOutcome";
import {Calendar, SignOut} from "phosphor-react-native";
import {SQLiteDatabase, useSQLiteContext} from "expo-sqlite";
import {TransactionProps} from "../../interfaces/transaction.interface";
import BottomNavigation from "../../components/BottomNavigation";
import Assistant from "../../components/Home/Assistant";
import TransactionsToPay from "../../components/Home/TransactionsToPay";
import CreditCard from "../../components/Home/CreditCard";

const Home = () => {
    const dispatch = useDispatch();
    const db: SQLiteDatabase = useSQLiteContext();
    const $balance = useSelector((state: RootState) => state.balance);
    const navigation: NavigationProp<any> = useNavigation();

    const [rawTransactions, setRawTransactions] = useState([])
    const [transactions, setTransactions] = useState<any[]>([]);
    const [mostOutcome, setMostOutcome] = useState<any[]>([]);
    const [transactionToPay, setTransactionToPay] = useState<any[]>([])
    const [, setTotalBalance] = useState(0);
    const [countTransactions, setCountTransactions] = useState(0);

    useEffect(() => {
        void getRawTransactions();
        void getTransactions([]);
    }, [$balance.currentDate])

    useEffect(() => {
        if ($balance.transactionChanged) {
            void getRawTransactions();
            void getTransactions($balance.transactions);
        }
    }, [$balance.transactionChanged, $balance.transactions])

    async function getRawTransactions(){
        if($balance.rawTransactions.length <= 0) {
            const rawData = await db.getAllAsync<TransactionProps[]>(
                `SELECT * FROM transactions`,
            );

            dispatch(setRawTransactionsAction(rawData));
        }
    }

    async function fetchTransactions() {
        const month = new Date($balance.currentDate).getMonth() + 1;
        const year = new Date($balance.currentDate).getFullYear();

        let choosedMonth = month.toString()

        if (month < 10) {
            choosedMonth = `0${month}`.slice(-2);
        }

        const data = await db.getAllAsync<TransactionProps[]>("" +
            `SELECT *
             FROM transactions
             WHERE strftime('%m', date) = ?
               AND strftime('%Y', date) = ?;`,
            [choosedMonth, year.toString()]
        );

        setRawTransactions(data);

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

        setTransactionToPay(list.filter((item) => item.type === 'outcome' && item.category !== 'Saldo Conta' && item.paid === false && item.price > 0));

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

        const {total, incomeValue, outcomeValue} = calculateBalance(list);
        setTotalBalance(total);
        dispatch(setOutcome(outcomeValue));
        dispatch(setIncome(incomeValue));
        dispatch(setBalance(total));

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

                        {/*<Actions date={new Date($balance.currentDate)}/>*/}
                        {/*<OverviewMoney/>*/}

                        <TransactionsToPay transactionsToPay={transactionToPay}/>
                    </HeaderWrapper>
                </View>

                <CreditCard transactions={rawTransactions}/>

                <Assistant transactions={transactions}/>

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

            <BottomNavigation/>
        </Layout>
    );
};

export default Home;
