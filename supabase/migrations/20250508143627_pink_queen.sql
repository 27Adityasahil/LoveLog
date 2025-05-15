/*
  # Add user profile fields
  
  1. Changes
    - Add name and avatar_url columns to users table
    - Update existing policies
*/

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Update the handle_new_user function to include default values
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, avatar_url)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', 'User'), null);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;