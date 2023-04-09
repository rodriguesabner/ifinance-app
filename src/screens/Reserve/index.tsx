import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from "react-native";
import {Layout} from "./styles";
import WrapperTitle from "../../components/Home/WrapperTitle";
import LastTransactionItem from "../../components/Home/LastTransactionItem";
import {onValue, ref} from "firebase/database";
import {database} from "../../config/firebase.config";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {Currency, Total} from "../../components/Home/CurrentBalance/styles";
import 'moment/locale/pt-br';

const Reserve = () => {
    const $balance = useSelector((state: RootState) => state.balance);

    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [totalBalance, setTotalBalance] = useState<any>(0);

    useEffect(() => {
        getTransactions();
    }, [])

    function calculateTotal(transactions: any[]) {
        const total = transactions
            .filter((item) => item?.type === 'income')
            .reduce((acc, item) => {
                return acc + parseFloat(item.value);
            }, 0);

        setTotalBalance(total.toFixed(2));
    }

    async function getTransactions() {
        const ret = $balance.databaseRef;
        onValue(ref(database, ret), (snapshot) => {
            const data = snapshot.val();
            const values: any[] = [];

            for (let yearKey in data) {
                const yearData = data[yearKey];
                for (let monthKey in yearData) {
                    const monthData = yearData[monthKey];
                    for (let transactionKey in monthData) {
                        const transaction = monthData[transactionKey];
                        if (transaction.category === 'Reserva') {
                            values.push({
                                id: transactionKey,
                                title: transaction.name,
                                value: transaction.price,
                                category: transaction.category,
                                date: transaction.date,
                                type: 'income'
                            });
                        }
                    }
                }
            }

            const orderedValues = values.sort((a, b) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            setTransactions(orderedValues)
            calculateTotal(values)
            setLoading(false)
        });
    }

    const TopContent = () => {
        return (
            <View>
                <View style={{alignItems: 'flex-start'}}>
                    <WrapperTitle
                        title={'Minhas Finanças'}
                        subtitle={'Reserva'}
                    />
                </View>

                <View style={{
                    marginVertical: 36,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Total>{totalBalance}</Total>
                    <Currency>{$balance.currency}</Currency>
                </View>

                <WrapperTitle
                    title={'Últimos Investimentos'}
                    subtitle={'Lançamentos'}
                />
            </View>
        )
    }

    return (
        <Layout>
            {loading ? (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size={'large'} color={'#000'}/>
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{gap: 20, paddingBottom: 120}}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => <LastTransactionItem backgroundColor={'#d2d7fa'} transaction={item}/>}
                    ListHeaderComponent={() => <TopContent/>}
                    ListEmptyComponent={() => (
                        <View>
                            <Text style={{fontSize: 18, color: '#333', opacity: .5}}>
                                Nenhum investimento encontrado
                            </Text>
                        </View>
                    )}
                />
            )}
        </Layout>
    );
};

export default Reserve;
