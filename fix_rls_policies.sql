-- Fix RLS policies for waitlist_subscribers table

-- Drop existing policies
DROP POLICY IF EXISTS "Allow insert for all users" ON waitlist_subscribers;
DROP POLICY IF EXISTS "Allow read for authenticated users" ON waitlist_subscribers;

-- Create new policies that allow anonymous users to insert
CREATE POLICY "Allow insert for all users" ON waitlist_subscribers
  FOR INSERT WITH CHECK (true);

-- Allow reads for all users (or you can keep it restricted if needed)
CREATE POLICY "Allow read for all users" ON waitlist_subscribers
  FOR SELECT USING (true);

-- Optional: If you want to restrict reads to authenticated users only, use this instead:
-- CREATE POLICY "Allow read for authenticated users" ON waitlist_subscribers
--   FOR SELECT USING (auth.role() = 'authenticated'); 