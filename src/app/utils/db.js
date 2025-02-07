import mysql from "mysql2/promise";

// Buat koneksi ke database
export const db = mysql.createPool({
  host: "sql12.freesqldatabase.com", // Host database
  user: "sql12761337", // Username
  password: "RLKRJUc3nF", // Password
  database: "sql12761337", // Nama database
});
