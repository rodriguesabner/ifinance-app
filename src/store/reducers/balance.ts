import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CategoryProps {
    title: string
}

export interface BalanceProps {
    databaseRef: string
    currency: 'BRL',
    total: number;
    categories: CategoryProps[],
}

const initialState: BalanceProps = {
    databaseRef: 'transactions/',
    currency: 'BRL',
    total: 0,
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
    }
})

export const {
    setBalance,
} = balanceSlice.actions
export default balanceSlice.reducer
