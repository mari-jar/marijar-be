CREATE TABLE IF NOT EXISTS schools
(
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    address character varying(255) COLLATE pg_catalog."default" NOT NULL,
    zone jsonb NOT NULL,
    postal_code integer NOT NULL,
    website character varying(255) COLLATE pg_catalog."default",
    image jsonb NOT NULL,
    phone_number bigint NOT NULL,
    npsn integer NOT NULL,
    subscription jsonb,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL,
    created_by uuid NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    updated_by uuid NOT NULL,
    data jsonb NOT NULL,
    CONSTRAINT schools_pkey PRIMARY KEY (id),
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)