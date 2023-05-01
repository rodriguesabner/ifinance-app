import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Image, Pressable, StatusBar, Text, View} from "react-native";
import {Header, Layout} from "./styles";
import WrapperTitle from "../../components/Home/WrapperTitle";
import LastTransactionItem from "./LastTransactionItem";
import {onValue, ref} from "firebase/database";
import {database} from "../../config/firebase.config";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {Currency, Total} from "../../components/Home/CurrentBalance/styles";
import 'moment/locale/pt-br';
import {convertToPrice} from "../../store/reducers/balance";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Reserve = () => {
    const navigation: NavigationProp<any> = useNavigation();
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
        const user: any = await AsyncStorage.getItem('@iFinance-status');
        const sanitizedUser = JSON.parse(user);

        onValue(ref(database, ret), (snapshot) => {
            const data = snapshot.val();
            const values: any[] = [];

            for (let yearKey in data) {
                const yearData = data[yearKey];
                for (let monthKey in yearData) {
                    const monthData = yearData[monthKey];
                    for (let transactionKey in monthData) {
                        const transaction = monthData[transactionKey];
                        if (
                            transaction.category === 'Reserva' &&
                            monthData[transactionKey].userId === sanitizedUser.id
                        ) {
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
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            });

            setTransactions(orderedValues)
            calculateTotal(values)
            setLoading(false)
        });
    }

    const TopContent = () => {
        return (
            <Header>
                <View style={{alignItems: 'flex-start'}}>
                    <Pressable onPress={() => navigation.goBack()} style={{marginBottom: 20}}>
                        <Image
                            source={require('../../assets/caret-left.png')}
                            style={{
                                width: 30,
                                height: 30,
                            }}
                        />
                    </Pressable>

                    <WrapperTitle
                        title={'Minhas Finanças'}
                        subtitle={'Reserva'}
                    />
                </View>

                <View style={{
                    marginVertical: 36,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Total>{convertToPrice(totalBalance)}</Total>
                    <Currency>{$balance.currency}</Currency>
                </View>

                <WrapperTitle
                    title={'Histórico'}
                    subtitle={'_'}
                />
            </Header>
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
                    style={{flex: 1, width: '100%'}}
                    contentContainerStyle={{gap: 10, paddingBottom: 120}}
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
