import sequelize, { ensureDatabaseExists } from "../config/database.js";
import CampusInfo from "../models/CampusInfo.js";
import TourNode from "../models/TourNode.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let _dirname;
if (typeof __dirname !== "undefined") {
  _dirname = __dirname;
} else if (typeof import.meta !== "undefined" && import.meta.url) {
  _dirname = path.dirname(fileURLToPath(import.meta.url));
} else {
  _dirname = process.cwd();
}
const BACKUP_DATA_FILE = path.join(_dirname, "..", "tourData.json");

export const initializeDatabase = async () => {
  try {
    // 1. Create database if it doesn't exist
    await ensureDatabaseExists();

    // 2. Test authenticating connection
    await sequelize.authenticate();
    console.log("🔌 Koneksi ke MySQL berhasil terhubung.");

    // 3. Sync Models — create tables only if they don't exist (safe, no alter)
    await sequelize.sync({ alter: false });
    console.log("📁 Model Sequelize disinkronkan ke database MySQL.");

    // 3.1 Safely add any new columns that may not exist yet (manual migration)
    const safeAddColumn = async (table, column, definition) => {
      try {
        await sequelize.query(`ALTER TABLE \`${table}\` ADD COLUMN ${definition}`);
        console.log(`✅ Kolom '${column}' berhasil ditambahkan ke tabel '${table}'.`);
      } catch (e) {
        if (e.original?.code === 'ER_DUP_FIELDNAME') {
          // Column already exists — this is fine, skip silently
        } else {
          console.warn(`⚠️ Gagal menambahkan kolom '${column}': ${e.message}`);
        }
      }
    };
    await safeAddColumn('campus_info', 'primaryColor', '`primaryColor` VARCHAR(255) NULL DEFAULT \'#14b8a6\'');
    await safeAddColumn('campus_info', 'secondaryColor', '`secondaryColor` VARCHAR(255) NULL DEFAULT \'#3b82f6\'');

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

    // Auto-update legacy UAN records to generic templates on startup
    if (campusCount > 0) {
      const mainInfo = await CampusInfo.findOne();
      if (mainInfo.name === "Universitas Antigravity Nusantara (UAN)") {
        mainInfo.name = "Nama Kampus Anda";
        mainInfo.slogan = "Slogan Kampus Anda";
        mainInfo.description = "Deskripsi profil kampus Anda. Anda dapat mengedit teks ini kapan saja secara langsung melalui Tab Kelola Profil Kampus di Halaman Admin.";
        mainInfo.stats = [
          { label: "Mahasiswa Aktif", value: "1.000+" },
          { label: "Program Studi", value: "10+" },
          { label: "Fasilitas Lab Modern", value: "5+" },
          { label: "Peringkat Nasional", value: "-" }
        ];
        await mainInfo.save();
        console.log("ℹ️ Profil UAN di database telah berhasil diubah ke template Kampus Kosong.");
      }
    }

    // Ensure existing campus info has default maps if not populated
    if (campusCount > 0) {
      const mainInfo = await CampusInfo.findOne();
      if (!mainInfo.maps || mainInfo.maps.length === 0) {
        mainInfo.maps = [
          {
            id: "kampus-utama",
            name: "Kampus Utama (Pusat)",
            imageUrl: "",
            description: "Denah area Kampus Utama UAN"
          },
          {
            id: "kampus-cabang",
            name: "Kampus Cabang (Vokasi)",
            imageUrl: "",
            description: "Denah area Kampus Cabang Vokasi UAN"
          }
        ];
        await mainInfo.save();
        console.log("ℹ️ Kolom 'maps' pada profil kampus telah diinisialisasi secara otomatis.");
      }
    }

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
