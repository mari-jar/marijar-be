DO $$
BEGIN

CREATE TABLE IF NOT EXISTS students (
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
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
    created_at TIMESTAMP without time zone NOT NULL DEFAULT transaction_timestamp(),
    updated_at TIMESTAMP without time zone NOT NULL DEFAULT transaction_timestamp()
);

IF NOT EXISTS (select * FROM pg_trigger where tgname = 'update_timestamp_students') 
THEN
    CREATE TRIGGER update_timestamp_students
    BEFORE UPDATE
    ON students
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
END IF;
END
$$;