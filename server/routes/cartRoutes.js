import express from "express";
import pool from "../config/db.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get user's cart items
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id as cart_id, p.*, c.quantity 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// Add item to cart
router.post("/", authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    // Check if already in cart
    const check = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2",
      [req.user.id, productId]
    );
    if (check.rows.length > 0) {
      return res.status(400).json({ message: "Product already in cart" });
    }

    const result = await pool.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, productId, quantity || 1]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

// Remove item from cart
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM cart WHERE id = $1 AND user_id = $2", [
      id,
      req.user.id,
    ]);
    res.json({ message: "Removed from cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

export default router;