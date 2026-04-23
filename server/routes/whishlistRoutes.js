import express from "express";
import pool from "../config/db.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get user's wishlist items
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.id as wishlist_id, p.* 
       FROM wishlist w 
       JOIN products p ON w.product_id = p.id 
       WHERE w.user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// Add item to wishlist
router.post("/", authMiddleware, async (req, res) => {
  const { productId } = req.body;
  try {
    const check = await pool.query(
      "SELECT * FROM wishlist WHERE user_id = $1 AND product_id = $2",
      [req.user.id, productId]
    );
    if (check.rows.length > 0) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    const result = await pool.query(
      "INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) RETURNING *",
      [req.user.id, productId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

// Remove item from wishlist
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM wishlist WHERE id = $1 AND user_id = $2", [
      id,
      req.user.id,
    ]);
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
});

export default router;