const fs = require("fs");
const path = require("path");

// Paths to CSV files and output directories
const csvFilePaths = {
  provinsi: path.join(__dirname, "./data/provinsi.csv"),
  kabupaten: path.join(__dirname, "./data/kabupaten.csv"),
  kecamatan: path.join(__dirname, "./data/kecamatan.csv"),
  desa: path.join(__dirname, "./data/desa.csv"),
};

const outputDir = path.join(__dirname, "../wilayah");
const cacheFilePath = path.join(outputDir, "cache_wilayah.json");

// Create output directory if it doesn't exist
const createOutputDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Load cache from file
let cache = fs.existsSync(cacheFilePath)
  ? JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"))
  : { provinsi: [], kabupaten: [], kecamatan: [], desa: [] };

// Function to parse CSV data
const parseCsvData = (csvData, isKabupaten = false, isKecamatan = false) => {
  return csvData
    .map((row) => {
      const columns = row.split(",").map((col) => col.trim());
      if (columns.length < 4) return null;

      const [kode_bps, nama_bps, kode_dagri, nama_dagri] = columns;
      const id = Number(kode_dagri.replace(/\./g, ""));

      if (isNaN(id)) return null;

      const parentId = isKecamatan
        ? id.toString().slice(0, 4)
        : isKabupaten
        ? id.toString().slice(0, 2)
        : null;

      const levelKey = isKabupaten
        ? "kabupaten"
        : isKecamatan
        ? "kecamatan"
        : "provinsi";
      if (!cache[levelKey].includes(id)) cache[levelKey].push(id);

      return {
        id,
        nama: nama_dagri || null,
        kode_wil_bps: Number(kode_bps.replace(/\./g, "")),
        nama_wil_bps: nama_bps || null,
        parent: parentId ? Number(parentId) : null,
        lokasi: null,
        wilayah: null,
      };
    })
    .filter(Boolean);
};

// Function to parse Desa data
const parseDesaData = (csvData) => {
  return csvData
    .map((row) => {
      const columns = row.split(",").map((col) => col.trim());
      if (columns.length < 4) return null;

      const [kode_bps, nama_bps, kode_dagri, nama_dagri] = columns;
      const id = Number(kode_dagri.replace(/\./g, ""));
      if (isNaN(id)) return null;

      const parentId = Number(id.toString().slice(0, 6));
      if (!cache.desa.includes(id)) cache.desa.push(id);

      return {
        id,
        nama: nama_dagri || null,
        kode_wil_bps: Number(kode_bps.replace(/\./g, "")),
        nama_wil_bps: nama_bps || null,
        parent: parentId,
        lokasi: null,
        wilayah: null,
      };
    })
    .filter(Boolean);
};

// Main function to fetch and process data
const fetchData = () => {
  createOutputDir(outputDir);

  Object.entries(csvFilePaths).forEach(([key, filePath]) => {
    const csvData = fs.readFileSync(filePath, "utf-8").split("\n").slice(1);
    const data =
      key === "desa"
        ? parseDesaData(csvData)
        : parseCsvData(csvData, key === "kabupaten", key === "kecamatan");

    const outputFilePath = path.join(outputDir, `${key}.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2));
    console.log(`Data ${key} berhasil disimpan di ${outputFilePath}`);
  });

  fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2));
  console.log(`Cache wilayah berhasil disimpan di ${cacheFilePath}`);
};

fetchData();
