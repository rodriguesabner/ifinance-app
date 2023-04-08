import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from "react-native";
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

    const [transactions, setTransactions] = useState<any[]>([]);
    const [date, setDate] = useState(new Date());
    const [totalBalance, setTotalBalance] = useState<any>(0);

    useEffect(() => {
        function calculateTotal(transactions: any[]) {
            const total = transactions
                .filter((item) => item?.type === 'income')
                .reduce((acc, item) => {
                    return acc + parseFloat(item.value);
                }, 0);

            setTotalBalance(total.toFixed(2));
        }

        async function getTransactions() {
            const year = date.getFullYear();
            const ret = $balance.databaseRef + `/${year}`;

            onValue(ref(database, ret), (snapshot) => {
                const data = snapshot.val();
                const values: any[] = [];

                for (let key in data) {
                    const monthData = data[key];
                    for (let key in monthData) {
                        const categoryData = monthData[key];
                        if (categoryData.category === 'Reserva') {
                            values.push({
                                id: key,
                                title: categoryData.name,
                                value: categoryData.price,
                                category: categoryData.category,
                                date: categoryData.date,
                                type: 'income'
                            });
                        }
                    }
                }

                const orderedValues = values.sort((a, b) => {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                });

                setTransactions(orderedValues)
                calculateTotal(values)
            });
        }

        getTransactions();
    }, [date])

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
            <FlatList
                data={transactions}
                keyExtractor={item => item.id}
                contentContainerStyle={{gap: 20}}
                nestedScrollEnabled={true}
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
        </Layout>
    );
};

export default Reserve;
