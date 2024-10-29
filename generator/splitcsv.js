const fs = require("fs");
const path = require("path");

function processCsv(inputFile) {
  fs.readFile(inputFile, "utf8", (err, data) => {
    if (err) {
      console.error("Kesalahan saat membaca file:", err);
      return;
    }

    const lines = data.trim().split("\n");
    const fileGroups = {};

    lines.forEach((line, index) => {
      const firstTwoDigits = line.slice(0, 2);

      if (!fileGroups[firstTwoDigits]) {
        fileGroups[firstTwoDigits] = [];
      }

      // Tambahkan baris ke grup
      fileGroups[firstTwoDigits].push(line);
    });

    Object.keys(fileGroups).forEach((group) => {
      const fileName = `${group}.csv`;
      const filePath = path.join(__dirname, "data", fileName);

      // Kosongkan baris pertama
      const groupLines = fileGroups[group].slice(1); // Ambil semua baris kecuali yang pertama

      fs.writeFile(filePath, groupLines.join("\n"), (err) => {
        if (err) {
          console.error(`Kesalahan saat menulis ke ${fileName}:`, err);
        } else {
          console.log(`${fileName} telah dibuat.`);
        }
      });
    });
  });
}

const inputFileName = process.argv[2];

if (!inputFileName) {
  console.error("Silakan masukkan nama file CSV sebagai argumen.");
  process.exit(1);
}

const inputCsv = path.join(__dirname, "data", inputFileName);
processCsv(inputCsv);
