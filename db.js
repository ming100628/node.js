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

export async function createComments(comment) {
  const db = await createDb();
  await db.run(`INSERT INTO comments(content) VALUES('${comment}')`);
}

export async function migrateCounter() {
  const db = await createDb();
  await db.exec("CREATE TABLE counter (visit INT)");
}

export async function migrateComments() {
  const db = await createDb();
  await db.exec("DROP TABLE comments");
  await db.exec("CREATE TABLE id INTEGER AUTOINCREMENT, comments (content TEXT)");
}

export async function getComments() {
  const db = await createDb();
  const rows = [];
  await db.each("SELECT * from comments", (_err, row) => {
    rows.push(row);
  });
  return rows;
}

export async function deleteComments(id) {
  const db = await createDb();
  await db.run(`DELETE FROM comments WHERE id = ?`, id);
}