import express from "express";
import { MongoClient } from "mongodb";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const app = express();
app.use(express.json({ limit: "1mb" }));
let clientPromise;
function getClient() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured");
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI, { maxPoolSize: 5, minPoolSize: 0, maxIdleTimeMS: 20000 });
    clientPromise = client.connect().catch(error => { clientPromise = undefined; throw error; });
  }
  return clientPromise;
}
async function db() { return (await getClient()).db(process.env.MONGODB_DB || "eshop"); }
const publicUser = ({ passwordHash, password, answerHash, answer, ...user }) => user;
async function hashSecret(value) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt$${salt}$${(await scrypt(String(value), salt, 64)).toString("hex")}`;
}
async function verifySecret(value, stored) {
  if (!stored) return false;
  if (!stored.startsWith("scrypt$")) return String(value) === stored;
  const [, salt, hash] = stored.split("$");
  return timingSafeEqual(Buffer.from(hash, "hex"), await scrypt(String(value), salt, 64));
}
function idQuery(id) {
  const choices = [{ id }, { id: String(id) }];
  if (/^-?\d+(\.\d+)?$/.test(String(id))) choices.push({ id: Number(id) });
  return { $or: choices };
}
app.get("/api/health", (_req, res) => res.json({ ok: true, database: "mongodb" }));

app.post("/api/auth/login", async (req, res) => {
  try {
    const database = await db();
    const identity = String(req.body.identity || "").trim();
    const user = await database.collection("users").findOne({ $or: [{ email: identity }, { phone: identity }] });
    if (!user || !(await verifySecret(req.body.password, user.passwordHash || user.password))) return res.status(401).json({ error: "Invalid credentials" });
    if (user.password && !user.passwordHash) await database.collection("users").updateOne({ _id: user._id }, { $set: { passwordHash: await hashSecret(user.password) }, $unset: { password: "" } });
    return res.json(publicUser(user));
  } catch (error) { console.error("Login error:", error.message); return res.status(503).json({ error: "Login service unavailable" }); }
});
app.get("/api/auth/question", async (req, res) => {
  try {
    const user = await (await db()).collection("users").findOne({ email: String(req.query.email || "").trim() }, { projection: { question: 1, email: 1 } });
    return user ? res.json({ question: user.question, email: user.email }) : res.status(404).json({ error: "User not found" });
  } catch { return res.status(503).json({ error: "Unable to retrieve security question" }); }
});
app.post("/api/auth/verify-answer", async (req, res) => {
  try {
    const database = await db();
    const user = await database.collection("users").findOne({ email: req.body.email });
    if (!user || !(await verifySecret(req.body.answer, user.answerHash || user.answer))) return res.status(401).json({ error: "Incorrect answer" });
    if (user.answer && !user.answerHash) await database.collection("users").updateOne({ _id: user._id }, { $set: { answerHash: await hashSecret(user.answer) }, $unset: { answer: "" } });
    return res.json(publicUser(user));
  } catch { return res.status(503).json({ error: "Answer verification unavailable" }); }
});
app.post("/api/auth/change-password", async (req, res) => {
  try {
    const database = await db();
    const user = await database.collection("users").findOne(idQuery(req.body.id));
    if (!user || !(await verifySecret(req.body.currentPassword, user.passwordHash || user.password))) return res.status(401).json({ error: "Current password is incorrect" });
    await database.collection("users").updateOne({ _id: user._id }, { $set: { passwordHash: await hashSecret(req.body.newPassword) }, $unset: { password: "" } });
    return res.json({ updated: true });
  } catch { return res.status(503).json({ error: "Password update unavailable" }); }
});

for (const name of ["users", "products", "orders"]) {
  const col = () => db().then(database => database.collection(name));
  app.get(`/api/${name}`, async (_req, res) => {
    try { const rows = await (await col()).find({}).toArray(); return res.json(name === "users" ? rows.map(publicUser) : rows); }
    catch { return res.status(503).json({ error: `Unable to load ${name}` }); }
  });
  app.get(`/api/${name}/:id`, async (req, res) => {
    try { const row = await (await col()).findOne(idQuery(req.params.id)); if (!row) return res.status(404).json({ error: "Not found" }); return res.json(name === "users" ? publicUser(row) : row); }
    catch { return res.status(503).json({ error: "Unable to load record" }); }
  });
  app.post(`/api/${name}`, async (req, res) => {
    try {
      const doc = { ...req.body }; delete doc._id;
      if (name === "users") {
        if (!doc.password) return res.status(400).json({ error: "Password is required" });
        doc.passwordHash = await hashSecret(doc.password);
        if (doc.answer) doc.answerHash = await hashSecret(doc.answer);
        delete doc.password; delete doc.answer;
      }
      if (doc.id == null) doc.id = Date.now() + Math.random();
      const result = await (await col()).insertOne(doc);
      return res.status(201).json(name === "users" ? publicUser({ ...doc, _id: result.insertedId }) : { ...doc, _id: result.insertedId });
    } catch (error) { return res.status(error.code === 11000 ? 409 : 500).json({ error: error.code === 11000 ? "Duplicate record" : "Unable to create record" }); }
  });
  for (const method of ["patch", "put"]) app[method](`/api/${name}/:id`, async (req, res) => {
    try {
      const database = await db(); const collection = database.collection(name);
      const target = await collection.findOne(idQuery(req.params.id)); if (!target) return res.status(404).json({ error: "Not found" });
      const changes = { ...req.body }; delete changes._id; delete changes.id;
      if (name === "users") for (const key of ["password", "answer", "passwordHash", "answerHash"]) delete changes[key];
      await collection.updateOne({ _id: target._id }, { $set: changes });
      const updated = await collection.findOne({ _id: target._id });
      return res.json(name === "users" ? publicUser(updated) : updated);
    } catch { return res.status(500).json({ error: "Unable to update record" }); }
  });
  app.delete(`/api/${name}/:id`, async (req, res) => {
    try { const result = await (await col()).deleteOne(idQuery(req.params.id)); return result.deletedCount ? res.json({ deleted: true }) : res.status(404).json({ error: "Not found" }); }
    catch { return res.status(500).json({ error: "Unable to delete record" }); }
  });
}
export { app };
export default async function handler(req, res) {
  try { await getClient(); return app(req, res); }
  catch (error) { console.error("MongoDB connection failed:", error.message); return res.status(503).json({ error: "Database unavailable. Verify MONGODB_URI and Atlas network access." }); }
}
