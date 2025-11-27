import sqlite3 from "sqlite3";
import { open } from "sqlite";

const dbFile = "./database.db";

export async function getDb() {
  return open({
    filename: dbFile,
    driver: sqlite3.Database
  });
}

