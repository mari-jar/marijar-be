CREATE or REPLACE FUNCTION update_timestamp()
returns trigger
AS $body$
BEGIN
  new.updated_at = NOW();
  return new;
END;
$body$ language plpgsql;