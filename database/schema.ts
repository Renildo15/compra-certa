import { SQLiteDatabase } from "expo-sqlite";
import { mockLists } from "./mockData";

export async function createSchema(db: SQLiteDatabase) {
    const DATABASE_VERSION = 2;

    const result = await db.getFirstAsync<{ user_version: number }>(`
        PRAGMA user_version;
    `);
    const currentDbVersion = result?.user_version ?? 0;

    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }

    if (currentDbVersion === 0) {
        await db.execAsync(`
            PRAGMA journal_mode = 'wal';
            CREATE TABLE IF NOT EXISTS lists (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                type TEXT NOT NULL CHECK (type IN ('mercado', 'pedido')),
                ref_month TEXT,
                created_at TEXT NOT NULL
            );
        `);

        await db.execAsync(`
            PRAGMA journal_mode = 'wal';
            CREATE TABLE IF NOT EXISTS budgets (
                id TEXT PRIMARY KEY NOT NULL,
                listId TEXT NOT NULL,
                value REAL NOT NULL,
                FOREIGN KEY (listId) REFERENCES lists(id)
            );
        `);

        await db.execAsync(`
            PRAGMA journal_mode = 'wal';
            CREATE TABLE IF NOT EXISTS itens (
                id TEXT PRIMARY KEY NOT NULL,
                listId TEXT NOT NULL,
                name TEXT NOT NULL,
                quantity TEXT,
                price REAL,
                category TEXT,
                observation TEXT,
                purchased INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                FOREIGN KEY (listId) REFERENCES lists(id)
            );
        `);

        await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
    }

    if (currentDbVersion < 2) {
        await db.execAsync(`
            ALTER TABLE budgets ADD COLUMN value_original REAL;
            UPDATE budgets SET value_original = value;    
        `);

        await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
    }

}

export async function populateInitialData(db: SQLiteDatabase) {
    try {
        const existingLists = await db.getAllAsync('SELECT id FROM lists LIMIT 1');
        
        if (existingLists.length === 0) {
            for (const list of mockLists) {
                await db.runAsync(
                    `INSERT INTO lists (id, name, type, ref_month, created_at) 
                     VALUES (?, ?, ?, ?, datetime('now'))`,
                    [list.id, list.name, list.type, list.ref_month ?? null]
                );
                console.log(`Lista ${list.name} adicionada`);
            }
        }
    } catch (error) {
        console.error('Erro ao popular dados iniciais:', error);
    }
}
