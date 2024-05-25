import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import ConfigDatabase from "../../database/config.database";

interface CategoryProps {
    title: string
}

export interface BalanceProps {
    loading: boolean,
    hiddeValue: boolean,
    databaseRef: string
    currency: 'BRL',
    total: number;
    income: number;
    outcome: number;
    transactions: any[];
    rawTransactions: any[];
    debts: any[];
    currentDate: string;
    categories: CategoryProps[];
    categoriesIncome: CategoryProps[];
    transactionChanged: boolean;
    isOffline: boolean;
}

const initialState: BalanceProps = {
    loading: true,
    hiddeValue: false,
    databaseRef: 'transactions/',
    currency: 'BRL',
    total: 0,
    income: 0,
    outcome: 0,
    transactions: [],
    rawTransactions: [],
    debts: [],
    currentDate: new Date().toISOString(),
    transactionChanged: false,
    isOffline: process.env.EXPO_PUBLIC_OFFLINE === 'true' ?? false,
    categories: [
        {title: 'Bem estar'},
        {title: 'Cartão de Crédito'},
        {title: 'Comida'},
        {title: 'Empréstimo'},
        {title: 'Educação'},
        {title: 'Moradia'},
        {title: 'Lazer'},
        {title: 'Reserva'},
        {title: 'Saúde'},
        {title: 'Salário'},
        {title: 'Saldo Conta'},
        {title: 'Tarifas Bancárias'},
        {title: 'Tranferência'},
        {title: 'Transporte'},
        {title: 'Outros'},
    ],
    categoriesIncome: [
        {title: 'Empréstimo'},
        {title: 'Salário'},
        {title: 'Saldo Conta'},
        {title: 'Tranferência'},
        {title: 'Outros'},
    ],
}

export const convertToPrice = (value: any) => {
    const opts = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }

    return new Intl
        .NumberFormat('pt-BR', opts)
        .format(value);
}

export function calculateBalance(transactions: any[]) {
    const incomeValue = transactions
        .filter((item) => item?.type === 'income')
        .reduce((acc, item) => {
            return acc + parseFloat(item.price);
        }, 0);

    const outcomeValue = transactions
        .filter((item) => item.type === 'outcome')
        .reduce((acc, item) => {
            return acc + parseFloat(item.price);
        }, 0);

    return {
        total: incomeValue - outcomeValue,
        incomeValue,
        outcomeValue
    };
}

export const balanceSlice = createSlice({
    name: 'balance',
    initialState,
    reducers: {
        setBalance: (state, action: PayloadAction<any>) => {
            state.total = action.payload
        },
        setRawTransactionsAction: (state, action: PayloadAction<any>) => {
            state.rawTransactions = action.payload
        },
        setTransactionsAction: (state, action: PayloadAction<any>) => {
            state.transactions = action.payload
        },
        setDebtsAction: (state, action: PayloadAction<any>) => {
            state.debts = action.payload
        },
        setTransactionsChanged: (state, action: PayloadAction<boolean>) => {
            state.transactionChanged = action.payload
        },
        setDebtsChanged: (state, action: PayloadAction<boolean>) => {
            state.transactionChanged = action.payload
        },
        setOutcome: (state, action: PayloadAction<any>) => {
            state.outcome = action.payload
        },
        setIncome: (state, action: PayloadAction<any>) => {
            state.income = action.payload
        },
        toggleHiddenValues: (state) => {
            state.hiddeValue = !state.hiddeValue
        },
        enableLoading: (state) => {
            state.loading = true
        },
        disableLoading: (state) => {
            state.loading = false
        },
        setCurrentDate: (state, action: PayloadAction<any>) => {
            state.currentDate = action.payload
        },
    }
})

export const {
    setBalance,
    setTransactionsAction,
    setRawTransactionsAction,
    setDebtsAction,
    setOutcome,
    setIncome,
    toggleHiddenValues,
    setTransactionsChanged,
    setDebtsChanged,
    enableLoading,
    disableLoading,
    setCurrentDate
} = balanceSlice.actions
export default balanceSlice.reducer
