import React, {useEffect, useState} from 'react';
import {Header, Layout} from "./styles";
import {StatusBar, Text, View} from "react-native"
import WrapperTitle from "../../components/Home/WrapperTitle";
import {ArrowLeft, Plus} from "phosphor-react-native";
import {Button} from "../DateChooser/styles";
import {FlatList} from "../Home/styles";
import LastDebtItem from "../../components/Debts/LastDebtItem";
import {DebtProps} from "../../interfaces/debts.interface";
import {getDebtsDb} from "../../database/debts";
import {useNavigation} from "@react-navigation/native";
import {SQLiteDatabase, useSQLiteContext} from "expo-sqlite";

const Debts = () => {
    const navigation = useNavigation();
    const db: SQLiteDatabase = useSQLiteContext();
    const [debts, setDebts] = useState<DebtProps[]>([]);

    useEffect(() => {
        async function getDebts(){
            const {rows} = await db.getAllAsync<DebtProps[]>("SELECT * FROM debts;");
            setDebts(rows._array)
        }

        void getDebts();
    }, []);

    const TopContent = () => {
        return (
            <View>
                <Header>
                    <Button onPress={() => navigation.goBack()}>
                        <ArrowLeft/>
                    </Button>

                    <Button onPress={() => navigation.navigate('Debt')}>
                        <Plus/>
                    </Button>
                </Header>

                <View>
                    <WrapperTitle
                        title={''}
                        subtitle={`Dívidas`}
                    />
                    <Text>
                        Consulte suas dívidas de forma rápida.
                    </Text>
                </View>
            </View>
        )
    }
    return (
        <Layout>
            <StatusBar backgroundColor={'#fff'} />

            <FlatList
                data={debts}
                contentContainerStyle={{gap: 10, paddingBottom: 200, paddingHorizontal: 16}}
                renderItem={({item}: { item: DebtProps }) => <LastDebtItem debts={item}/>}
                ListHeaderComponent={() => <TopContent/>}
                ListEmptyComponent={() => (
                    <View>
                        <Text style={{fontSize: 18, color: '#333', opacity: .5}}>
                            Parabéns, você não tem nenhuma dívida no momento!
                        </Text>
                    </View>
                )}
            />
        </Layout>
    );
};

export default Debts;
