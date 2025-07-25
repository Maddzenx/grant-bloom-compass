
-- Insert admin user into auth.users table
-- Note: This is a direct insert into Supabase Auth, which should be done carefully
-- The password will be hashed automatically by Supabase

-- First, let's create a profile for the admin user in the profiles table
INSERT INTO public.profiles (id, email, full_name)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@graigent.com',
  'Admin User'
);

-- Note: For the actual auth user creation, you'll need to:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user"
-- 3. Enter email: admin@graigent.com
-- 4. Enter password: admin123 (or your preferred password)
-- 5. Set the user ID to: 00000000-0000-0000-0000-000000000001
-- This ensures the profile we created above will be linked to the auth user

-- Update grant_call_details table schema to match new structure
-- Rename existing funding fields
ALTER TABLE grant_call_details 
RENAME COLUMN max_grant_per_project TO max_funding_per_project;

ALTER TABLE grant_call_details 
RENAME COLUMN min_grant_per_project TO min_funding_per_project;

ALTER TABLE grant_call_details 
RENAME COLUMN total_funding_amount TO total_funding_per_call;

-- Change data types for funding fields to bigint
ALTER TABLE grant_call_details 
ALTER COLUMN max_funding_per_project TYPE bigint USING max_funding_per_project::bigint;

ALTER TABLE grant_call_details 
ALTER COLUMN min_funding_per_project TYPE bigint USING min_funding_per_project::bigint;

ALTER TABLE grant_call_details 
ALTER COLUMN total_funding_per_call TYPE bigint USING total_funding_per_call::bigint;

-- Rename cofinancing_level to cofinancing_level_min and change type
ALTER TABLE grant_call_details 
RENAME COLUMN cofinancing_level TO cofinancing_level_min;

ALTER TABLE grant_call_details 
ALTER COLUMN cofinancing_level_min TYPE numeric(5, 2) USING cofinancing_level_min::numeric(5, 2);

-- Add new fields
ALTER TABLE grant_call_details 
ADD COLUMN cofinancing_level_max numeric;

ALTER TABLE grant_call_details 
ADD COLUMN program text;

ALTER TABLE grant_call_details 
ADD COLUMN grant_type text;

-- Update the match_grant_call_details function to use new field names
CREATE OR REPLACE FUNCTION public.match_grant_call_details(query_embedding extensions.vector, match_threshold double precision, match_count integer)
 RETURNS SETOF grant_call_details
 LANGUAGE sql
AS $function$
  select *,
    (embedding <#> query_embedding) as distance
  from grant_call_details
  where embedding IS NOT NULL
  order by embedding <#> query_embedding desc
  limit least(match_count, 200);
$function$;
