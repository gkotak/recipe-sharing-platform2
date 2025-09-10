-- Add bio column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS bio text;

-- Add comment to the column
COMMENT ON COLUMN profiles.bio IS 'User''s bio or description about themselves';

-- Update RLS policies to include bio
BEGIN;
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

  -- Recreate the policies with bio included
  CREATE POLICY "Users can view all profiles"
    ON profiles
    FOR SELECT
    USING (true);

  CREATE POLICY "Users can update own profile"
    ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
COMMIT;

-- Backfill any existing profiles with NULL bio
UPDATE profiles
SET bio = NULL
WHERE bio IS NOT NULL;
