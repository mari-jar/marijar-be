CREATE TABLE IF NOT EXISTS students (
    id UUID NOT NULL PRIMARY KEY,
    user_id UUID REFERENCES users(id) UNIQUE,
    school_id UUID NOT NULL REFERENCES schools(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL,
    zone JSONB,
    postal_code INTEGER NOT NULL,
    phone_number BIGINT NOT NULL UNIQUE,
    nisn BIGINT NOT NULL UNIQUE,
    image JSONB NOT NULL,
    created_at TIMESTAMP without time zone NOT NULL,
    updated_at TIMESTAMP without time zone NOT NULL,
    data JSONB
)