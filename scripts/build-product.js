import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import JavaScriptObfuscator from "javascript-obfuscator";

const tempBundleDir = "./dist-server";
const obfDir = "./obfuscated-server";
const releaseDir = "./release";

// Clean and create fresh output directories
const resetDir = (dir) => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
};

const run = async () => {
  console.log("🚀 STARTING PRODUCTION RELEASE PIPELINE (Methods 1 & 2) 🚀\n");

  // Step 1: Compile React Frontend
  console.log("📦 Step 1: Compiling React Frontend with Vite...");
  execSync("npm run build", { stdio: "inherit" });
  console.log("✅ Frontend compilation finished successfully.\n");

  // Step 2: Reset build directories
  console.log("🧹 Step 2: Preparing folder structure...");
  resetDir(tempBundleDir);
  resetDir(obfDir);
  resetDir(releaseDir);
  fs.mkdirSync(path.join(releaseDir, "uploads"), { recursive: true });
  console.log("✅ Directories prepared.\n");

  // Step 3: Bundle ES Modules Backend to a single CommonJS file
  console.log("⚡ Step 3: Bundling backend ES Modules into a single CommonJS file via esbuild...");
  const esbuildCmd = "npx esbuild server/index.js --bundle --platform=node --format=cjs --outfile=dist-server/index.cjs --external:pg --external:pg-hstore --external:sqlite3 --external:tedious --external:mariadb --external:oracledb";
  execSync(esbuildCmd, { stdio: "inherit" });
  console.log("✅ Bundling to CommonJS completed.\n");

  // Step 4: Obfuscate the bundled CommonJS file
  console.log("🔒 Step 4: Obfuscating backend Express bundle...");
  const bundlePath = path.join(tempBundleDir, "index.cjs");
  const destPath = path.join(obfDir, "index.js");
  
  let code = fs.readFileSync(bundlePath, "utf-8");
  
  // High-security Obfuscation settings (Scrambles functions, self-defending, rc4 string encryption)
  const obfuscatedResult = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: false,
    numbersToExpressions: false,
    simplify: true,
    shuffleStringArray: true,
    splitStrings: true,
    stringArray: true,
    stringArrayThreshold: 0.75,
    stringArrayEncoding: ["rc4"],
    selfDefending: true,
    deadCodeInjection: false
  });

  fs.writeFileSync(destPath, obfuscatedResult.getObfuscatedCode(), "utf-8");
  console.log("✅ Backend obfuscation completed successfully.\n");

  // Step 5: Bundle Obfuscated Code to Executables using PKG
  console.log("📦 Step 5: Compiling obfuscated CommonJS backend to standalone binaries using PKG...");
  
  // Targets: Linux (x64) and Windows (x64) using node18
  const pkgCommand = `npx pkg ${destPath} --targets node18-linux-x64,node18-win-x64 --output ${path.join(releaseDir, "app")} --public`;
  execSync(pkgCommand, { stdio: "inherit" });
  console.log("✅ Executable packaging completed successfully.\n");

  // Step 6: Copy compiled Frontend dist to release directory
  console.log("📂 Step 6: Copying assets to release directory...");
  fs.cpSync("./dist", path.join(releaseDir, "dist"), { recursive: true });
  console.log("✅ Compiled assets copied.\n");

  // Step 7: Create client documentation
  console.log("📝 Step 7: Creating customer setup guide...");
  const readmeContent = `# 🚀 Panduan Setup & Jalankan 360° Virtual Tour App

Terima kasih telah menggunakan sistem **360° Virtual Tour & CMS Admin Panel**. Aplikasi ini sudah dikompilasi secara aman, dioptimalkan secara penuh, dan dapat dijalankan dengan sekali klik.

## 📋 Prasyarat Sistem
1. **Sistem Operasi**: Windows 64-bit ATAU Linux 64-bit.
2. **Database**: MySQL Server aktif (Port 3306).

---

## ⚙️ Cara Menjalankan Aplikasi

### 1. Konfigurasi Database (Opsional)
Secara default, aplikasi akan mencoba menghubungkan ke MySQL lokal dengan kredensial:
* **Host**: \`127.0.0.1\`
* **Port**: \`3306\`
* **Username**: \`root\`
* **Password**: \`root\`

Jika kredensial MySQL Anda berbeda, Anda dapat menyetel **Environment Variables** sebelum menjalankan aplikasi:
* \`DB_HOST\`: Host database Anda (cth: \`localhost\`)
* \`DB_USER\`: Username MySQL Anda
* \`DB_PASSWORD\`: Password MySQL Anda
* \`DB_NAME\`: Nama database yang ingin digunakan (default: \`react_360_tour\`)
* \`PORT\`: Port web server (default: \`5000\`)

### 2. Menjalankan Server
* **Di Windows**:
  Cukup klik dua kali berkas \`app.exe\` di folder ini.
* **Di Linux**:
  Buka terminal di folder ini, beri hak akses eksekusi, lalu jalankan:
  \`\`\`bash
  chmod +x app-linux
  ./app-linux
  \`\`\`

---

## 🌐 Mengakses Aplikasi
Setelah server aktif di terminal/layar Anda, buka browser internet dan kunjungi:
* **Aplikasi Utama / Landing Page**: [http://localhost:5000/](http://localhost:5000/)
* **Virtual Tour 360°**: [http://localhost:5000/tour](http://localhost:5000/tour)
* **CMS Portal Admin**: [http://localhost:5000/login](http://localhost:5000/login)

### 🔑 Akun Admin Default:
* **Username**: \`admin\`
* **Password**: \`admin123\`

*(Anda dapat mengubah password atau data di dalam dasbor admin secara dinamis setelah masuk)*
`;

  fs.writeFileSync(path.join(releaseDir, "PANDUAN_SETUP.md"), readmeContent, "utf-8");
  console.log("✅ Customer setup guide created.\n");

  // Clean intermediate folders
  console.log("🧹 Step 8: Cleaning up temporary compilation directories...");
  fs.rmSync(tempBundleDir, { recursive: true, force: true });
  fs.rmSync(obfDir, { recursive: true, force: true });
  console.log("✅ Clean up completed.\n");

  console.log("🎉 SUCCESS! YOUR PRODUCT IS READY TO BE SOLD! 🎉");
  console.log(`📂 Find the final ready-to-sell package in the folder: ${path.resolve(releaseDir)}`);
};

run().catch((err) => {
  console.error("❌ Pipeline failed:", err);
  process.exit(1);
});
