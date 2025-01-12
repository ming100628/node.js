import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function createDb() {
  const db = await open({
    filename: "./tmp/database.db",
    driver: sqlite3.Database,
  });
  return db;
}

export async function incrementCounter() {
  const db = await createDb();
  await db.run(
    "UPDATE counter SET visit = ?",
    (await db.get("SELECT visit FROM counter")).visit + 1
  );
}

export async function migrate() {
  const db = await createDb();
  await db.exec("CREATE TABLE counter (visit INT)");
}
