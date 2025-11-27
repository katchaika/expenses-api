import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

export function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if(!header) return res.status(401).json({ error: "No token" });

    const parts = header.split(" ");
    if (parts.length !== 2) return res.status(401).json({ error: "Invalid token format" })

    const token = parts[1];

    try {
        const user = jwt.veriify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (e) {
        res.status(401).json({ error: "Token invalid" });
    }
}