# Sumber Data
Data statis (.json) diambil dari:  
[https://sig.bps.go.id/bridging-kode](https://sig.bps.go.id/bridging-kode)

# Cara Menggunakan Generator
```bash
cd generator
node index.js
```

# Cara Menggunakan API
Dokumentasi ini menjelaskan penggunaan API untuk mengambil data wilayah di Indonesia, termasuk provinsi, kabupaten, kecamatan, dan desa.

## 1. Mengambil Semua Data Wilayah (Tingkatan)

- **Endpoint:** `/api/wilayah`
- **Method:** `GET`

### Contoh Permintaan:
```http
GET http://yourdomain.com/api/wilayah
```

### Response
```json
{
  "status": "success",
  "data": [ /* array data provinsi */ ]
}
```

## 2. Mengambil Semua Data Kabupaten Berdasarkan Kode Provinsi

- **Endpoint:** `/api/bertingkat/kabupaten/:kode_provinsi`
- **Method:** `GET`

### Contoh Permintaan:
```http
GET http://yourdomain.com/api/bertingkat/kabupaten/62
```

### Response
```json
{
  "status": "success",
  "data": [ /* array data kabupaten yang merupakan anak dari provinsi dengan kode 62 */ ]
}
```

## 3. Mengambil Detail Provinsi Berdasarkan Kode

- **Endpoint:** `/api/detail/provinsi/:kode_provinsi`
- **Method:** `GET`

### Contoh Permintaan:
```http
GET http://yourdomain.com/api/detail/provinsi/62
```

### Response
```json
{
  "status": "success",
  "data": { /* detail data provinsi dengan kode 62 */ }
}
```

## 4. Mengambil Semua Data Kecamatan Berdasarkan Kode Kabupaten

- **Endpoint:** `/api/bertingkat/kecamatan/:kode_kabupaten`
- **Method:** `GET`

### Contoh Permintaan:
```http
GET http://yourdomain.com/api/bertingkat/kecamatan/6201
```

### Response
```json
{
  "status": "success",
  "data": [ /* array data kecamatan yang merupakan anak dari kabupaten dengan kode 6201 */ ]
}
```

## 5. Mengambil Detail Kabupaten Berdasarkan Kode

- **Endpoint:** `/api/detail/kabupaten/:kode_kabupaten`
- **Method:** `GET`

### Contoh Permintaan:
```http
GET http://yourdomain.com/api/detail/kabupaten/6201
```

### Response
```json
{
  "status": "success",
  "data": { /* detail data kabupaten dengan kode 6201 */ }
}
```

## 6. Mengambil Semua Data Desa Berdasarkan Kode Kecamatan

- **Endpoint:** `/api/bertingkat/desa/:kode_kecamatan`
- **Method:** `GET`

### Contoh Permintaan:
```http
GET http://yourdomain.com/api/bertingkat/desa/620102
```

### Response
```json
{
  "status": "success",
  "data": [ /* array data desa yang merupakan anak dari kecamatan dengan kode 620102 */ ]
}
```

## 7. Mengambil Detail Kecamatan Berdasarkan Kode

- **Endpoint:** `/api/detail/kecamatan/:kode_kecamatan`
- **Method:** `GET`

### Contoh Permintaan:
```http
GET http://yourdomain.com/api/detail/kecamatan/620102
```

### Response
```json
{
  "status": "success",
  "data": { /* detail data kecamatan dengan kode 620102 */ }
}
```

## 8. Mengambil Detail Desa Berdasarkan Kode

- **Endpoint:** `/api/detail/desa/:kode_desa`
- **Method:** `GET`

### Contoh Permintaan:
```http
GET http://yourdomain.com/api/detail/desa/62010201
```

### Response
```json
{
  "status": "success",
  "data": { /* detail data desa dengan kode 62010201 */ }
}
```

## Buy Me a Coffee
<a href="https://saweria.co/andifahruddinakas" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important; width: 174px !important; box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important; -webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;"></a>
