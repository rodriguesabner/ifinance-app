import {TransactionProps} from "../../interfaces/transaction.interface";
import {dbTransactionPromise, errorAction, resolveAction} from "../config.database";
import {DebtProps} from "../../interfaces/debts.interface";

const getDebtsDb = () => {
    return dbTransactionPromise(
        "SELECT * FROM debts;",
        [],
        resolveAction,
        errorAction
    );
};

const insertDebt = (transaction: DebtProps) => {
    return dbTransactionPromise(
        `INSERT INTO debts (company, reason, installmentValue, installmentNumbers, installmentCurrent)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [
            transaction.company,
            transaction.price,
            transaction.reason,
            transaction.installmentValue,
            transaction.installmentNumbers,
            transaction.installmentCurrent,
        ],
        resolveAction,
        errorAction
    );
};

const updateTransaction = (transaction: TransactionProps) => {
    return dbTransactionPromise(
        `UPDATE transactions
         SET name = ?,
             price = ?,
             category = ?,
             date = ?,
             type = ?,
             description = ?,
             paid = ?
         WHERE id = ?;`,
        [
            transaction.name,
            transaction.price,
            transaction.category,
            transaction.date.toISOString(),
            transaction.type,
            transaction.description,
            transaction.paid,
            transaction.id,
        ],
        resolveAction,
        errorAction
    );
}

const deleteTransactionDb = (transaction: TransactionProps) => {
    return dbTransactionPromise(
        `DELETE
         FROM transactions
         WHERE id = ?;`,
        [transaction.id],
        resolveAction,
        errorAction
    );
}

export {
    getDebtsDb,
    insertDebt,
    updateTransaction,
    deleteTransactionDb
}
