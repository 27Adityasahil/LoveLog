/*
  # Initial schema setup for digital journal

  1. New Tables
    - users
      - id (uuid, matches auth.users)
      - created_at (timestamp)
    - journal_entries
      - id (uuid)
      - user_id (uuid, references users)
      - title (text)
      - content (text)
      - created_at (timestamp)
    - moods
      - id (uuid)
      - user_id (uuid, references users)
      - rating (integer)
      - note (text)
      - created_at (timestamp)
    - goals
      - id (uuid)
      - user_id (uuid, references users)
      - text (text)
      - category (text)
      - completed (boolean)
      - created_at (timestamp)
    - gratitude_entries
      - id (uuid)
      - user_id (uuid, references users)
      - text (text)
      - created_at (timestamp)
    - gallery_images
      - id (uuid)
      - user_id (uuid, references users)
      - title (text)
      - url (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id uuid REFERENCES auth.users PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS moods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 10),
  note text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  text text NOT NULL,
  category text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gratitude_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE gratitude_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can manage own journal entries" ON journal_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own moods" ON moods
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own goals" ON goals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own gratitude entries" ON gratitude_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own gallery images" ON gallery_images
  FOR ALL USING (auth.uid() = user_id);

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create a user record when a new auth user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();