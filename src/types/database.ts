export type Role = "super_admin" | "editor" | "viewer";

export type Profile = {
  id: string;
  full_name: string | null;
  role: Role;
  created_at: string;
};

export type PopulationData = {
  id: string;
  area_name: string;
  total_population: number;
  male: number;
  female: number;
  age_0_14: number;
  age_15_59: number;
  age_60_plus: number;
  households: number;
  year: number;
  updated_at: string;
  updated_by: string | null;
};

export type Business = {
  id: string;
  name: string;
  category: "ร้านค้า" | "โรงงาน" | "บริการ" | "เกษตร" | "อื่นๆ";
  address: string | null;
  area_name: string | null;
  lat: number | null;
  lng: number | null;
  employees: number;
  status: "active" | "inactive";
  registered_date: string | null;
  updated_at: string;
};

export type Infrastructure = {
  id: string;
  name: string;
  type: "ถนน" | "ไฟฟ้า" | "ประปา" | "อินเทอร์เน็ต" | "อื่นๆ";
  area_name: string | null;
  status: "ดี" | "ปานกลาง" | "ต้องซ่อม";
  description: string | null;
  coverage_km: number;
  updated_at: string;
};

export type PublicService = {
  id: string;
  name: string;
  type: "โรงพยาบาล" | "โรงเรียน" | "วัด" | "สถานีตำรวจ" | "อื่นๆ";
  address: string | null;
  area_name: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  capacity: number;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at">;
        Update: Partial<Omit<Profile, "id">>;
        Relationships: [];
      };
      population_data: {
        Row: PopulationData;
        Insert: Omit<PopulationData, "id" | "updated_at">;
        Update: Partial<Omit<PopulationData, "id">>;
        Relationships: [];
      };
      businesses: {
        Row: Business;
        Insert: Omit<Business, "id" | "updated_at">;
        Update: Partial<Omit<Business, "id">>;
        Relationships: [];
      };
      infrastructure: {
        Row: Infrastructure;
        Insert: Omit<Infrastructure, "id" | "updated_at">;
        Update: Partial<Omit<Infrastructure, "id">>;
        Relationships: [];
      };
      public_services: {
        Row: PublicService;
        Insert: Omit<PublicService, "id" | "updated_at">;
        Update: Partial<Omit<PublicService, "id">>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
