CREATE TABLE IF NOT EXISTS user_roles
(
    id smallserial NOT NULL,
    name character varying(255) NOT NULL UNIQUE,
    disguise character varying(255) NOT NULL UNIQUE
);

TRUNCATE TABLE user_roles RESTART IDENTITY;

INSERT INTO user_roles (name, disguise) VALUES 
('school', 'aJ4c3@cea9JQkYCX'),
('employee', '3kza1avN8xFSabsz'),
('student', 'sNt!dYNpjsDyPPBV'),
('admin', 'HA9qmpqusKeEaT52'),
('admsin', 'HA9qsmpqusKeEaT52');
