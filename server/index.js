// index.js
const express = require("express");
const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Ecommerce server is running 🚀");
});

// Example product route
app.get("/products", (req, res) => {
  res.json([
    { id: 1, name: "Laptop", price: 50000 },
    { id: 2, name: "Mobile", price: 20000 }
  ]);
});

app.listen(PORT, () => {
  console.log(`✅ Server started on http://localhost:${PORT}`);
});
