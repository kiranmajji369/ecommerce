const express = require("express");
const mysql = require("mysql2/promise");
const app = express();
const path = require("path")
const cors = require("cors");
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));


const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommerce",
});

app.get("/categories", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT 
    c.id AS category_id,
    c.name AS category_name,
    c.description,
    pi.image_url AS category_image
FROM categories c
LEFT JOIN products p 
    ON p.category_id = c.id
LEFT JOIN product_images pi 
    ON pi.product_id = p.id AND pi.is_primary = 1
GROUP BY c.id;`);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM products`);
    res.status(200).json({ data: rows });
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});
