import * as SQLite from 'expo-sqlite';
import {TransactionProps} from "../interfaces/transaction.interface";

const configDatabase = SQLite.openDatabase('transactions.db');

const setupDatabase = () => {
    configDatabase.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS transactions
             (
                 id          INTEGER PRIMARY KEY AUTOINCREMENT,
                 name        TEXT,
                 price       TEXT,
                 category    TEXT,
                 date        TEXT,
                 type        TEXT,
                 description TEXT,
                 paid        BOOLEAN
             );`
        );
    });
};

const dbTransactionPromise = (query: string, params: any[], resolveAction: Function, errorAction: Function): Promise<any> => {
    return new Promise((resolve, reject) => {
        configDatabase.transaction(transactionContext => {
            transactionContext.executeSql(
                query,
                params,
                (_, result) => resolveAction(resolve, result),
                (_, error) => errorAction(reject, error)
            );
        });
    });
}

const resolveAction = (resolve: any, result: any) => resolve(result);
const errorAction = (reject: any, error: any) => reject(error);

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
    setupDatabase,
    insertTransaction,
    getTransactionsDb,
    updateTransaction,
    deleteTransactionDb
};
