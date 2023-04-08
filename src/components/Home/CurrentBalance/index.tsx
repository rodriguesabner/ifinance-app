import React from 'react';
import {Currency, Layout, Total} from "./styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/reducers";

const CurrentBalance = () => {
    const $balance = useSelector((state: RootState) => state.balance);

    return (
        <Layout>
            <Total>{$balance.total}</Total>
            <Currency>{$balance.currency}</Currency>
        </Layout>
    );
};

export default CurrentBalance;
