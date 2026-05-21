import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "antigravity-secret-key-360-tour";

// POST: Admin Login
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username dan Password wajib diisi." });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Username atau Password salah." });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Username atau Password salah." });
    }

    // Sign JWT Token
    const token = jwt.sign(
      { id: user.id, username: user.username, name: user.name },
      JWT_SECRET,
      { expiresIn: "1d" } // Token valid for 24 hours
    );

    res.json({
      message: "Login admin berhasil!",
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name
      }
    });
  } catch (error) {
    console.error("Gagal melakukan login admin:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

// GET: Current Admin Profile
export const getMe = async (req, res) => {
  // The user object is attached to request by authMiddleware
  if (!req.user) {
    return res.status(401).json({ error: "Tidak diizinkan. Silakan login kembali." });
  }
  res.json(req.user);
};
