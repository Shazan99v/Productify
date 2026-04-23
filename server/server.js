import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/productsRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import wishlistRoutes from "./routes/whishlistRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes 
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);

// Test Route
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "API running...", time: result.rows[0].now });
  } catch (error) {
    console.error("DB Query Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Explicitly test Postgres connection
  try {
    const client = await pool.connect();
    console.log(" PostgreSQL connected successfully");
    client.release(); // release client back to pool
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
  }
});