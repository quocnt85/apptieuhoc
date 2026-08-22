BEGIN;

CREATE OR REPLACE FUNCTION prevent_wallet_ledger_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'wallet_ledger is append-only'
    USING ERRCODE = '55000';
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trg_wallet_ledger_append_only'
      AND tgrelid = 'wallet_ledger'::regclass
      AND NOT tgisinternal
  ) THEN
    CREATE TRIGGER trg_wallet_ledger_append_only
      BEFORE UPDATE OR DELETE ON wallet_ledger
      FOR EACH ROW EXECUTE FUNCTION prevent_wallet_ledger_mutation();
  END IF;
END;
$$;

COMMIT;
