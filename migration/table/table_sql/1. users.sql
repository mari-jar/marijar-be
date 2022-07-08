DO $$
BEGIN

CREATE TABLE IF NOT EXISTS users
(
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL UNIQUE,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    phone_number bigint NOT NULL UNIQUE,
    status character varying(255) COLLATE pg_catalog."default" NOT NULL,
    role character varying(255) NOT NULL,
    created_by uuid,
    updated_by uuid,
    created_at TIMESTAMP without time zone NOT NULL DEFAULT transaction_timestamp(),
    updated_at TIMESTAMP without time zone NOT NULL DEFAULT transaction_timestamp()
);

IF NOT EXISTS (select * FROM pg_trigger where tgname = 'update_timestamp_users') 
THEN
    CREATE TRIGGER update_timestamp_users
    BEFORE UPDATE
    ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
END IF;
END
$$;