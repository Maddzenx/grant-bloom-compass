-- Create waitlist_subscribers table
CREATE TABLE IF NOT EXISTS waitlist_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  payment_interest INTEGER,
  payment_amount TEXT,
  comment TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_subscribers_email ON waitlist_subscribers(email);

-- Create index on subscribed_at for sorting
CREATE INDEX IF NOT EXISTS idx_waitlist_subscribers_subscribed_at ON waitlist_subscribers(subscribed_at);

-- Add RLS (Row Level Security) policies
ALTER TABLE waitlist_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow inserts from authenticated and anonymous users
CREATE POLICY "Allow insert for all users" ON waitlist_subscribers
  FOR INSERT WITH CHECK (true);

-- Allow reads only for authenticated users (you can modify this based on your needs)
CREATE POLICY "Allow read for authenticated users" ON waitlist_subscribers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_waitlist_subscribers_updated_at 
  BEFORE UPDATE ON waitlist_subscribers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 