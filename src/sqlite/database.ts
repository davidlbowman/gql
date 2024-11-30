import { Database } from "bun:sqlite";

const db = new Database("src/sqlite/users/users.sqlite", { create: true });

db.exec("PRAGMA journal_mode = WAL;");

db.exec(`
    DROP TABLE IF EXISTS users;
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
  );
`);

export { db };
