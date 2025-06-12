
-- Create storage bucket for product and store images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('store-images', 'store-images', true);

-- Allow public access to view images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('product-images', 'store-images'));

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id IN ('product-images', 'store-images') AND auth.role() = 'authenticated'
);

-- Allow users to update their own images
CREATE POLICY "Users can update their own images" ON storage.objects FOR UPDATE USING (
  bucket_id IN ('product-images', 'store-images') AND auth.role() = 'authenticated'
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images" ON storage.objects FOR DELETE USING (
  bucket_id IN ('product-images', 'store-images') AND auth.role() = 'authenticated'
);
