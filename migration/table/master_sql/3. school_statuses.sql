CREATE TABLE IF NOT EXISTS school_statuses
(
    id smallserial NOT NULL,
    name character varying(255) NOT NULL UNIQUE
);

TRUNCATE TABLE school_statuses RESTART IDENTITY;

INSERT INTO school_statuses (name) VALUES
('Pending'),
('Active'),
('Unpaid');