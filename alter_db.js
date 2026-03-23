import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sql = require('mssql/msnodesqlv8');
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=yes;`
};

async function run() {
  try {
    const pool = await sql.connect(dbConfig);
    // Check if column exists, if not add it
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'Users') AND name = 'PasswordHash')
      BEGIN
          ALTER TABLE Users ADD PasswordHash NVARCHAR(255);
      END
    `);
    console.log("Column PasswordHash added successfully (if it didn't exist).");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
