import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "antigravity-secret-key-360-tour";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from Bearer <token>
      token = req.headers.authorization.split(" ")[1];

      // Decode token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Fetch user from DB (excluding password)
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] }
      });

      if (!user) {
        return res.status(401).json({ error: "Akun admin tidak ditemukan. Akses ditolak." });
      }

      // Attach user object to request
      req.user = user;
      next();
    } catch (error) {
      console.error("Kesalahan validasi token JWT:", error.message);
      return res.status(401).json({ error: "Token tidak valid atau kedaluwarsa. Silakan login kembali." });
    }
  }

  if (!token) {
    return res.status(401).json({ error: "Akses ditolak. Token otorisasi tidak ditemukan." });
  }
};
export default protect;
