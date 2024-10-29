const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const app = express();

app.use(express.json());

const readJsonFile = async (filePath) => {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
};

const sendResponse = (res, status, data = null, message = "") => {
  res
    .status(status)
    .json({ status: status === 200 ? "success" : "error", data, message });
};

const getData = async (filePath, res, filterFn) => {
  try {
    const data = await readJsonFile(filePath);
    const filteredData = filterFn ? data.filter(filterFn) : data;

    if (!filteredData.length) {
      return sendResponse(res, 404, null, "Not Found");
    }

    sendResponse(res, 200, filteredData, "OK");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
};

app.get("/", (req, res) => {
  res.send(`
    <h1>Informasi Cara Penggunaan API</h1>
    <p>API ini digunakan untuk mengambil data wilayah di Indonesia.</p>
    <h2>Endpoint:</h2>
    <ul>
      <li><strong>GET /api/wilayah/:kode</strong> - Mengambil data berdasarkan kode (provinsi, kabupaten, kecamatan, desa).</li>
      <li><strong>GET /api/bertingkat/:tingkatan/:kode?</strong> - Mengambil data bertingkat berdasarkan kode provinsi, kabupaten, atau kecamatan.</li>
      <li><strong>GET /api/detail/:tingkatan/:kode</strong> - Mengambil detail data berdasarkan tingkatan dan kode.</li>
    </ul>
    <h2>Contoh Permintaan:</h2>
    <pre>
      GET /api/wilayah
      GET /api/bertingkat/kabupaten/62
      GET /api/detail/kecamatan/620102
    </pre>
  `);
});

app.get("/api/wilayah", (req, res) => {
  const filePath = path.join(__dirname, "wilayah", "provinsi.json");
  getData(filePath, res);
});

app.get("/api/wilayah/:kode", async (req, res) => {
  const { kode } = req.params;
  const fileMap = {
    2: "kabupaten.json",
    4: "kecamatan.json",
    6: "desa.json",
    10: "desa.json",
  };

  const filePath = fileMap[kode.length];
  if (!filePath) return sendResponse(res, 400, null, "Not Found");

  kode.length === 10
    ? getDataByDetail(kode, path.join(__dirname, "wilayah", filePath), res)
    : getDataByParent(kode, path.join(__dirname, "wilayah", filePath), res);
});

const getDataByParent = async (kode, filePath, res) => {
  try {
    const data = await readJsonFile(filePath);
    const filteredData = data.filter((item) => item.parent === Number(kode));

    if (!filteredData.length) {
      return sendResponse(res, 404, null, "Not Found");
    }

    sendResponse(res, 200, filteredData, "OK");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
};

const getDataByDetail = async (kode, filePath, res) => {
  try {
    const data = await readJsonFile(filePath);
    const filteredData = data.filter((item) => item.id === Number(kode));

    if (!filteredData.length) {
      return sendResponse(res, 404, null, "Not Found");
    }

    sendResponse(res, 200, filteredData, "OK");
  } catch (error) {
    sendResponse(res, 500, null, error.message);
  }
};

app.get("/api/bertingkat/:tingkatan/:kode?", async (req, res) => {
  const { tingkatan, kode } = req.params;
  const filePath = path.join(__dirname, "wilayah", `${tingkatan}.json`);

  if (!["provinsi", "kabupaten", "kecamatan", "desa"].includes(tingkatan)) {
    return sendResponse(res, 400, null, "Not Found");
  }

  const filterFn = kode ? (item) => item.parent === Number(kode) : null;
  getData(filePath, res, filterFn);
});

app.get("/api/detail/:tingkatan/:kode", async (req, res) => {
  const { tingkatan, kode } = req.params;
  const filePath = path.join(__dirname, "wilayah", `${tingkatan}.json`);

  if (!["provinsi", "kabupaten", "kecamatan", "desa"].includes(tingkatan)) {
    return sendResponse(res, 400, null, "Not Found");
  }

  getData(filePath, res, (item) => item.id === Number(kode));
});

app.use((req, res) => {
  sendResponse(res, 404, null, "Not Found");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // console.log(`Server is running on port http://localhost:${PORT}`);
});
