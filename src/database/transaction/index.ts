import {TransactionProps} from "../../interfaces/transaction.interface";
import {dbTransactionPromise, errorAction, resolveAction} from "../config.database";

const getTransactionsDb = (month: number, year: number) => {
    let choosedMonth = month.toString()

    if (month < 10) {
        choosedMonth = `0${month}`.slice(-2);
    }

    return dbTransactionPromise(
        "SELECT * FROM transactions WHERE strftime('%m', date) = ? AND strftime('%Y', date) = ?;",
        [choosedMonth, year.toString()],
        resolveAction,
        errorAction
    );
};

const insertTransaction = (transaction: TransactionProps) => {
    return dbTransactionPromise(
        `INSERT INTO transactions (name, price, category, date, type, description, paid)
         VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
            transaction.name,
            transaction.price,
            transaction.category,
            transaction.date.toISOString(),
            transaction.type,
            transaction.description,
            transaction.paid,
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
    insertTransaction,
    getTransactionsDb,
    updateTransaction,
    deleteTransactionDb
}
