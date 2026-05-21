import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE_PATH = path.join(__dirname, "..", "tourData.json");

export const readTourData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Gagal membaca data database JSON:", error);
    return { campusInfo: {}, tourNodes: [] };
  }
};

export const writeTourData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Gagal menulis data ke database JSON:", error);
    return false;
  }
};
