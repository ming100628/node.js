import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDB() {
  const db = await open({
    filename: "./tmp/database.db",
    driver: sqlite3.Database,
  });
  return db;
}

export async function incrementCounter() {
  const db = await openDB();
  await db.run(
    "UPDATE counter SET visit = ?",
    (await db.get("SELECT visit FROM counter")).visit + 1
  );
}

export async function createComments(comment) {
  const db = await openDB();
  await db.run(`INSERT INTO comments(content) VALUES('${comment}')`);
}

export async function migrateCounter() {
  const db = await openDB();
  await db.exec("CREATE TABLE counter (visit INT)");
}

export async function migrateComments() {
  const db = await openDB();
  await db.exec("DROP TABLE comments");
  await db.exec(
    "CREATE TABLE id INTEGER AUTOINCREMENT, comments (content TEXT)"
  );
}

export async function getComments() {
  const db = await openDB();
  const rows = [];
  await db.each("SELECT * from comments", (_err, row) => {
    rows.push(row);
  });
  return rows;
}

export async function getComment(id) {
  const db = await openDB();
  const record = await db.get("SELECT * from comments where id = ?", id);
  return record;
}

export async function deleteComments(id) {
  const db = await openDB();
  await db.run(`DELETE FROM comments WHERE id = ?`, id);
}
