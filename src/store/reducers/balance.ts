import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CategoryProps {
    title: string
}

export interface BalanceProps {
    databaseRef: string
    currency: 'BRL',
    total: number;
    income: number;
    outcome: number;
    transactions: any[],
    categories: CategoryProps[],
}

const initialState: BalanceProps = {
    databaseRef: 'transactions/',
    currency: 'BRL',
    total: 0,
    income: 0,
    outcome: 0,
    transactions: [],
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
        {title: 'Transporte'},
        {title: 'Outros'},
    ]
}

export const balanceSlice = createSlice({
    name: 'balance',
    initialState,
    reducers: {
        setBalance: (state, action: PayloadAction<any>) => {
            state.total = action.payload
        },
        setTransactionsAction: (state, action: PayloadAction<any>) => {
            state.transactions = action.payload
        },
        setOutcome: (state, action: PayloadAction<any>) => {
            state.outcome = action.payload
        },
        setIncome: (state, action: PayloadAction<any>) => {
            state.income = action.payload
        }
    }
})

export const {
    setBalance,
    setTransactionsAction,
    setOutcome,
    setIncome
} = balanceSlice.actions
export default balanceSlice.reducer
