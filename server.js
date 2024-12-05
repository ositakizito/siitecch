import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport'; // Initialized in `auth/passport.js`
import cors from 'cors';
import authRoutes from './routes/auth.js';
// import authenticateToken from './middlewares/authenticateToken.js'; 
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const jsonFilePath = join(__dirname, "data", "siitecch.json");

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);

const readJSONFile = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(jsonFilePath, 'utf8', (err, data) => {
            if (err) {
                reject('Error reading file');
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

// Route to fetch all languages
app.get('/api/languages', async (req, res) => {
    try {
        const data = await readJSONFile(); // Wait for file reading to finish
        res.json(data.languages); // Send the languages
    } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).json({ error: 'Failed to read data. Please try again later.' });
    }
});

// Route to fetch a single language by slug
app.get('/api/languages/:slug', async (req, res) => {
    const { slug } = req.params;

    try {
        const data = await readJSONFile(); // Wait for file reading to finish
        const language = data.languages.find(lang => lang.slug === slug); // Find the language by slug

        if (!language) {
            console.warn('Language not found:', slug);
            res.status(404).json({ error: 'Language not found. Please check the link.' });
        } else {
            res.json(language); // Send the language data
        }
    } catch (err) {
        console.error('Error reading file:', err);
        res.status(500).json({ error: 'Failed to read data. Please try again later.' });
    }
});

const PORT = process.env.PORT || 3306;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
