import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import http from 'http';
import { Server } from 'socket.io';
import pkg from 'pg';
const { Pool } = pkg;
import multer from 'multer';
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB máximo
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Solo se permiten imágenes'));
    }
});
import { startSimulation } from './simulationEngine.js';

dotenv.config();

const app = express();
const serverObj = http.createServer(app);
const io = new Server(serverObj, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Iniciamos la simulación
startSimulation(io);

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Prueba de conexión rápida
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error adquiriendo cliente de Postgres:', err.stack);
    }
    console.log('¡Conectado exitosamente a la base de datos ScanCup en Render (PostgreSQL)!');
    release();
});

app.get('/', (req, res) => {
    res.send('ScanCup API is running on PostgreSQL');
});

// Endpoint to test DB connection
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT 1 as test, version() as version');
        res.json({ success: true, message: '¡Conectado exitosamente a PostgreSQL en Render!', data: result.rows });
    } catch (err) {
        console.error('Error connecting to BD:', err);
        res.status(500).json({ success: false, error: err.message, stack: err.stack });
    }
});

// Endpoint de Registro
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Faltan campos' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const userCheck = await pool.query('SELECT "userid" FROM "users" WHERE "email" = $1', [email]);

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'El usuario ya existe' });
        }

        const insertQuery = `
            INSERT INTO "users" ("name", "email", "passwordhash", "level", "points")
            VALUES ($1, $2, $3, 1, 0)
            RETURNING "userid" AS "UserId", "name" AS "Name", "email" AS "Email", "level" AS "Level", "points" AS "Points"
        `;
        const result = await pool.query(insertQuery, [name, email, passwordHash]);

        const user = result.rows[0];
        const token = jwt.sign({ id: user.UserId }, process.env.JWT_SECRET || 'scancup_secret', { expiresIn: '7d' });

        res.json({ success: true, token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Endpoint de Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Faltan credenciales' });

        const result = await pool.query(`
            SELECT "userid" AS "UserId", "name" AS "Name", "email" AS "Email", 
                   "avatarurl" AS "AvatarUrl", "level" AS "Level", "points" AS "Points", 
                   "passwordhash" AS "PasswordHash"
            FROM "users" 
            WHERE "email" = $1
        `, [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Credenciales inválidas' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.PasswordHash || '');

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user.UserId }, process.env.JWT_SECRET || 'scancup_secret', { expiresIn: '7d' });

        const countResult = await pool.query('SELECT COUNT(*) AS "collectionCount" FROM "usercards" WHERE "userid" = $1', [user.UserId]);

        delete user.PasswordHash;
        user.collectionCount = parseInt(countResult.rows[0].collectionCount);

        res.json({ success: true, token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Obtener colección completa del usuario
app.get('/api/collection', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let userId = null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'scancup_secret');
            userId = decoded.id;
        } catch { /* token inválido */ }
    }

    try {
        let query;
        let params = [];
        if (userId) {
            params = [userId];
            query = `
                SELECT
                    c."cardid" AS "CardId", c."name" AS "Name", c."description" AS "Description", c."imageurl" AS "ImageUrl",
                    c."country" AS "Country", c."position" AS "Position",
                    c."statspeed" AS "StatSpeed", c."statshooting" AS "StatShooting", c."statpower" AS "StatPower",
                    c."rarity" AS "Rarity",
                    CASE WHEN uc."userid" IS NOT NULL THEN 1 ELSE 0 END AS "IsCollected",
                    COALESCE(uc."quantity", 0) AS "Quantity"
                FROM "cards" c
                LEFT JOIN "usercards" uc ON c."cardid" = uc."cardid" AND uc."userid" = $1
                ORDER BY c."createdat"
            `;
        } else {
            query = `
                SELECT
                    c."cardid" AS "CardId", c."name" AS "Name", c."description" AS "Description", c."imageurl" AS "ImageUrl",
                    c."country" AS "Country", c."position" AS "Position",
                    c."statspeed" AS "StatSpeed", c."statshooting" AS "StatShooting", c."statpower" AS "StatPower",
                    c."rarity" AS "Rarity",
                    0 AS "IsCollected",
                    0 AS "Quantity"
                FROM "cards" c
                ORDER BY c."createdat"
            `;
        }

        const result = await pool.query(query, params);
        res.json({ success: true, cards: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error al obtener la colección' });
    }
});

// Middleware para verificar JWT
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Token requerido' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'scancup_secret');
        req.userId = decoded.id;
        next();
    } catch {
        return res.status(403).json({ success: false, message: 'Token inválido' });
    }
}

// Agregar carta a la colección
app.post('/api/collection/add', verifyToken, async (req, res) => {
    try {
        const { cardId } = req.body;
        if (!cardId) return res.status(400).json({ success: false, message: 'cardId requerido' });

        const cardCheck = await pool.query('SELECT "cardid" FROM "cards" WHERE "cardid" = $1', [cardId]);
        if (cardCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Carta no encontrada en el catálogo' });
        }

        // Upsert en UserCards
        await pool.query(`
            INSERT INTO "usercards" ("userid", "cardid", "quantity")
            VALUES ($1, $2, 1)
            ON CONFLICT ("userid", "cardid")
            DO UPDATE SET "quantity" = "usercards"."quantity" + 1
        `, [req.userId, cardId]);

        // Actualizar puntos y nivel
        const updateResult = await pool.query(`
            UPDATE "users"
            SET "points" = "points" + 50, "level" = ("points" + 50) / 500 + 1
            WHERE "userid" = $1
            RETURNING "points" AS "Points", "level" AS "Level"
        `, [req.userId]);

        const countResult = await pool.query('SELECT COUNT(*) as "collectionCount" FROM "usercards" WHERE "userid" = $1', [req.userId]);

        const { Points, Level } = updateResult.rows[0];
        const { collectionCount } = countResult.rows[0];

        res.json({ success: true, points: Points, level: Level, collectionCount: parseInt(collectionCount) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Guardar puntaje de trivia
app.post('/api/trivia/save-score', verifyToken, async (req, res) => {
    try {
        const { pointsEarned } = req.body;
        if (pointsEarned === undefined) return res.status(400).json({ success: false, message: 'pointsEarned requerido' });

        await pool.query('INSERT INTO "triviascores" ("userid", "pointsearned") VALUES ($1, $2)', [req.userId, pointsEarned]);

        const updateResult = await pool.query(`
            UPDATE "users"
            SET "points" = "points" + $1, "level" = ("points" + $1) / 500 + 1
            WHERE "userid" = $2
            RETURNING "points" AS "Points", "level" AS "Level"
        `, [pointsEarned, req.userId]);

        const { Points, Level } = updateResult.rows[0];
        res.json({ success: true, points: Points, level: Level });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Subir foto de perfil
app.patch('/api/profile/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No se recibió ningún archivo' });
        }

        const base64 = req.file.buffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${base64}`;

        await pool.query(
            'UPDATE "users" SET "avatarurl" = $1 WHERE "userid" = $2',
            [dataUrl, req.userId]
        );

        res.json({ success: true, avatarUrl: dataUrl });
    } catch (err) {
        console.error('[Avatar] Error:', err);
        res.status(500).json({ success: false, message: 'Error al guardar el avatar' });
    }
});

// Generar preguntas de trivia con Gemini AI (clave protegida en Render)
app.post('/api/trivia/generate', verifyToken, async (req, res) => {
    try {
        const { playerName } = req.body;
        if (!playerName) return res.status(400).json({ success: false, message: 'playerName requerido' });

        const apiKey = process.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            console.error('[Trivia] VITE_GEMINI_API_KEY no está configurada en las variables de entorno de Render');
            return res.status(500).json({ success: false, message: 'API key de Gemini no configurada en el servidor' });
        }

        const prompt = `Eres un experto en fútbol. Genera exactamente 5 preguntas de trivia de opción múltiple sobre el futbolista ${playerName}. Las preguntas deben ser variadas: logros, estadísticas, clubes, selección nacional e historia personal. Responde ÚNICAMENTE con un JSON válido con este formato exacto, sin texto adicional ni markdown:
{
  "preguntas": [
    {
      "texto": "¿Pregunta sobre ${playerName}?",
      "opciones": {"A": "opción1", "B": "opción2", "C": "opción3", "D": "opción4"},
      "correcta": "A"
    }
  ]
}`;

        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                        responseMimeType: 'application/json'
                    }
                })
            }
        );

        if (!geminiRes.ok) {
            const errBody = await geminiRes.json().catch(() => ({}));
            const apiMsg = errBody?.error?.message || '';
            console.error(`[Trivia] Error de Gemini (${geminiRes.status}):`, apiMsg);
            if (geminiRes.status === 429) {
                return res.status(429).json({ success: false, message: 'Límite de la API de Gemini alcanzado. Intenta más tarde.' });
            }
            return res.status(502).json({ success: false, message: `Error de Gemini (${geminiRes.status}): ${apiMsg}` });
        }

        const geminiData = await geminiRes.json();
        const candidate = geminiData.candidates?.[0];

        if (!candidate?.content?.parts?.[0]?.text) {
            const blockReason = geminiData.promptFeedback?.blockReason;
            return res.status(500).json({
                success: false,
                message: blockReason
                    ? `Solicitud bloqueada por Gemini: ${blockReason}`
                    : `La IA terminó sin contenido (finishReason: ${candidate?.finishReason || 'desconocido'})`
            });
        }

        let parsed;
        try {
            parsed = JSON.parse(candidate.content.parts[0].text);
        } catch {
            console.error('[Trivia] JSON inválido recibido de Gemini');
            return res.status(500).json({ success: false, message: 'La IA devolvió un formato no válido. Intenta de nuevo.' });
        }

        if (!parsed.preguntas || !Array.isArray(parsed.preguntas)) {
            return res.status(500).json({ success: false, message: 'El JSON de Gemini no contiene el campo "preguntas".' });
        }

        const LEVELS = ['Pro', 'Pro', 'Experto', 'Experto', 'Leyenda'];
        const questions = parsed.preguntas.slice(0, 5).map((q, i) => ({
            id: i + 1,
            number: i + 1,
            total: 5,
            level: LEVELS[i],
            streak: i + 1,
            text: String(q.texto),
            options: Object.entries(q.opciones).map(([id, text]) => ({ id, text: String(text) })),
            correct: String(q.correcta).toUpperCase().trim(),
        }));

        res.json({ success: true, questions });
    } catch (err) {
        console.error('[Trivia] Error inesperado:', err);
        res.status(500).json({ success: false, message: 'Error al generar la trivia' });
    }
});

const PORT = process.env.PORT || 5000;
serverObj.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

