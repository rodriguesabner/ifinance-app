import { combineReducers } from '@reduxjs/toolkit'
import balanceReducer, {BalanceProps} from "./balance";

export interface RootState {
    balance: BalanceProps
}

export default combineReducers({
    balance: balanceReducer,
})
