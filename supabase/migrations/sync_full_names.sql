-- Function to safely extract display name from raw_user_meta_data
CREATE OR REPLACE FUNCTION get_display_name_from_metadata(meta jsonb)
RETURNS text AS $$
BEGIN
    -- Try to get display_name first (standard format)
    IF meta->>'display_name' IS NOT NULL THEN
        RETURN meta->>'display_name';
    -- Fall back to full_name if exists
    ELSIF meta->>'full_name' IS NOT NULL THEN
        RETURN meta->>'full_name';
    -- Fall back to first_name if exists
    ELSIF meta->>'first_name' IS NOT NULL THEN
        RETURN meta->>'first_name';
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Show current values for debugging
SELECT 
    u.id,
    u.raw_user_meta_data,
    p.full_name as current_profile_name,
    get_display_name_from_metadata(u.raw_user_meta_data) as display_name_from_metadata
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE get_display_name_from_metadata(u.raw_user_meta_data) IS NOT NULL;

-- Update profiles with display_name from auth.users metadata
UPDATE profiles p
SET 
    full_name = get_display_name_from_metadata(u.raw_user_meta_data),
    updated_at = NOW()
FROM auth.users u
WHERE p.id = u.id
    AND (p.full_name IS NULL OR p.full_name = '')
    AND (get_display_name_from_metadata(u.raw_user_meta_data) IS NOT NULL);

-- Log how many profiles were updated
DO $$
DECLARE
    updated_count integer;
BEGIN
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE 'Updated % profile(s) with display names from user metadata', updated_count;
END $$;

-- Clean up
DROP FUNCTION IF EXISTS get_display_name_from_metadata;