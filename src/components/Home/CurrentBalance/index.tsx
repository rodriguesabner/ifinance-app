import React, {useEffect, useState} from 'react';
import {Currency, DescriptionTotal, Layout, TopContainer, Total} from "./styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";
import {convertToPrice} from "../../../store/reducers/balance";
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import {useSQLiteContext} from "expo-sqlite";

const CurrentBalance = () => {
    const $balance = useSelector((state: RootState) => state.balance);
    const db = useSQLiteContext();
    const [version, setVersion] = useState('');

    useEffect(() => {
        async function setup() {
            const result = await db.getFirstAsync<{ 'sqlite_version()': string }>(
                'SELECT sqlite_version()'
            );

            if (result) {
                setVersion(result['sqlite_version()']);
            }
        }

        setup();
    }, []);

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
            <DescriptionTotal>
                Saldo Atual
            </DescriptionTotal>
            <TopContainer>
                <Total
                    onLongPress={() => !$balance.hiddeValue && copyBalanceClipboard()}
                >
                    {hiddeValue($balance.total)}
                </Total>
                <Currency>{$balance.currency}</Currency>
            </TopContainer>
        </Layout>
    );
};

export default CurrentBalance;
