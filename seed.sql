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
-- 2. CARTAS LEGENDARY (2)
-- =====================

INSERT INTO "cards" ("cardid", "name", "description", "country", "position", "statspeed", "statshooting", "statpower", "rarity") VALUES
('MES-10', 'Lionel Messi',          'El capitan legendario, maestro del regate y la vision.',        'Argentina',  'DEL', 85, 96, 80, 'legendary'),
('CR7-07', 'Cristiano Ronaldo',     'Potencia, velocidad y gol. El maximo goleador de la historia.', 'Portugal',   'DEL', 89, 94, 88, 'legendary')
ON CONFLICT ("cardid") DO NOTHING;

-- =====================
-- 3. CARTAS RARE (13)
-- =====================

INSERT INTO "cards" ("cardid", "name", "description", "country", "position", "statspeed", "statshooting", "statpower", "rarity") VALUES
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
-- 4. CARTAS COMMON (36)
-- =====================

INSERT INTO "cards" ("cardid", "name", "description", "country", "position", "statspeed", "statshooting", "statpower", "rarity") VALUES
('MOD-10', 'Luka Modric',           'El motor del mediocampo, elegancia y precision.',               'Croacia',    'MC',  75, 82, 70, 'common'),
('LEW-09', 'Robert Lewandowski',    'Delantero completo, el rey del area.',                          'Polonia',    'DEL', 75, 90, 85, 'common'),
('COU-23', 'Thibaut Courtois',      'Portero elite, reflejos y estatura.',                           'Belgica',    'POR', 60, 68, 78, 'common'),
('KAN-07', 'NGolo Kante',           'Motor incansable, recuperador de balones.',                     'Francia',    'MC',  84, 75, 83, 'common'),
('SON-07', 'Son Heung-min',         'Rapidez y gol desde la banda izquierda.',                       'Corea',      'EXT', 90, 86, 79, 'common'),
('MAH-26', 'Riyad Mahrez',          'Driblador elegante de la banda derecha.',                       'Argelia',    'EXT', 87, 84, 75, 'common'),
('CAS-14', 'Casemiro',              'Mediocampista defensivo solido y contundente.',                 'Brasil',     'MC',  72, 78, 88, 'common'),
('ALL-13', 'Alisson Becker',        'Portero tecnico y seguro bajo los tres palos.',                 'Brasil',     'POR', 58, 65, 72, 'common'),
('RUD-02', 'Antonio Rudiger',       'Defensor agresivo y determinado.',                              'Alemania',   'DEF', 80, 70, 90, 'common'),
('MAR-05', 'Marquinhos',            'Defensor elegante con lectura de juego.',                       'Brasil',     'DEF', 77, 72, 82, 'common'),
('DIA-03', 'Ruben Dias',            'Concentracion y liderazgo en la zaga.',                         'Portugal',   'DEF', 72, 68, 84, 'common'),
('KOU-26', 'Kalidou Koulibaly',     'Potencia fisica e imposicion en el area.',                     'Senegal',    'DEF', 78, 70, 92, 'common'),
('WAL-02', 'Kyle Walker',           'Lateral derecho veloz e incansable.',                           'Inglaterra', 'DEF', 90, 72, 80, 'common'),
('CAN-19', 'Joao Cancelo',          'Lateral polivalente, tecnico y ofensivo.',                      'Portugal',   'DEF', 85, 78, 78, 'common'),
('REE-03', 'Reece James',           'Lateral derecho potente y proyectado al ataque.',               'Inglaterra', 'DEF', 82, 75, 83, 'common'),
('BRU-08', 'Bruno Fernandes',       'Mediapunta creativo y goleador.',                               'Portugal',   'MC',  80, 86, 78, 'common'),
('BAR-18', 'Pedri',                 'Talento precoz, toque y vision de juego.',                      'Espana',     'MC',  78, 82, 73, 'common'),
('GAV-06', 'Gavi',                  'Energia e intensidad en el mediocampo espanol.',                'Espana',     'MC',  80, 80, 78, 'common'),
('FRE-20', 'Frenkie de Jong',       'Elegancia y salida del balon desde el centro.',                 'Holanda',    'MC',  79, 80, 78, 'common'),
('VER-23', 'Marco Verratti',        'Toque y precision en el corazon del campo.',                    'Italia',     'MC',  75, 79, 72, 'common'),
('THI-06', 'Thiago Alcantara',      'Tecnica y control del juego desde la base.',                    'Espana',     'MC',  76, 80, 72, 'common'),
('RAP-10', 'Raphinha',              'Desborde y centro desde la banda derecha.',                     'Brasil',     'EXT', 88, 83, 77, 'common'),
('SAK-07', 'Bukayo Saka',           'Joven estrella con velocidad y desborde.',                      'Inglaterra', 'EXT', 87, 83, 76, 'common'),
('FOD-20', 'Phil Foden',            'Talento unico, creatividad y gol.',                             'Inglaterra', 'EXT', 83, 86, 76, 'common'),
('GRI-07', 'Antoine Griezmann',     'Tecnico y goleador, referente del equipo.',                     'Francia',    'DEL', 82, 87, 78, 'common'),
('MUL-25', 'Thomas Muller',         'Inteligencia tactica y oportunismo en el area.',                'Alemania',   'DEL', 78, 83, 77, 'common'),
('OSI-09', 'Victor Osimhen',        'Potencia y velocidad en el area rival.',                        'Nigeria',    'DEL', 88, 86, 87, 'common'),
('RAC-11', 'Marcus Rashford',       'Velocidad y desborde por la izquierda.',                        'Inglaterra', 'EXT', 90, 83, 80, 'common'),
('CHU-17', 'Tchouameni',            'Mediocampista defensivo solido y elegante.',                    'Francia',    'MC',  78, 76, 84, 'common'),
('ROD-16', 'Rodri',                 'Pivote ordenado, recuperador y distribuidor.',                  'Espana',     'MC',  72, 78, 84, 'common'),
('KOV-08', 'Mateo Kovacic',         'Box-to-box con energia y tecnica.',                             'Croacia',    'MC',  82, 79, 80, 'common'),
('MIL-04', 'Eder Militao',          'Defensor explosivo y de salida rapida.',                        'Brasil',     'DEF', 82, 70, 84, 'common'),
('ARA-04', 'Ronald Araujo',         'Defensor contundente y fuerte en el juego aereo.',              'Uruguay',    'DEF', 80, 68, 88, 'common'),
('KOS-15', 'Diogo Costa',           'Portero moderno, habil con los pies.',                          'Portugal',   'POR', 65, 70, 74, 'common'),
('DON-21', 'Gianluigi Donnarumma',  'Gran portero con estatura y reflejos.',                         'Italia',     'POR', 62, 68, 76, 'common'),
('TER-01', 'Marc-Andre ter Stegen', 'Portero tecnico y lider en el juego con balon.',                'Alemania',   'POR', 64, 72, 74, 'common')
ON CONFLICT ("cardid") DO NOTHING;

-- =====================
-- VERIFICACION FINAL
-- =====================
SELECT COUNT(*) AS total_cartas FROM "cards";
-- Debe mostrar 51
