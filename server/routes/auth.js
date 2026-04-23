import express from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ===================== SignUp =====================
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExist = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userExist.rows.length > 0) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    await pool.query(
      "INSERT INTO users (name, email, password, otp, is_verified) VALUES ($1,$2,$3,$4,$5)",
      [name, email, hashedPassword, otp, false]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Verification",
      text: `Your OTP is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent to your email", email });
  } catch (error) {
    console.error("SignUp Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ===================== Verify OTP =====================
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userResult.rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = userResult.rows[0];
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    await pool.query("UPDATE users SET is_verified = true, otp = NULL WHERE email=$1", [email]);
    res.status(200).json({ message: "OTP verified successfully. You can now login." });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ===================== Login =====================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userResult.rows.length === 0) return res.status(400).json({ message: "Invalid email or password" });

    const user = userResult.rows[0];
    if (!user.is_verified) return res.status(400).json({ message: "Email not verified. Please check your inbox." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ===================== Forgot Password =====================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userResult.rows.length === 0) return res.status(400).json({ message: "User not found" });

    const otp = generateOTP();
    await pool.query("UPDATE users SET otp=$1 WHERE email=$2", [otp, email]);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP to Reset Password",
      text: `Your OTP to reset password is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent to your email", email });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ===================== Reset Password =====================
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (userResult.rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = userResult.rows[0];
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password=$1, otp=NULL WHERE email=$2", [hashedPassword, email]);

    res.status(200).json({ message: "Password reset successful. You can now login." });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;