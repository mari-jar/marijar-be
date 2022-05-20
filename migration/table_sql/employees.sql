CREATE TABLE IF NOT EXISTS employees (
    id UUID NOT NULL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    school_id UUID NOT NULL REFERENCES schools(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    zone JSONB,
    postal_code INTEGER NOT NULL,
    phone_number BIGINT NOT NULL,
    nik BIGINT NOT NULL,
    position VARCHAR(255) NOT NULL,
    image JSONB NOT NULL,
    created_at TIMESTAMP without time zone NOT NULL,
    updated_at TIMESTAMP without time zone NOT NULL,
    data JSONB
)