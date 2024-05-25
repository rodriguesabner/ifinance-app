import React from 'react';
import {Container, Layout, Title} from "./styles";
import {ArrowDown, ArrowUp, X} from "phosphor-react-native";
import {Text, TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import moment from "moment";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers";

const ChooseActionAdd = () => {
    const navigation = useNavigation();
    const $balance = useSelector((state: RootState) => state.balance);

    const goToScreen = (path: string, type: string) => {
        const propsNavigation = {};

        Object.assign(propsNavigation, {
            date: $balance.currentDate,
            type: type.toLowerCase()
        })

        navigation.goBack();
        navigation.navigate(path, propsNavigation);
    }

    return (
        <Layout>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <X/>
            </TouchableOpacity>
            <View>
                <Title>
                    O que vamos <Text style={{fontWeight: 'bold'}}>adicionar?</Text>
                </Title>

                <View style={{flexDirection: 'row', gap: 20, justifyContent: 'space-between'}}>
                    <Container>
                        <TouchableOpacity
                            style={{flex: 1, alignItems: 'center', gap: 10}}
                            onPress={() => goToScreen("Transaction", "income")}
                        >
                            <ArrowUp size={26} color={'#61b648'}/>
                            <Text>
                                Receita
                            </Text>
                        </TouchableOpacity>
                    </Container>

                    <Container>
                        <TouchableOpacity
                            style={{flex: 1, alignItems: 'center', gap: 10}}
                            onPress={() => goToScreen("Transaction", 'outcome')}
                        >
                            <ArrowDown size={26} color={'#b64848'}/>
                            <Text>Despesa</Text>
                        </TouchableOpacity>
                    </Container>
                </View>
            </View>
        </Layout>
    );
};

export default ChooseActionAdd;
