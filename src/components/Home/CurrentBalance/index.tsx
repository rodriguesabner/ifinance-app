import React from 'react';
import {Currency, DescriptionTotal, Layout, TopContainer, Total} from "./styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import {convertToPrice} from "../../../store/reducers/balance";
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';

const CurrentBalance = () => {
    const $balance = useSelector((state: RootState) => state.balance);

    const hiddeValue = (value: any): string => {
        if ($balance.hiddeValue) return '*****';

        return convertToPrice(value);
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
            <TopContainer>
                <Total
                    color={$balance.total < 0 ? '#de4b4b' : '#339461'}
                    onLongPress={() => !$balance.hiddeValue && copyBalanceClipboard()}
                >
                    {hiddeValue($balance.total)}
                </Total>
                <Currency>{$balance.currency}</Currency>
            </TopContainer>
            <DescriptionTotal>
                Você terá no final do mês
            </DescriptionTotal>
        </Layout>
    );
};

export default CurrentBalance;
