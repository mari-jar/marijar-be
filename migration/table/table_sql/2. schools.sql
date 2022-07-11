DO $$
BEGIN

CREATE TABLE IF NOT EXISTS schools
(
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL UNIQUE,
    address character varying(255) COLLATE pg_catalog."default" NOT NULL,
    zone jsonb NOT NULL,
    postal_code integer NOT NULL,
    website character varying(255) COLLATE pg_catalog."default",
    image jsonb NOT NULL,
    phone_number bigint NOT NULL UNIQUE,
    npsn integer NOT NULL UNIQUE,
    school_level character varying(255) NOT NULL,
    description text,
    subscription jsonb,
    document jsonb,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    created_at TIMESTAMP without time zone NOT NULL DEFAULT transaction_timestamp(),
    updated_at TIMESTAMP without time zone NOT NULL DEFAULT transaction_timestamp(),
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

IF NOT EXISTS (select * FROM pg_trigger where tgname = 'update_timestamp_schools') 
THEN
    CREATE TRIGGER update_timestamp_schools
    BEFORE UPDATE
    ON schools
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
END IF;
END
$$;