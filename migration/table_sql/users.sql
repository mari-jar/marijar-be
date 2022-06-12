CREATE TABLE IF NOT EXISTS users
(
    id uuid NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    phone_number bigint NOT NULL DEFAULT nextval('users_phone_number_seq'::regclass),
    status character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL,
    created_by uuid,
    updated_at timestamp without time zone NOT NULL,
    updated_by uuid,
    role character varying COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
