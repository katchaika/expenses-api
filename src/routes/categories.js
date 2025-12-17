import express from "express";
import { getDb } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const db = await getDb();
  const rows = await db.all("SELECT * FROM categories ORDER BY id");
  res.json(rows);
});

router.post("/", authMiddleware, async (req, res) => {
  const { name, color } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  const db = await getDb();
  const result = await db.run("INSERT INTO categories (name, color) VALUES (?, ?)", [name, color || null]);
  res.json({ id: result.lastID, name, color });
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { name, color } = req.body;
  const db = await getDb();
  await db.run("UPDATE categories SET name = ?, color = ? WHERE id = ?", [name, color, req.params.id]);
  res.json({ success: true });
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const db = await getDb();
  await db.run("DELETE FROM categories WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

export default router;
