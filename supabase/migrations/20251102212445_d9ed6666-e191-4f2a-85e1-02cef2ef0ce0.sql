-- Ensure pgcrypto is available in the extensions schema
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Replace encrypt_text to call the fully-qualified pgcrypto function
CREATE OR REPLACE FUNCTION public.encrypt_text(data TEXT, key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN encode(extensions.pgp_sym_encrypt(data, key), 'base64');
END;
$$;

-- Replace decrypt_text to call the fully-qualified pgcrypto function
CREATE OR REPLACE FUNCTION public.decrypt_text(encrypted_data TEXT, key TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN extensions.pgp_sym_decrypt(decode(encrypted_data, 'base64'), key);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;