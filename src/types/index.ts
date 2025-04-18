
export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  city: string;
  pincode: string;
  interests: string[];
  age: number;
  budget: number;
  profileImage?: string;
  role: UserRole;
}

export type ProductCategory = "clothing" | "accessories" | "makeup" | "mens-clothing";

export type ClothingSize = "S" | "M" | "L" | "XL" | "XXL";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory | string; // Allow regular string to match Supabase data
  images: string[];
  sizes?: ClothingSize[] | string[]; // Allow regular string array to match Supabase data
  colors?: string[];
  in_stock: boolean;  
  featured?: boolean;
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

// This type represents what Supabase requires for insertion
export interface NewProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  in_stock: boolean;
  featured?: boolean;
  rating?: number;
}

export interface CurrencyExchange {
  base: string;
  target: string;
  rate: number;
  lastUpdated: string;
}

export interface CartItem {
  id?: string;
  product_id: string;
  product?: Product;
  quantity: number;
  user_id: string;
  selected_size?: string;
  selected_color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ShoppingCart {
  items: CartItem[];
  total: number;
}

// New type to support Supabase's authentication session
export interface UserSession {
  user: User | null;
  session: any | null;
}
