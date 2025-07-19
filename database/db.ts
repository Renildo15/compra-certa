import * as SQLite from 'expo-sqlite';

const db = await SQLite.openDatabaseAsync('compracerta');

export default db;