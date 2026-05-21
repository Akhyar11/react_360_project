import sequelize, { ensureDatabaseExists } from "../config/database.js";
import CampusInfo from "../models/CampusInfo.js";
import TourNode from "../models/TourNode.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKUP_DATA_FILE = path.join(__dirname, "..", "tourData.json");

export const initializeDatabase = async () => {
  try {
    // 1. Create database if it doesn't exist
    await ensureDatabaseExists();

    // 2. Test authenticating connection
    await sequelize.authenticate();
    console.log("🔌 Koneksi ke MySQL berhasil terhubung.");

    // 3. Sync Models (Create/alter tables in MySQL)
    await sequelize.sync({ alter: true });
    console.log("📁 Model Sequelize disinkronkan ke database MySQL.");

    // 3.5. Seed Default Admin User if empty
    const userCount = await User.count();
    if (userCount === 0) {
      const hashedPassword = bcrypt.hashSync("admin123", 10);
      await User.create({
        username: "admin",
        password: hashedPassword,
        name: "Administrator UAN",
      });
      console.log("👤 Database MySQL: Akun Admin default dibuat. (Username: admin | Password: admin123)");
    }

    // 4. Seeding check
    const campusCount = await CampusInfo.count();
    const nodeCount = await TourNode.count();

    if (campusCount === 0 && nodeCount === 0) {
      console.log("🌱 Database MySQL kosong. Melakukan seeding data awal dari tourData.json...");
      
      if (fs.existsSync(BACKUP_DATA_FILE)) {
        const rawData = fs.readFileSync(BACKUP_DATA_FILE, "utf-8");
        const parsed = JSON.parse(rawData);

        if (parsed.campusInfo) {
          await CampusInfo.create(parsed.campusInfo);
          console.log("✅ Seeding profil kampus utama berhasil.");
        }

        if (parsed.tourNodes && parsed.tourNodes.length > 0) {
          await TourNode.bulkCreate(parsed.tourNodes);
          console.log(`✅ Seeding ${parsed.tourNodes.length} lokasi tur 360° berhasil.`);
        }
      } else {
        console.log("⚠️ File cadangan server/tourData.json tidak ditemukan. Melewati seeding.");
      }
    } else {
      console.log("ℹ️ Database sudah terisi. Melewati seeding otomatis.");
    }
  } catch (error) {
    console.error("❌ Gagal menginisialisasi database MySQL:", error.message);
  }
};
export default initializeDatabase;
