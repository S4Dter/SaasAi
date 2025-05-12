-- Simple SQL script to add admin role to an existing user in Supabase
-- Run this directly in the Supabase SQL Editor

-- Replace 'your.email@example.com' with the email of the user you want to make an admin
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN raw_user_meta_data IS NULL THEN 
      jsonb_build_object('role', 'admin')
    ELSE
      raw_user_meta_data || jsonb_build_object('role', 'admin')
  END
WHERE email = 'your.email@example.com';

-- Verify the change was made by checking admin users
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE raw_user_meta_data->>'role' = 'admin';
