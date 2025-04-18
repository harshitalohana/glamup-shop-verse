
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
  category: ProductCategory;
  images: string[];
  sizes?: ClothingSize[];
  colors?: string[];
  in_stock: boolean;  // Changed from inStock to in_stock to match DB schema
  featured?: boolean;
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CurrencyExchange {
  base: string;
  target: string;
  rate: number;
  lastUpdated: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: ClothingSize;
  selectedColor?: string;
}

export interface ShoppingCart {
  items: CartItem[];
  total: number;
}
