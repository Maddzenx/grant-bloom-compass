
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
