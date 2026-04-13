-- ============================================================
-- ScanCup — Schema + Seed Data para PostgreSQL en Render
-- Ejecuta este archivo en DBeaver o en la shell de Render
-- ============================================================

-- =====================
-- 1. CREAR TABLAS
-- =====================

CREATE TABLE IF NOT EXISTS "users" (
    "userid"       SERIAL PRIMARY KEY,
    "name"         VARCHAR(255) NOT NULL,
    "email"        VARCHAR(255) UNIQUE NOT NULL,
    "passwordhash" TEXT NOT NULL,
    "level"        INTEGER DEFAULT 1,
    "points"       INTEGER DEFAULT 0,
    "avatarurl"    TEXT,
    "createdat"    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "cards" (
    "cardid"       VARCHAR(20) PRIMARY KEY,
    "name"         VARCHAR(255) NOT NULL,
    "description"  TEXT,
    "imageurl"     TEXT,
    "country"      VARCHAR(100),
    "position"     VARCHAR(10),
    "statspeed"    INTEGER,
    "statshooting" INTEGER,
    "statpower"    INTEGER,
    "rarity"       VARCHAR(20),
    "createdat"    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "usercards" (
    "userid"   INTEGER REFERENCES "users"("userid") ON DELETE CASCADE,
    "cardid"   VARCHAR(20) REFERENCES "cards"("cardid") ON DELETE CASCADE,
    "quantity" INTEGER DEFAULT 1,
    PRIMARY KEY ("userid", "cardid")
);

CREATE TABLE IF NOT EXISTS "triviascores" (
    "id"           SERIAL PRIMARY KEY,
    "userid"       INTEGER REFERENCES "users"("userid") ON DELETE CASCADE,
    "pointsearned" INTEGER,
    "createdat"    TIMESTAMP DEFAULT NOW()
);

-- =====================
-- 2. CARTAS DEL CATÁLOGO (MESSI, RONALDO + 13 SELECCIONADAS)
-- =====================

INSERT INTO "cards" ("cardid", "name", "description", "country", "position", "statspeed", "statshooting", "statpower", "rarity") VALUES
('MES-10', 'Lionel Messi',          'El capitan legendario, maestro del regate y la vision.',        'Argentina',  'DEL', 85, 96, 80, 'legendary'),
('CR7-07', 'Cristiano Ronaldo',     'Potencia, velocidad y gol. El maximo goleador de la historia.', 'Portugal',   'DEL', 89, 94, 88, 'legendary'),
('MBP-09', 'Kylian Mbappe',         'Velocidad explosiva y definicion letal.',                       'Francia',    'EXT', 97, 92, 88, 'rare'),
('NEY-11', 'Neymar Jr',             'Regate incansable y vision de juego privilegiada.',              'Brasil',     'EXT', 91, 87, 82, 'rare'),
('HAL-09', 'Erling Haaland',        'Maquina de goles, fisico imponente.',                           'Noruega',    'DEL', 89, 91, 92, 'rare'),
('SAL-11', 'Mohamed Salah',         'Velocidad y eficacia en la banda derecha.',                     'Egipto',     'EXT', 94, 89, 80, 'rare'),
('KDB-17', 'Kevin De Bruyne',       'El cerebro del mediocampo moderno.',                            'Belgica',    'MC',  78, 88, 82, 'rare'),
('BEL-08', 'Jude Bellingham',       'Energia, gol y liderazgo desde el mediocampo.',                 'Inglaterra', 'MC',  82, 85, 84, 'rare'),
('VIN-07', 'Vinicius Jr',           'Desborde, velocidad y gol desde la izquierda.',                 'Brasil',     'EXT', 95, 88, 82, 'rare'),
('KAN-09', 'Harry Kane',            'Artillero nato, potente y tecnico.',                            'Inglaterra', 'DEL', 75, 93, 88, 'rare'),
('OCH-01', 'Guillermo Ochoa',       'El guardameta historico de la seleccion mexicana.',             'Mexico',     'POR', 62, 70, 68, 'rare'),
('PUL-10', 'Christian Pulisic',     'Velocidad y creatividad del futbol norteamericano.',            'USA',        'EXT', 88, 84, 78, 'rare'),
('TAK-08', 'Takefusa Kubo',         'La perla del futbol japones, driblador incansable.',            'Japon',      'EXT', 86, 82, 73, 'rare'),
('BEN-09', 'Karim Benzema',         'Elegancia y lectura del juego en el area rival.',               'Francia',    'DEL', 79, 88, 82, 'rare'),
('VVD-04', 'Virgil van Dijk',       'Defensor impenetrable, liderazgo y potencia aerea.',            'Holanda',    'DEF', 76, 72, 90, 'rare')
ON CONFLICT ("cardid") DO NOTHING;

-- =====================
-- 3. VERIFICACION FINAL
-- =====================
SELECT COUNT(*) AS total_cartas FROM "cards";
-- Debe mostrar 15
