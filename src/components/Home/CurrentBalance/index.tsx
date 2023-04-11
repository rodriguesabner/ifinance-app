import React from 'react';
import {BottomContainer, Currency, Layout, OutcomeValue, TopContainer, Total} from "./styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import {Text, View} from "react-native";

const CurrentBalance = () => {
    const $balance = useSelector((state: RootState) => state.balance);

    const convertToPrice = (value: any) => {
        return new Intl.NumberFormat('pt-BR').format(value);
    }

    return (
        <Layout>
            <BottomContainer>
                <OutcomeValue>R${convertToPrice($balance.outcome)}</OutcomeValue>
                <Text>{"("}Saída{")"}</Text>
            </BottomContainer>
            <BottomContainer>
                <OutcomeValue>R${convertToPrice($balance.income)}</OutcomeValue>
                <Text>{"("}Entrada{")"}</Text>
            </BottomContainer>
            <TopContainer>
                <Total>{convertToPrice($balance.total)}</Total>
                <Currency>{$balance.currency}</Currency>
            </TopContainer>
        </Layout>
    );
};

export default CurrentBalance;
