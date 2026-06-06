-- Run these in Supabase SQL Editor or via MCP

-- profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT CHECK (role IN ('super_admin', 'editor', 'viewer')) NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "admin_read_all" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'super_admin'));
CREATE POLICY "admin_update_all" ON profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles p2 WHERE p2.id = auth.uid() AND p2.role = 'super_admin'));

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'viewer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- population_data
CREATE TABLE population_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_name TEXT NOT NULL,
  total_population INT DEFAULT 0,
  male INT DEFAULT 0,
  female INT DEFAULT 0,
  age_0_14 INT DEFAULT 0,
  age_15_59 INT DEFAULT 0,
  age_60_plus INT DEFAULT 0,
  households INT DEFAULT 0,
  year INT NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);
ALTER TABLE population_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON population_data FOR SELECT USING (true);
CREATE POLICY "editor_insert" ON population_data FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "editor_update" ON population_data FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "admin_delete" ON population_data FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- businesses
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('ร้านค้า','โรงงาน','บริการ','เกษตร','อื่นๆ')) DEFAULT 'อื่นๆ',
  address TEXT,
  area_name TEXT,
  lat FLOAT,
  lng FLOAT,
  employees INT DEFAULT 0,
  status TEXT CHECK (status IN ('active','inactive')) DEFAULT 'active',
  registered_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON businesses FOR SELECT USING (true);
CREATE POLICY "editor_insert" ON businesses FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "editor_update" ON businesses FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "admin_delete" ON businesses FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- infrastructure
CREATE TABLE infrastructure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('ถนน','ไฟฟ้า','ประปา','อินเทอร์เน็ต','อื่นๆ')) DEFAULT 'อื่นๆ',
  area_name TEXT,
  status TEXT CHECK (status IN ('ดี','ปานกลาง','ต้องซ่อม')) DEFAULT 'ดี',
  description TEXT,
  coverage_km FLOAT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE infrastructure ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON infrastructure FOR SELECT USING (true);
CREATE POLICY "editor_insert" ON infrastructure FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "editor_update" ON infrastructure FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "admin_delete" ON infrastructure FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- public_services
CREATE TABLE public_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('โรงพยาบาล','โรงเรียน','วัด','สถานีตำรวจ','อื่นๆ')) DEFAULT 'อื่นๆ',
  address TEXT,
  area_name TEXT,
  lat FLOAT,
  lng FLOAT,
  phone TEXT,
  capacity INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON public_services FOR SELECT USING (true);
CREATE POLICY "editor_insert" ON public_services FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "editor_update" ON public_services FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('editor','super_admin')));
CREATE POLICY "admin_delete" ON public_services FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));
