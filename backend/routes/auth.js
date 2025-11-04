const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const loginLimiter = require('../middleware/loginLimiter');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

// ------------------- CREATE USER -------------------
router.post(
  '/createuser',
  [
    body('name').isLength({ min: 5 }).withMessage('Name must be at least 5 chars'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 chars')
      .matches(/[0-9]/).withMessage('Password must contain a number')
      .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
      .matches(/[!@#$%^&*]/).withMessage('Password must contain a special character')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) return res.status(400).json({ error: 'Email already exists' });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Create user
      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        isVerified: false
      });

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.verificationToken = verificationToken;
      await user.save();

      // Respond to frontend
      res.json({ msg: 'User created. Please check your email to verify your account.' });

      // Send email asynchronously
      const verificationURL = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      sendEmail(
        user.email,
        'Verify your email',
        `<h3>Welcome, ${user.name}!</h3>
         <p>Please verify your email by clicking the link below:</p>
         <a href="${verificationURL}">${verificationURL}</a>`
      ).catch(err => console.error('Email not sent:', err));

    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  }
);

// ------------------- LOGIN -------------------
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').exists().withMessage('Password cannot be blank')
  ],
  loginLimiter,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

      if (!user.isVerified) return res.status(403).json({ error: "Please verify your email first" });

      const payload = { user: { id: user.id } };
      const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

      res.json({ authToken, msg: "Login successful" });

    } catch (err) {
      console.error("Login error:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ------------------- GET USER -------------------
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ------------------- VERIFY EMAIL -------------------
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ error: 'Invalid token' });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ msg: 'Email verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// ------------------- FORGOT PASSWORD -------------------
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const url = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail(user.email, 'Reset your password', `<p>Click to reset: <a href="${url}">${url}</a></p>`);

    res.json({ msg: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// ------------------- RESET PASSWORD -------------------
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
