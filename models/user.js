import db from '../config/db.js';
import bcrypt from 'bcrypt';

// Find user by email
const findUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

// Find user by ID
const findUserById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

// Create a new user
const createUser = async (name, email, hashedPassword) => {
  await db.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)', // Adjust query
    [name, email, hashedPassword]
  );
};

const registerUser = async (name, email, password) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser(name, email, hashedPassword);

  const newUser = await findUserByEmail(email);

  // Generate JWT token
  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

export { findUserByEmail, findUserById, createUser, registerUser };
