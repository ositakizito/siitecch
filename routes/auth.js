import express from 'express';
import { registerUser, findUserByEmail } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Sign-Up
router.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const token = await registerUser(name, email, password);
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    console.error('Signup Error:', err.message);  // Log error for debugging
    res.status(500).json({ message: err.message });
  }
});



// Sign-In
router.post('/api/auth/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Sign-in successful', token });
  } catch (err) {
    console.error('Sign-In Error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
