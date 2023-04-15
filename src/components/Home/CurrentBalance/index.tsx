import React from 'react';
import {BottomContainer, Currency, Layout, OutcomeValue, TopContainer, Total} from "./styles";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import {Button, Text, TouchableOpacity, View} from "react-native";
import {convertToPrice, toggleHiddenValues} from "../../../store/reducers/balance";

const CurrentBalance = () => {
    const dispatch = useDispatch();
    const $balance = useSelector((state: RootState) => state.balance);

    const hiddeValue = (value: any): string => {
        if($balance.hiddeValue) return '*****';

        return convertToPrice(value);
    }

    const handleToggleHidden = (): void => {
        dispatch(toggleHiddenValues());
    }

    return (
        <Layout>
            <BottomContainer>
                <OutcomeValue>R${hiddeValue($balance.outcome)}</OutcomeValue>
                <Text>{"("}Saída{")"}</Text>
            </BottomContainer>
            <BottomContainer>
                <OutcomeValue>R${hiddeValue($balance.income)}</OutcomeValue>
                <Text>{"("}Entrada{")"}</Text>
            </BottomContainer>
            <TopContainer>
                <Total>{hiddeValue($balance.total)}</Total>
                <Currency>{$balance.currency}</Currency>
            </TopContainer>

            <TouchableOpacity onPress={() => handleToggleHidden()}>
                {!$balance.hiddeValue ? (
                    <Text>Esconder valores</Text>
                ) : (
                    <Text>Mostrar valores</Text>
                )}
            </TouchableOpacity>
        </Layout>
    );
};

export default CurrentBalance;
