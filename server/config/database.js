import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
import mysql2 from "mysql2";

const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "";
const DB_NAME = process.env.DB_NAME || "react_360_tour";

// Helper to auto-create the database if it doesn't exist
export const ensureDatabaseExists = async () => {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    await connection.end();
    console.log(`\n🛢️  Database MySQL "${DB_NAME}" siap digunakan.`);
  } catch (error) {
    console.error("⚠️  Gagal membuat/memverifikasi database MySQL:", error.message);
    console.log("👉 Pastikan service MySQL Anda sudah aktif dan kredensial di server/config/database.js sudah benar.\n");
  }
};

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  dialectModule: mysql2,
  logging: false, // Set to console.log to see SQL queries in terminal
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;
