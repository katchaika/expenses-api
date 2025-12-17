import express from "express";
import { getDb } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const db = await getDb();
  const rows = await db.all("SELECT * FROM expenses ORDER BY createdAt DESC");
  res.json(rows);
});

router.post("/", authMiddleware, async (req, res) => {
  const { name, amount, categoryId } = req.body;
  if (!name || amount === undefined) return res.status(400).json({ error: "name & amount required" });
  const db = await getDb();
  const result = await db.run(
    "INSERT INTO expenses (name, amount, categoryId) VALUES (?, ?, ?)",
    [name, amount, categoryId || null]
  );
  const newRow = await db.get("SELECT * FROM expenses WHERE id = ?", [result.lastID]);
  res.json(newRow);
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { name, amount, categoryId } = req.body;
  const db = await getDb();
  await db.run(
    "UPDATE expenses SET name = ?, amount = ?, categoryId = ? WHERE id = ?",
    [name, amount, categoryId || null, req.params.id]
  );
  res.json({ success: true });
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const db = await getDb();
  await db.run("DELETE FROM expenses WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

export default router;
