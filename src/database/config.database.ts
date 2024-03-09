import * as SQLite from 'expo-sqlite';

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
    configDatabase.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS debts
             (
                 id                  INTEGER PRIMARY KEY AUTOINCREMENT,
                 company             TEXT
                 price               TEXT
                 installmentValue    TEXT
                 installmentNumbers  INT
                 installmentCurrent  INT
                 reason              TEXT
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

export {
    setupDatabase,
    dbTransactionPromise,
    resolveAction,
    errorAction
};
