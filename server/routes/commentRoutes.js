import express from "express";
import pool from "../config/db.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ================= Add Comment ================= */
router.post("/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: "Comment cannot be empty" });

    const newComment = await pool.query(
      `INSERT INTO comments (product_id, user_id, text)
       VALUES ($1, $2, $3) RETURNING *`,
      [productId, req.user.id, text]
    );

    res.status(201).json(newComment.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= Get Comments for Product ================= */
router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const comments = await pool.query(
      `SELECT comments.*, users.name, users.email
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE product_id = $1
       ORDER BY created_at ASC`,
      [productId]
    );

    res.json(comments.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= Delete Comment ================= */
router.delete("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;

    // Get comment with its product
    const commentRes = await pool.query(
      `SELECT c.*, p.user_id AS product_owner_id
       FROM comments c
       JOIN products p ON c.product_id = p.id
       WHERE c.id = $1`,
      [commentId]
    );

    if (commentRes.rows.length === 0)
      return res.status(404).json({ message: "Comment not found" });

    const comment = commentRes.rows[0];

    // Allow delete if comment owner OR product owner
    if (req.user.id !== comment.user_id && req.user.id !== comment.product_owner_id) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await pool.query("DELETE FROM comments WHERE id=$1", [commentId]);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;