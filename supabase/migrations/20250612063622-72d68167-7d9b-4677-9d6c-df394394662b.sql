
-- Add missing show_phone_number column to stores table
ALTER TABLE stores ADD COLUMN show_phone_number boolean DEFAULT false;
