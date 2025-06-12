
-- Drop all existing tables and types
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chats CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS wards CASCADE;
DROP TABLE IF EXISTS sub_counties CASCADE;
DROP TABLE IF EXISTS counties CASCADE;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

-- Drop existing storage buckets
DELETE FROM storage.objects WHERE bucket_id IN ('product-images', 'store-images', 'profile-pictures');
DELETE FROM storage.buckets WHERE id IN ('product-images', 'store-images', 'profile-pictures');

-- Drop existing types
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS product_category CASCADE;
DROP TYPE IF EXISTS user_type CASCADE;

-- Drop existing functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Create enum types
CREATE TYPE user_type AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE product_category AS ENUM (
  'crops', 'livestock', 'dairy', 'poultry', 'aquaculture', 
  'horticulture', 'cereals', 'legumes', 'fruits', 'vegetables',
  'farm_equipment', 'seeds', 'fertilizers', 'pesticides'
);
CREATE TYPE notification_type AS ENUM ('message', 'product_inquiry', 'store_update', 'system');

-- Create counties table with all 47 counties in Kenya
CREATE TABLE counties (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE
);

-- Insert all 47 counties
INSERT INTO counties (name, code) VALUES
('Baringo', '30'), ('Bomet', '36'), ('Bungoma', '39'), ('Busia', '40'),
('Elgeyo-Marakwet', '28'), ('Embu', '14'), ('Garissa', '07'), ('Homa Bay', '43'),
('Isiolo', '11'), ('Kajiado', '34'), ('Kakamega', '37'), ('Kericho', '35'),
('Kiambu', '22'), ('Kilifi', '03'), ('Kirinyaga', '20'), ('Kisii', '45'),
('Kisumu', '42'), ('Kitui', '15'), ('Kwale', '02'), ('Laikipia', '31'),
('Lamu', '05'), ('Machakos', '16'), ('Makueni', '17'), ('Mandera', '09'),
('Marsabit', '10'), ('Meru', '12'), ('Migori', '44'), ('Mombasa', '01'),
('Murang''a', '21'), ('Nairobi', '47'), ('Nakuru', '32'), ('Nandi', '29'),
('Narok', '33'), ('Nyamira', '46'), ('Nyandarua', '18'), ('Nyeri', '19'),
('Samburu', '25'), ('Siaya', '41'), ('Taita-Taveta', '06'), ('Tana River', '04'),
('Tharaka-Nithi', '13'), ('Trans Nzoia', '26'), ('Turkana', '23'), ('Uasin Gishu', '27'),
('Vihiga', '38'), ('Wajir', '08'), ('West Pokot', '24');

-- Create sub_counties table with comprehensive data
CREATE TABLE sub_counties (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  county_id INTEGER REFERENCES counties(id),
  UNIQUE(name, county_id)
);

-- Insert sub-counties for major counties
INSERT INTO sub_counties (name, county_id) VALUES
-- Nairobi County sub-counties (county_id = 30)
('Westlands', 30), ('Dagoretti North', 30), ('Dagoretti South', 30), 
('Langata', 30), ('Kibra', 30), ('Roysambu', 30), ('Kasarani', 30),
('Ruaraka', 30), ('Embakasi South', 30), ('Embakasi North', 30),
('Embakasi Central', 30), ('Embakasi East', 30), ('Embakasi West', 30),
('Makadara', 30), ('Kamukunji', 30), ('Starehe', 30), ('Mathare', 30),
-- Kiambu County sub-counties (county_id = 22)
('Gatundu South', 22), ('Gatundu North', 22), ('Juja', 22), ('Thika Town', 22),
('Ruiru', 22), ('Githunguri', 22), ('Kiambu', 22), ('Kiambaa', 22),
('Kabete', 22), ('Kikuyu', 22), ('Limuru', 22), ('Lari', 22),
-- Mombasa County sub-counties (county_id = 28)
('Changamwe', 28), ('Jomba', 28), ('Kisauni', 28), ('Nyali', 28),
('Likoni', 28), ('Mvita', 28),
-- Nakuru County sub-counties (county_id = 32)
('Nakuru Town East', 32), ('Nakuru Town West', 32), ('Gilgil', 32),
('Naivasha', 32), ('Molo', 32), ('Njoro', 32), ('Rongai', 32),
('Bahati', 32), ('Subukia', 32), ('Kuresoi South', 32), ('Kuresoi North', 32);

-- Create wards table with sample data
CREATE TABLE wards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sub_county_id INTEGER REFERENCES sub_counties(id),
  UNIQUE(name, sub_county_id)
);

-- Insert sample wards
INSERT INTO wards (name, sub_county_id) VALUES
-- Westlands sub-county wards (sub_county_id = 1)
('Kitisuru', 1), ('Parklands/Highridge', 1), ('Karura', 1), ('Kangemi', 1), ('Mountain View', 1),
-- Dagoretti North wards (sub_county_id = 2)
('Kilimani', 2), ('Kawangware', 2), ('Gatina', 2), ('Kileleshwa', 2), ('Kabiro', 2),
-- Langata wards (sub_county_id = 4)
('Karen', 4), ('Nairobi West', 4), ('Mugumo-ini', 4), ('South C', 4), ('Nyayo Highrise', 4);

-- Create user profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone_number TEXT UNIQUE,
  user_type user_type DEFAULT 'buyer',
  profile_picture_url TEXT,
  county_id INTEGER REFERENCES counties(id),
  sub_county_id INTEGER REFERENCES sub_counties(id),
  ward_id INTEGER REFERENCES wards(id),
  show_phone_number BOOLEAN DEFAULT false,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stores table
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  store_image_url TEXT,
  county_id INTEGER REFERENCES counties(id),
  sub_county_id INTEGER REFERENCES sub_counties(id),
  ward_id INTEGER REFERENCES wards(id),
  phone_number TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category product_category NOT NULL,
  subcategory TEXT,
  price DECIMAL(10,2),
  unit TEXT,
  quantity_available INTEGER,
  county_id INTEGER REFERENCES counties(id),
  sub_county_id INTEGER REFERENCES sub_counties(id),
  ward_id INTEGER REFERENCES wards(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product images table
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chats table
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(buyer_id, seller_id, product_id)
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('product-images', 'product-images', true),
('store-images', 'store-images', true),
('profile-pictures', 'profile-pictures', true);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view active stores" ON stores FOR SELECT USING (is_active = true);
CREATE POLICY "Store owners can manage their stores" ON stores FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Store owners can manage their products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.owner_id = auth.uid())
);

CREATE POLICY "Anyone can view product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Store owners can manage product images" ON product_images FOR ALL USING (
  EXISTS (
    SELECT 1 FROM products p 
    JOIN stores s ON s.id = p.store_id 
    WHERE p.id = product_images.product_id AND s.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can view their chats" ON chats FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);
CREATE POLICY "Users can create chats" ON chats FOR INSERT WITH CHECK (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);

CREATE POLICY "Chat participants can view messages" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = messages.chat_id 
    AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
  )
);
CREATE POLICY "Chat participants can send messages" ON messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM chats 
    WHERE chats.id = messages.chat_id 
    AND (chats.buyer_id = auth.uid() OR chats.seller_id = auth.uid())
  )
);

CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Storage policies
CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT USING (bucket_id IN ('product-images', 'store-images', 'profile-pictures'));
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own images" ON storage.objects FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own images" ON storage.objects FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, phone_number, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'phone_number',
    COALESCE((NEW.raw_user_meta_data->>'user_type')::user_type, 'buyer'::user_type)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
