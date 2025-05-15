/*
  # Add partner relationships and sharing functionality

  1. New Tables
    - partner_connections
      - id (uuid)
      - user_id (uuid, references users)
      - partner_id (uuid, references users)
      - status (text): pending, accepted
      - created_at (timestamp)
    - shared_items
      - id (uuid)
      - sender_id (uuid, references users)
      - receiver_id (uuid, references users)
      - item_type (text): journal, mood, goal, gratitude, gallery
      - item_id (uuid)
      - created_at (timestamp)
    - love_notes
      - id (uuid)
      - sender_id (uuid, references users)
      - receiver_id (uuid, references users)
      - content (text)
      - created_at (timestamp)

  2. Changes
    - Add partner_id to users table
    - Add sharing flags to existing tables

  3. Security
    - Enable RLS on new tables
    - Add policies for partner access
*/

-- Add partner relationship tracking
CREATE TABLE partner_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users NOT NULL,
  partner_id uuid REFERENCES users NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'accepted')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, partner_id)
);

-- Add love notes
CREATE TABLE love_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users NOT NULL,
  receiver_id uuid REFERENCES users NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add shared items tracking
CREATE TABLE shared_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users NOT NULL,
  receiver_id uuid REFERENCES users NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('journal', 'mood', 'goal', 'gratitude', 'gallery')),
  item_id uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add sharing flags to existing tables
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS is_shared boolean DEFAULT false;
ALTER TABLE goals ADD COLUMN IF NOT EXISTS is_shared boolean DEFAULT false;
ALTER TABLE gratitude_entries ADD COLUMN IF NOT EXISTS is_shared boolean DEFAULT false;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS is_shared boolean DEFAULT false;

-- Enable RLS
ALTER TABLE partner_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_items ENABLE ROW LEVEL SECURITY;

-- Partner connection policies
CREATE POLICY "Users can manage their partner connections"
  ON partner_connections
  FOR ALL
  USING (auth.uid() IN (user_id, partner_id));

-- Love notes policies
CREATE POLICY "Users can manage sent and received love notes"
  ON love_notes
  FOR ALL
  USING (auth.uid() IN (sender_id, receiver_id));

-- Shared items policies
CREATE POLICY "Users can manage shared items"
  ON shared_items
  FOR ALL
  USING (auth.uid() IN (sender_id, receiver_id));

-- Update existing table policies to include partner access
CREATE POLICY "Partners can view shared journal entries"
  ON journal_entries
  FOR SELECT
  USING (
    is_shared = true AND
    EXISTS (
      SELECT 1 FROM partner_connections
      WHERE status = 'accepted'
      AND ((user_id = auth.uid() AND partner_id = journal_entries.user_id)
      OR (partner_id = auth.uid() AND user_id = journal_entries.user_id))
    )
  );

CREATE POLICY "Partners can view shared goals"
  ON goals
  FOR SELECT
  USING (
    is_shared = true AND
    EXISTS (
      SELECT 1 FROM partner_connections
      WHERE status = 'accepted'
      AND ((user_id = auth.uid() AND partner_id = goals.user_id)
      OR (partner_id = auth.uid() AND user_id = goals.user_id))
    )
  );

CREATE POLICY "Partners can view shared gratitude entries"
  ON gratitude_entries
  FOR SELECT
  USING (
    is_shared = true AND
    EXISTS (
      SELECT 1 FROM partner_connections
      WHERE status = 'accepted'
      AND ((user_id = auth.uid() AND partner_id = gratitude_entries.user_id)
      OR (partner_id = auth.uid() AND user_id = gratitude_entries.user_id))
    )
  );

CREATE POLICY "Partners can view shared gallery images"
  ON gallery_images
  FOR SELECT
  USING (
    is_shared = true AND
    EXISTS (
      SELECT 1 FROM partner_connections
      WHERE status = 'accepted'
      AND ((user_id = auth.uid() AND partner_id = gallery_images.user_id)
      OR (partner_id = auth.uid() AND user_id = gallery_images.user_id))
    )
  );