-- Olivia Grove Database Schema for Supabase
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('extra-virgin', 'infused', 'organic', 'gift-sets')),
  size TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT TRUE NOT NULL,
  featured BOOLEAN DEFAULT FALSE NOT NULL,
  rating DECIMAL(2,1) DEFAULT 4.5 NOT NULL,
  reviews INTEGER DEFAULT 0 NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'completed', 'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL
);

-- Create order_items table (optional, for detailed item tracking)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- Create store_settings table (singleton pattern - only one row)
CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  store_name TEXT DEFAULT 'Olivia Grove' NOT NULL,
  store_logo TEXT DEFAULT NULL,
  store_email TEXT DEFAULT 'hello@oliviagrove.com' NOT NULL,
  store_phone TEXT DEFAULT '+1 (555) 123-4567',
  store_address TEXT DEFAULT '123 Olive Grove Lane, Tuscany, Italy 58100',
  about_title TEXT DEFAULT 'Our Story',
  about_text TEXT DEFAULT 'For generations, our family has cultivated the finest olive groves in the heart of Tuscany. We believe in sustainable farming and traditional methods that produce exceptional olive oil.',
  contact_title TEXT DEFAULT 'Get in Touch',
  contact_text TEXT DEFAULT 'Have questions about our products or want to place a bulk order? We would love to hear from you.',
  currency TEXT DEFAULT 'USD' NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 8.0 NOT NULL,
  free_shipping_threshold DECIMAL(10,2) DEFAULT 50.0 NOT NULL,
  theme TEXT DEFAULT 'default' NOT NULL,
  email_notifications BOOLEAN DEFAULT TRUE NOT NULL,
  order_notifications BOOLEAN DEFAULT TRUE NOT NULL,
  marketing_emails BOOLEAN DEFAULT FALSE NOT NULL
);

-- Create favorites table for user product favorites
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Create product_showcase table for dismissable banner
CREATE TABLE IF NOT EXISTS public.product_showcase (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  background_color TEXT DEFAULT '#f5f0e6',
  text_color TEXT DEFAULT '#3d4a2d',
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  link_url TEXT,
  link_text TEXT DEFAULT 'Shop Now'
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_showcase ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Authenticated users can create orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create guest orders"
  ON public.orders FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Order items policies
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Store settings policies (public read, admin write)
CREATE POLICY "Anyone can view store settings"
  ON public.store_settings FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can update store settings"
  ON public.store_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can insert store settings"
  ON public.store_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their favorites"
  ON public.favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Product showcase policies (public read, admin write)
CREATE POLICY "Anyone can view product showcase"
  ON public.product_showcase FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage product showcase"
  ON public.product_showcase FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_store_settings_updated_at
  BEFORE UPDATE ON public.store_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_product_showcase_updated_at
  BEFORE UPDATE ON public.product_showcase
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Insert sample products
INSERT INTO public.products (name, description, price, image, category, size, in_stock, featured, rating, reviews) VALUES
('Premium Extra Virgin Olive Oil', 'Cold-pressed from hand-picked olives, our flagship extra virgin olive oil offers a rich, fruity flavor with hints of fresh herbs and a peppery finish.', 34.99, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80', 'extra-virgin', '500ml', true, true, 4.9, 127),
('Organic First Cold Press', 'Certified organic olive oil made from sustainably grown olives. This first cold press oil retains all natural antioxidants.', 42.99, 'https://images.unsplash.com/photo-1509402308-27fc22f4f2ff?w=800&q=80', 'organic', '500ml', true, true, 4.8, 89),
('Rosemary Infused Olive Oil', 'Extra virgin olive oil infused with fresh Mediterranean rosemary. Ideal for roasting vegetables and grilling meats.', 28.99, 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=800&q=80', 'infused', '250ml', true, true, 4.7, 64),
('Garlic & Herb Infused Oil', 'A savory blend of extra virgin olive oil with roasted garlic and Italian herbs.', 26.99, 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=800&q=80', 'infused', '250ml', true, false, 4.6, 52),
('Lemon Zest Olive Oil', 'Bright and refreshing, this citrus-infused olive oil combines cold-pressed extra virgin oil with natural lemon essence.', 27.99, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80', 'infused', '250ml', true, false, 4.8, 78),
('Reserve Selection EVOO', 'Our most exclusive extra virgin olive oil, sourced from century-old olive trees. Limited production ensures exceptional quality.', 64.99, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80', 'extra-virgin', '500ml', true, false, 5.0, 34),
('Classic Gift Set', 'A beautifully packaged trio featuring our Premium Extra Virgin, Rosemary Infused, and Lemon Zest oils.', 79.99, 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=800&q=80', 'gift-sets', '3 x 200ml', true, true, 4.9, 93),
('Truffle Infused Olive Oil', 'Luxurious extra virgin olive oil infused with black truffle. A few drops elevate risotto, eggs, and pasta.', 38.99, 'https://images.unsplash.com/photo-1509402308-27fc22f4f2ff?w=800&q=80', 'infused', '200ml', true, false, 4.9, 45);

-- Insert initial store settings
INSERT INTO public.store_settings (store_name, store_email, store_phone, store_address, about_title, about_text, contact_title, contact_text, currency, tax_rate, free_shipping_threshold, theme)
VALUES (
  'Olivia Grove',
  'hello@oliviagrove.com',
  '+1 (555) 123-4567',
  '123 Olive Grove Lane, Tuscany, Italy 58100',
  'Our Story',
  'For generations, our family has cultivated the finest olive groves in the heart of Tuscany. We believe in sustainable farming and traditional methods that produce exceptional olive oil.',
  'Get in Touch',
  'Have questions about our products or want to place a bulk order? We would love to hear from you.',
  'USD',
  8.0,
  50.0,
  'default'
);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
