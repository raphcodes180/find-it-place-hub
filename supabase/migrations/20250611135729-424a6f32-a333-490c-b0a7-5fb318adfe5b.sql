
-- Create enum for user types
CREATE TYPE user_type AS ENUM ('buyer', 'seller');

-- Create enum for product categories
CREATE TYPE product_category AS ENUM (
  'crops', 'livestock', 'dairy', 'poultry', 'aquaculture', 
  'horticulture', 'cereals', 'legumes', 'fruits', 'vegetables',
  'farm_equipment', 'seeds', 'fertilizers', 'pesticides'
);

-- Create enum for notification types
CREATE TYPE notification_type AS ENUM ('message', 'product_inquiry', 'store_update', 'system');

-- Create counties table for Kenya
CREATE TABLE counties (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE
);

-- Create sub_counties table
CREATE TABLE sub_counties (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  county_id INTEGER REFERENCES counties(id),
  UNIQUE(name, county_id)
);

-- Create wards table
CREATE TABLE wards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sub_county_id INTEGER REFERENCES sub_counties(id),
  UNIQUE(name, sub_county_id)
);

-- Create user profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone_number TEXT,
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
  unit TEXT, -- kg, piece, liter, etc.
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
  related_id UUID, -- can reference chat_id, product_id, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for stores
CREATE POLICY "Anyone can view active stores" ON stores FOR SELECT USING (is_active = true);
CREATE POLICY "Store owners can update their stores" ON stores FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Store owners can insert stores" ON stores FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Store owners can delete their stores" ON stores FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for products
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Store owners can manage their products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.owner_id = auth.uid())
);

-- RLS Policies for product_images
CREATE POLICY "Anyone can view product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Store owners can manage product images" ON product_images FOR ALL USING (
  EXISTS (
    SELECT 1 FROM products p 
    JOIN stores s ON s.id = p.store_id 
    WHERE p.id = product_images.product_id AND s.owner_id = auth.uid()
  )
);

-- RLS Policies for chats
CREATE POLICY "Users can view their chats" ON chats FOR SELECT USING (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);
CREATE POLICY "Users can create chats" ON chats FOR INSERT WITH CHECK (
  auth.uid() = buyer_id OR auth.uid() = seller_id
);

-- RLS Policies for messages
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

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('store-images', 'store-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-pictures', 'profile-pictures', true);

-- Storage policies
CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT USING (bucket_id IN ('product-images', 'store-images', 'profile-pictures'));
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own images" ON storage.objects FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own images" ON storage.objects FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Insert Kenya counties data
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

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update timestamps
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
