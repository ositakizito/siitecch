import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


async function testConnection() {
  try {
    const [rows] = await db.execute('SELECT 1');
    console.log('Database connection successful!', rows);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();


export default db;
