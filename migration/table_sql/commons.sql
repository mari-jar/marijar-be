CREATE TABLE IF NOT EXISTS commons (
    id UUID NOT NULL PRIMARY KEY,
    type character varying(255) COLLATE pg_catalog."default" NOT NULL,
    data JSONB NOT NULL
)