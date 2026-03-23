import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const sql = require('mssql/msnodesqlv8');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=yes;`
};

app.get('/', (req, res) => {
    res.send('ScanCup API is running');
});

// Endpoint to test DB connection
app.get('/api/test-db', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT 1 as test, @@VERSION as version');
        res.json({ success: true, message: '¡Conectado exitosamente a SQL Server (db_scancup)!', data: result.recordset });
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

        const pool = await sql.connect(dbConfig);
        
        const userCheck = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT UserId FROM Users WHERE Email = @email');
            
        if (userCheck.recordset.length > 0) {
            return res.status(400).json({ success: false, message: 'El usuario ya existe' });
        }

        const insertQuery = `
            INSERT INTO Users (Name, Email, PasswordHash, Level, Points)
            OUTPUT inserted.UserId, inserted.Name, inserted.Email, inserted.Level, inserted.Points
            VALUES (@name, @email, @passwordHash, 1, 0)
        `;
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('passwordHash', sql.NVarChar, passwordHash)
            .query(insertQuery);
        
        const user = result.recordset[0];
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
        
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM Users WHERE Email = @email');
            
        if (result.recordset.length === 0) {
            return res.status(400).json({ success: false, message: 'Credenciales inválidas' });
        }

        const user = result.recordset[0];
        const isMatch = await bcrypt.compare(password, user.PasswordHash || '');
        
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user.UserId }, process.env.JWT_SECRET || 'scancup_secret', { expiresIn: '7d' });

        const countResult = await pool.request()
            .input('userId', sql.Int, user.UserId)
            .query('SELECT COUNT(*) AS collectionCount FROM UserCards WHERE UserId = @userId');

        delete user.PasswordHash;
        user.collectionCount = countResult.recordset[0].collectionCount;

        res.json({ success: true, token, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Obtener colección completa del usuario (catálogo + estado de coleccionado)
app.get('/api/collection', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let userId = null;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'scancup_secret');
            userId = decoded.id;
        } catch { /* token inválido, mostramos catálogo sin estado */ }
    }

    try {
        const pool = await sql.connect(dbConfig);
        const request = pool.request();

        let query;
        if (userId) {
            request.input('userId', sql.Int, userId);
            query = `
                SELECT
                    c.CardId, c.Name, c.Description, c.ImageUrl,
                    c.Country, c.Position,
                    c.StatSpeed, c.StatShooting, c.StatPower,
                    c.Rarity,
                    CASE WHEN uc.UserId IS NOT NULL THEN 1 ELSE 0 END AS IsCollected,
                    ISNULL(uc.Quantity, 0) AS Quantity
                FROM Cards c
                LEFT JOIN UserCards uc ON c.CardId = uc.CardId AND uc.UserId = @userId
                ORDER BY c.CreatedAt
            `;
        } else {
            query = `
                SELECT
                    c.CardId, c.Name, c.Description, c.ImageUrl,
                    c.Country, c.Position,
                    c.StatSpeed, c.StatShooting, c.StatPower,
                    c.Rarity,
                    0 AS IsCollected,
                    0 AS Quantity
                FROM Cards c
                ORDER BY c.CreatedAt
            `;
        }

        const result = await request.query(query);
        res.json({ success: true, cards: result.recordset });
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

// Agregar carta a la colección del usuario
app.post('/api/collection/add', verifyToken, async (req, res) => {
    try {
        const { cardId } = req.body;
        if (!cardId) return res.status(400).json({ success: false, message: 'cardId requerido' });

        const pool = await sql.connect(dbConfig);

        const cardCheck = await pool.request()
            .input('cardId', sql.NVarChar, cardId)
            .query('SELECT CardId FROM Cards WHERE CardId = @cardId');

        if (cardCheck.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Carta no encontrada en el catálogo' });
        }

        await pool.request()
            .input('userId', sql.Int, req.userId)
            .input('cardId', sql.NVarChar, cardId)
            .query(`
                IF EXISTS (SELECT 1 FROM UserCards WHERE UserId = @userId AND CardId = @cardId)
                    UPDATE UserCards SET Quantity = Quantity + 1 WHERE UserId = @userId AND CardId = @cardId
                ELSE
                    INSERT INTO UserCards (UserId, CardId) VALUES (@userId, @cardId)
            `);

        const updateResult = await pool.request()
            .input('userId', sql.Int, req.userId)
            .query(`
                UPDATE Users SET Points = Points + 50, [Level] = (Points + 50) / 500 + 1
                OUTPUT inserted.Points, inserted.[Level]
                WHERE UserId = @userId
            `);

        const countResult = await pool.request()
            .input('userId', sql.Int, req.userId)
            .query('SELECT COUNT(*) as collectionCount FROM UserCards WHERE UserId = @userId');

        const { Points, Level } = updateResult.recordset[0];
        const { collectionCount } = countResult.recordset[0];

        res.json({ success: true, points: Points, level: Level, collectionCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Guardar puntaje de trivia y sumar experiencia
app.post('/api/trivia/save-score', verifyToken, async (req, res) => {
    try {
        const { pointsEarned } = req.body;
        if (pointsEarned === undefined) return res.status(400).json({ success: false, message: 'pointsEarned requerido' });

        const pool = await sql.connect(dbConfig);

        await pool.request()
            .input('userId', sql.Int, req.userId)
            .input('pointsEarned', sql.Int, pointsEarned)
            .query('INSERT INTO TriviaScores (UserId, PointsEarned) VALUES (@userId, @pointsEarned)');

        const updateResult = await pool.request()
            .input('userId', sql.Int, req.userId)
            .input('pts', sql.Int, pointsEarned)
            .query(`
                UPDATE Users SET Points = Points + @pts, [Level] = (Points + @pts) / 500 + 1
                OUTPUT inserted.Points, inserted.[Level]
                WHERE UserId = @userId
            `);

        const { Points, Level } = updateResult.recordset[0];
        res.json({ success: true, points: Points, level: Level });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        await sql.connect(dbConfig);
        console.log('¡Conexión a SQL Server (db_scancup) establecida con éxito en el arranque!');
    } catch (err) {
        console.error('Error al conectar a SQL Server en el arranque:', err.message);
    }
});
