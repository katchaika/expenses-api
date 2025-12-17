import { getDb } from "./db.js";
import bcrypt from "bcryptjs";

async function setup() {
    const db = await getDb();

    await db.exec(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            color TEXT
        );

        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            amount REAL NOT NULL,
            categoryId INTEGER,
            createdAt TEXT NOT NULL DEFAULT (datetime('now')),
            FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
        );
    `)

    // seed user (test@test.com)
    const hashed = await bcrypt.hash("1234", 8);
    try {
        await db.run("INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)", ["test@test.com", hashed]);
    } catch (e) { /* user exists */ }

    // seed categories
    await db.run("INSERT OR IGNORE INTO categories (id, name, color) VALUES (1, 'Food', '#FF0000')");
    await db.run("INSERT OR IGNORE INTO categories (id, name, color) VALUES (2, 'Transport', '#00FF00')");

    // seed expenses
    await db.run("INSERT OR IGNORE INTO expenses (id, name, amount, categoryId, createdAt) VALUES (1, 'Bread', 2.5, 1, datetime('now'))");
    await db.run("INSERT OR IGNORE INTO expenses (id, name, amount, categoryId, createdAt) VALUES (2, 'Bus Ticket', 1.2, 2, datetime('now'))");

    console.log("DB setup finished.")
    await db.close();
}

setup().catch(error => { console.log(error); process.exit(1) });
