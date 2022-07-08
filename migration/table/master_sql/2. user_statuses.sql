CREATE TABLE IF NOT EXISTS user_statuses
(
    id smallserial NOT NULL,
    name character varying(255) NOT NULL UNIQUE
);

TRUNCATE TABLE user_statuses RESTART IDENTITY;

INSERT INTO user_statuses (name) VALUES
('Not Verified'),
('Active'),
('Not Active');