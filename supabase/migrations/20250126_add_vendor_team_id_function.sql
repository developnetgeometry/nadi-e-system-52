
-- Create a function to get the next vendor team ID
CREATE OR REPLACE FUNCTION get_next_vendor_team_id()
RETURNS bigint
LANGUAGE plpgsql
AS $$
DECLARE
    next_id bigint;
BEGIN
    -- Get the next ID from the sequence or use max + 1
    SELECT COALESCE(MAX(id), 0) + 1 INTO next_id FROM nd_vendor_team;
    RETURN next_id;
END;
$$;
