const express = require("express");
const mysql = require("mysql2/promise"); // promise version for async/await
const app = express();
const PORT = 5000;
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommerce",
});
app.use(express.json());
app.get("/categories", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    res.status(200).json({ data: rows });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Server Error" });
  }
});
app.get("/products", (req, res) => {
  res.json([
    { id: 1, name: "Laptop", price: 50000 },
    { id: 2, name: "Mobile", price: 20000 },
  ]);
});
app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});
