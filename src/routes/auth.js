import express from "express";
import { getDb } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const db = await getDb();
    const user = await db.get(
      "SELECT * FROM users WHERE email = ?",
      email
    );

    console.log("USER from DB:", user);

    if (!user) {
      return res.status(401).json({ error: "Invalid login" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid login" });
    }

    const token = jwt.sign({ id: user.id, email: email.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token });

  } catch (e) {
    console.error("LOGIN error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
