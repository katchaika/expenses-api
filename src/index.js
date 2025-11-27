import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));
