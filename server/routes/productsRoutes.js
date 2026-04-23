import express from "express";
import pool from "../config/db.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ================= GET ALL PRODUCTS ================= */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT p.*, u.name, u.email FROM products p JOIN users u ON p.user_id = u.id ORDER BY p.id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= CREATE PRODUCT ================= */
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, imageUrl, price } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO products 
      (title, description, image_url, price, user_id)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [title, description, imageUrl, price, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= UPDATE PRODUCT ================= */
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, imageUrl, price } = req.body;

  try {
    // Check ownership
    const product = await pool.query(
      "SELECT * FROM products WHERE id=$1",
      [id]
    );

    if (!product.rows.length)
      return res.status(404).json({ message: "Product not found" });

    if (product.rows[0].user_id !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    const result = await pool.query(
      `UPDATE products
       SET title=$1, description=$2, image_url=$3, price=$4
       WHERE id=$5
       RETURNING *`,
      [title, description, imageUrl, price, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= DELETE PRODUCT (FULL FIX) ================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check product
    const product = await client.query(
      "SELECT * FROM products WHERE id=$1",
      [id]
    );

    if (!product.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.rows[0].user_id !== req.user.id) {
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "Not allowed" });
    }

    /* ===== DELETE FROM RELATED TABLES FIRST ===== */
    await client.query(
      "DELETE FROM wishlist WHERE product_id = $1",
      [id]
    );

    await client.query(
      "DELETE FROM cart WHERE product_id = $1",
      [id]
    );

    /* ===== DELETE PRODUCT ===== */
    await client.query(
      "DELETE FROM products WHERE id = $1",
      [id]
    );

    await client.query("COMMIT");

    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    await client.query("ROLLBACK");

    console.error("Delete Error:", err);

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });

  } finally {
    client.release();
  }
});

/* ================= GET SINGLE PRODUCT ================= */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT p.*, u.name, u.email 
       FROM products p
       JOIN users u ON p.user_id = u.id
       WHERE p.id=$1`,
      [id]
    );

    if (!result.rows.length)
      return res.status(404).json({ message: "Product not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;