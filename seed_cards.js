/**
 * seed_cards.js
 * Inserta en la tabla Cards todas las cartas escaneables de ScanCup.
 * Usa INSERT IF NOT EXISTS para ser idempotente (se puede correr varias veces).
 *
 * Ejecutar con:  node seed_cards.js
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sql = require('mssql/msnodesqlv8');
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  connectionString: `Driver={ODBC Driver 17 for SQL Server};Server=${process.env.DB_SERVER};Database=${process.env.DB_DATABASE};Trusted_Connection=yes;`
};

const cards = [
  {
    CardId:      'MES-10',
    Name:        'Lionel Messi',
    Description: 'El capitán legendario, maestro del regate y la visión.',
    ImageUrl:    '/textures/textV2/messi2026_1.png',
    Country:     'Argentina',
    Position:    'DEL',
    StatSpeed:   85,
    StatShooting:96,
    StatPower:   80,
    Rarity:      'legendary',
  },
  {
    CardId:      'OCH-01',
    Name:        'Guillermo Ochoa',
    Description: 'El guardameta más carismático de México.',
    ImageUrl:    '/textures/textV2/ochoa2026_1.png',
    Country:     'México',
    Position:    'POR',
    StatSpeed:   70,
    StatShooting:55,
    StatPower:   72,
    Rarity:      'common',
  },
  {
    CardId:      'MBP-09',
    Name:        'Kylian Mbappé',
    Description: 'Velocidad explosiva y definición letal.',
    ImageUrl:    '/textures/textV2/mbappe2026_1.png',
    Country:     'Francia',
    Position:    'EXT',
    StatSpeed:   97,
    StatShooting:92,
    StatPower:   88,
    Rarity:      'rare',
  },
  {
    CardId:      'NEY-11',
    Name:        'Neymar Jr.',
    Description: 'Magia con el balón y espectáculo puro.',
    ImageUrl:    '/textures/textV2/neymar2026_1.png',
    Country:     'Brasil',
    Position:    'EXT',
    StatSpeed:   88,
    StatShooting:89,
    StatPower:   80,
    Rarity:      'rare',
  },
  {
    CardId:      'PUL-10',
    Name:        'Christian Pulisic',
    Description: 'El capitán del fútbol americano en la élite mundial.',
    ImageUrl:    '/textures/textV2/pulisic2026_1.png',
    Country:     'Estados Unidos',
    Position:    'EXT',
    StatSpeed:   82,
    StatShooting:80,
    StatPower:   75,
    Rarity:      'common',
  },
  {
    CardId:      'CR7-07',
    Name:        'Cristiano Ronaldo',
    Description: 'Leyenda viviente, cinco Balones de Oro.',
    ImageUrl:    '/textures/textV2/ronaldo2026_1.png',
    Country:     'Portugal',
    Position:    'DEL',
    StatSpeed:   88,
    StatShooting:95,
    StatPower:   90,
    Rarity:      'legendary',
  },
  {
    CardId:      'SON-07',
    Name:        'Son Heung-min',
    Description: 'El mejor jugador asiático de la historia reciente.',
    ImageUrl:    '/textures/textV2/son2026_1.png',
    Country:     'Corea del Sur',
    Position:    'EXT',
    StatSpeed:   90,
    StatShooting:88,
    StatPower:   78,
    Rarity:      'rare',
  },
  {
    CardId:      'TAK-08',
    Name:        'Takefusa Kubo',
    Description: 'La joven promesa japonesa con técnica europea.',
    ImageUrl:    '/textures/textV2/takefusa2026_1.png',
    Country:     'Japón',
    Position:    'EXT',
    StatSpeed:   85,
    StatShooting:82,
    StatPower:   72,
    Rarity:      'common',
  },
];

async function seed() {
  const pool = await sql.connect(dbConfig);
  console.log('Conectado a la BD. Insertando cartas...\n');

  for (const card of cards) {
    const exists = await pool.request()
      .input('CardId', sql.NVarChar, card.CardId)
      .query('SELECT 1 FROM Cards WHERE CardId = @CardId');

    if (exists.recordset.length > 0) {
      console.log(`  ⏭  ${card.CardId} (${card.Name}) — ya existe, se omite.`);
      continue;
    }

    await pool.request()
      .input('CardId',       sql.NVarChar, card.CardId)
      .input('Name',         sql.NVarChar, card.Name)
      .input('Description',  sql.NVarChar, card.Description)
      .input('ImageUrl',     sql.NVarChar, card.ImageUrl)
      .input('Country',      sql.NVarChar, card.Country)
      .input('Position',     sql.NVarChar, card.Position)
      .input('StatSpeed',    sql.Int,      card.StatSpeed)
      .input('StatShooting', sql.Int,      card.StatShooting)
      .input('StatPower',    sql.Int,      card.StatPower)
      .input('Rarity',       sql.NVarChar, card.Rarity)
      .query(`
        INSERT INTO Cards (CardId, Name, Description, ImageUrl, Country, Position, StatSpeed, StatShooting, StatPower, Rarity)
        VALUES (@CardId, @Name, @Description, @ImageUrl, @Country, @Position, @StatSpeed, @StatShooting, @StatPower, @Rarity)
      `);

    console.log(`  ✅  ${card.CardId} (${card.Name}) — insertada.`);
  }

  console.log('\nListo. Cierra la conexión.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
