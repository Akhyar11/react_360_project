import User from "../models/User.js";
import bcrypt from "bcryptjs";

// GET: Get all users (exclude password)
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }
    });
    res.json(users);
  } catch (error) {
    console.error("Gagal mengambil data user:", error);
    res.status(500).json({ error: "Gagal mengambil data user dari database." });
  }
};

// POST: Create a new user (admin)
export const createUser = async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ error: "Username, Password, dan Nama wajib diisi." });
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username sudah digunakan oleh akun lain." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
      name
    });

    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({
      message: "User admin baru berhasil dibuat!",
      user: userResponse
    });
  } catch (error) {
    console.error("Gagal membuat user baru:", error);
    res.status(500).json({ error: "Gagal membuat user baru." });
  }
};

// PUT: Update user details
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, name } = req.body;

  if (!username || !name) {
    return res.status(400).json({ error: "Username dan Nama wajib diisi." });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan." });
    }

    // Check if username is taken by another user
    if (username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: "Username sudah digunakan oleh akun lain." });
      }
    }

    const updatePayload = { username, name };
    if (password && password.trim() !== "") {
      updatePayload.password = bcrypt.hashSync(password, 10);
    }

    await user.update(updatePayload);

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      message: "Data user berhasil diperbarui!",
      user: userResponse
    });
  } catch (error) {
    console.error("Gagal memperbarui data user:", error);
    res.status(500).json({ error: "Gagal memperbarui data user." });
  }
};

// DELETE: Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  // Prevent self-deletion!
  if (req.user && req.user.id === parseInt(id)) {
    return res.status(400).json({ error: "Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif." });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan." });
    }

    await user.destroy();
    res.json({ message: "User admin berhasil dihapus." });
  } catch (error) {
    console.error("Gagal menghapus user:", error);
    res.status(500).json({ error: "Gagal menghapus user dari database." });
  }
};
