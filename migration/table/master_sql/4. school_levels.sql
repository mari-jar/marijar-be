CREATE TABLE IF NOT EXISTS school_levels
(
    id smallserial NOT NULL,
    name character varying(255) NOT NULL UNIQUE,
    abbreviation character varying(255) NOT NULL UNIQUE
);

TRUNCATE TABLE school_levels RESTART IDENTITY;

INSERT INTO school_levels (name, abbreviation) VALUES
('Sekolah Dasar', 'SD'),
('Sekolah Menengah Pertama', 'SMP'),
('Sekolah Menengah Atas', 'SMA');