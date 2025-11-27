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
    `)

    // seed user (test@test.com)
    const hashed = await bcrypt.hash("1234", 8);
    try {
        await db.run("INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)", ["test@test.com", hashed]);
    } catch (e) { /* user exists */ }

    console.log("DB setup finished.")
    await db.close();
}

setup().catch(error => { console.log(error); process.exit(1) });
