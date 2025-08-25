-- Create the user_devices table for tracking user device fingerprints
-- Run this in your Vercel Postgres database

CREATE TABLE IF NOT EXISTS user_devices (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  visitor_fingerprint TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, visitor_fingerprint)
);

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_devices_user_id ON user_devices(user_id);

-- Create an index on visitor_fingerprint for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_devices_visitor_fingerprint ON user_devices(visitor_fingerprint);

-- Optional: Add a comment to describe the table
COMMENT ON TABLE user_devices IS 'Tracks user devices to prevent free credit abuse';
COMMENT ON COLUMN user_devices.user_id IS 'Stytch user ID';
COMMENT ON COLUMN user_devices.visitor_fingerprint IS 'Device fingerprint from Stytch DFP';
COMMENT ON COLUMN user_devices.created_at IS 'When this device was first seen for this user';
