import React from 'react';
import {Container, Layout, Money, Type} from "./styles";
import {Platform, Text} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import {convertToPrice} from "../../../store/reducers/balance";

const OverviewMoney = () => {
    const $balance = useSelector((state: RootState) => state.balance);

    return (
        <Layout>
            <Container>
                <Money>R${convertToPrice($balance.income)}</Money>
                <Type style={{fontSize: Platform.OS === 'ios' ? 16 : 12}}>
                    Entrada
                </Type>
            </Container>
            <Container>
                <Money>R${convertToPrice($balance.outcome)}</Money>
                <Type style={{fontSize: Platform.OS === 'ios' ? 16 : 12}}>
                    Saída
                </Type>
            </Container>
        </Layout>
    );
};

export default OverviewMoney;
