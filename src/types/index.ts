
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
  inStock: boolean;
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
  product: Product;
  quantity: number;
  selectedSize?: ClothingSize;
  selectedColor?: string;
}

export interface ShoppingCart {
  items: CartItem[];
  total: number;
}
