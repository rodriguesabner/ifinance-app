import {TransactionProps} from "../../interfaces/transaction.interface";
import {DebtProps} from "../../interfaces/debts.interface";
import store from "../../store";

const getDebtsDb = () => {
    // return db.dbTransactionPromise(
    //     "SELECT * FROM debts;",
    //     [],
    // );
};

const insertDebt = (transaction: DebtProps) => {
    // return db.dbTransactionPromise(
    //     `INSERT INTO debts (company, reason, installmentValue, installmentNumbers, installmentCurrent)
    //      VALUES (?, ?, ?, ?, ?, ?);`,
    //     [
    //         transaction.company,
    //         transaction.price,
    //         transaction.reason,
    //         transaction.installmentValue,
    //         transaction.installmentNumbers,
    //         transaction.installmentCurrent,
    //     ],
    // );
};

const updateTransaction = (transaction: TransactionProps) => {
    // return db.dbTransactionPromise(
    //     `UPDATE transactions
    //      SET name = ?,
    //          price = ?,
    //          category = ?,
    //          date = ?,
    //          type = ?,
    //          description = ?,
    //          paid = ?
    //      WHERE id = ?;`,
    //     [
    //         transaction.name,
    //         transaction.price,
    //         transaction.category,
    //         transaction.date.toISOString(),
    //         transaction.type,
    //         transaction.description,
    //         transaction.paid,
    //         transaction.id,
    //     ],
    // );
}

export {
    getDebtsDb,
    insertDebt,
    updateTransaction,
}
