import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Text, View} from "react-native";
import {Header, Layout} from "./styles";
import WrapperTitle from "../../components/Home/WrapperTitle";
import LastTransactionItem from "./LastTransactionItem";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {Currency, Total} from "../../components/Home/CurrentBalance/styles";
import 'moment/locale/pt-br';
import {convertToPrice} from "../../store/reducers/balance";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {BackButton} from "../Transaction/SelectCategory/styles";
import {ArrowLeft} from "phosphor-react-native";
import api from "../../services/api";

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
        const {data} = await api.get(`/v1/transactions?category=Reserva`);
        const values: any[] = [];

        for (const transaction of data) {
            values.push({
                id: transaction.ID,
                title: transaction.name,
                value: transaction.price,
                category: transaction.category,
                date: transaction.date,
                type: 'income'
            });
        }

        const orderedValues = values.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        setTransactions(orderedValues)
        calculateTotal(values)
        setLoading(false)
    }

    const TopContent = () => {
        return (
            <Header>
                <View style={{alignItems: 'flex-start'}}>
                    <BackButton onPress={() => navigation.goBack()}>
                        <ArrowLeft size={24} color={'#000'}/>
                    </BackButton>

                    <WrapperTitle
                        title={''}
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
                    renderItem={({item}) => <LastTransactionItem backgroundColor={'#eaeee8'} transaction={item}/>}
                    ListHeaderComponent={() => <TopContent/>}
                    ListEmptyComponent={() => (
                        <View>
                            <Text style={{fontSize: 18, color: '#000', opacity: .5}}>
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
