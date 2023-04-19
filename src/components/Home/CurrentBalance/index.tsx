import React from 'react';
import {BottomContainer, Currency, Layout, OutcomeValue, TopContainer, Total} from "./styles";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import {Text, TouchableOpacity} from "react-native";
import {convertToPrice, toggleHiddenValues} from "../../../store/reducers/balance";
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';

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

    const copyBalanceClipboard = async () => {
        const value = $balance.total
            .toString()
            .replace('-', '');

        const price = convertToPrice(value)
        await Clipboard.setStringAsync(price);

        Toast.show('O saldo foi copiado para a área de transferência.');
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
                <Total
                    onLongPress={() => !$balance.hiddeValue && copyBalanceClipboard()}
                >
                    {hiddeValue($balance.total)}
                </Total>
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
