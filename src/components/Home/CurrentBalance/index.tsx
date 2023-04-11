import React from 'react';
import {BottomContainer, Currency, Layout, OutcomeValue, TopContainer, Total} from "./styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import {Text, View} from "react-native";

const CurrentBalance = () => {
    const $balance = useSelector((state: RootState) => state.balance);

    return (
        <Layout>
            <BottomContainer>
                <OutcomeValue>R${$balance.outcome}</OutcomeValue>
                <Text>{"("}Saída{")"}</Text>
            </BottomContainer>
            <BottomContainer>
                <OutcomeValue>R${$balance.income}</OutcomeValue>
                <Text>{"("}Entrada{")"}</Text>
            </BottomContainer>
            <TopContainer>
                <Total>{$balance.total}</Total>
                <Currency>{$balance.currency}</Currency>
            </TopContainer>
        </Layout>
    );
};

export default CurrentBalance;
