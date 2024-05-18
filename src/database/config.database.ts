import {type SQLiteDatabase} from 'expo-sqlite';

async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;
    let {user_version: currentDbVersion} = await db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
    );
    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }
    if (currentDbVersion === 0) {
        await db.execAsync(
            `
             CREATE TABLE IF NOT EXISTS transactions
             (
                 id
                 INTEGER
                 PRIMARY
                 KEY
                 AUTOINCREMENT,
                 name
                 TEXT,
                 price
                 TEXT,
                 category
                 TEXT,
                 date
                 TEXT,
                 type
                 TEXT,
                 description
                 TEXT,
                 paid
                 BOOLEAN
             );`
        );
        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS debts
             (
                 id
                 INTEGER
                 PRIMARY
                 KEY
                 AUTOINCREMENT,
                 company
                 TEXT
                 price
                 TEXT
                 installmentValue
                 TEXT
                 installmentNumbers
                 INT
                 installmentCurrent
                 INT
                 reason
                 TEXT
             );`
        );
        currentDbVersion = 1;
    }
    // if (currentDbVersion === 1) {
    //   Add more migrations
    // }
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export {
    migrateDbIfNeeded
}
