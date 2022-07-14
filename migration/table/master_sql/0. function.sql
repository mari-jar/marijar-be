CREATE or REPLACE FUNCTION update_timestamp()
returns trigger
AS $body$
BEGIN
  new.updated_at = NOW();
  return new;
END;
$body$ language plpgsql;

CREATE or REPLACE FUNCTION created_and_updated_by()
returns trigger
AS $body$
BEGIN
  IF new.created_by IS NULL
  THEN
    new.created_by = new.id;
    new.updated_by = new.id;
  END IF;
  return new;
END;
$body$ language plpgsql;

