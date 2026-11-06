import "dotenv/config";
import { MongoClient } from "mongodb";
import { readFile } from "node:fs/promises";
import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(scryptCallback);
if (!process.env.MONGODB_URI) throw new Error("Set MONGODB_URI before running migration.");
const source = JSON.parse(await readFile(new URL("../src/db.json", import.meta.url), "utf8"));
const client = new MongoClient(process.env.MONGODB_URI);
async function hash(value) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt$${salt}$${(await scrypt(String(value), salt, 64)).toString("hex")}`;
}
try {
  await client.connect();
  const database = client.db(process.env.MONGODB_DB || "eshop");
  for (const name of ["users", "products", "orders"]) {
    const collection = database.collection(name);
    let count = 0;
    for (const original of source[name] || []) {
      const doc = { ...original }; delete doc._id;
      if (name === "users") {
        if (doc.password && !String(doc.password).startsWith("scrypt$")) doc.passwordHash = await hash(doc.password);
        if (doc.answer && !String(doc.answer).startsWith("scrypt$")) doc.answerHash = await hash(doc.answer);
        delete doc.password; delete doc.answer;
      }
      if (name === "users") {
        await collection.updateOne({ id: doc.id }, { $set: doc, $unset: { password: "", answer: "" } }, { upsert: true });
      } else {
        await collection.updateOne({ id: doc.id }, { $set: doc }, { upsert: true });
      }
      count++;
    }
    console.log(`Upserted ${count} ${name}`);
  }
  await database.collection("users").createIndex({ email: 1 }, { unique: true, sparse: true });
  console.log("Migration complete. src/db.json was left unchanged.");
} finally { await client.close(); }
