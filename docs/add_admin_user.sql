-- SQL Script to add admin role to an existing user or create a new admin user in Supabase
-- Run this directly in the Supabase SQL Editor

-- Option 1: Update an existing user to have admin role
-- Replace 'user@example.com' with the email of the user you want to make an admin

-- First, check if the user exists
DO $$
DECLARE
  user_id UUID;
  user_email TEXT := 'user@example.com'; -- Replace with the actual email
BEGIN
  -- Get the user's UUID
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  ELSE
    -- Update the user's role to admin in raw_user_meta_data
    UPDATE auth.users
    SET raw_user_meta_data = 
      CASE 
        WHEN raw_user_meta_data IS NULL THEN 
          jsonb_build_object('role', 'admin')
        ELSE
          raw_user_meta_data || jsonb_build_object('role', 'admin')
      END
    WHERE id = user_id;
    
    RAISE NOTICE 'User % has been updated to admin role', user_email;
  END IF;
END $$;

-- Option 2: Create a new admin user (if you have permissions to insert into auth.users)
-- Note: In most Supabase setups, you would create users through the Supabase Auth API or dashboard
-- This is primarily for development/testing environments with direct database access

/*
-- Uncomment to use this method (requires superuser access)
INSERT INTO auth.users (
  email,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  confirmation_token,
  recovery_token,
  instance_id,
  encrypted_password
)
VALUES (
  'admin@example.com', -- Replace with desired admin email
  NOW(),
  jsonb_build_object('role', 'admin', 'name', 'Admin User'), -- Add initial metadata
  NOW(),
  NOW(),
  'authenticated',
  '',
  '',
  '00000000-0000-0000-0000-000000000000',
  '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ12' -- This is a placeholder, use a proper password hash
)
RETURNING id;
*/

-- Option 3: Check existing admin users
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE raw_user_meta_data->>'role' = 'admin';

-- Option 4: Function to promote a user to admin (can be called from your application)
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
  success BOOLEAN := false;
BEGIN
  -- Get the user's UUID
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN false;
  ELSE
    -- Update the user's role to admin
    UPDATE auth.users
    SET raw_user_meta_data = 
      CASE 
        WHEN raw_user_meta_data IS NULL THEN 
          jsonb_build_object('role', 'admin')
        ELSE
          raw_user_meta_data || jsonb_build_object('role', 'admin')
      END
    WHERE id = user_id;
    
    success := true;
    
    -- Log this admin promotion
    BEGIN
      INSERT INTO admin_activity_log (
        admin_id, 
        action, 
        entity_type, 
        entity_id, 
        details
      )
      VALUES (
        (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin' LIMIT 1), -- Use an existing admin ID or the current user's ID
        'user_promote_admin',
        'user',
        user_id,
        jsonb_build_object('email', user_email)
      );
    EXCEPTION
      WHEN OTHERS THEN
        -- If activity logging fails, still return success for the promotion
        NULL;
    END;
    
    RETURN success;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example usage of the function (uncomment to use)
-- SELECT promote_to_admin('user@example.com');
