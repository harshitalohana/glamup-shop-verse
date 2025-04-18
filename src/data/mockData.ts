
import { Product, User } from "../types";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Elegant Summer Dress",
    description: "Beautiful floral pattern dress perfect for summer outings.",
    price: 69.99,
    category: "clothing",
    images: ["/placeholder.svg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Blue", "Pink"],
    in_stock: true,
    featured: true,
    rating: 4.5
  },
  {
    id: "2",
    name: "Classic Denim Jacket",
    description: "Versatile denim jacket that goes with any outfit.",
    price: 89.99,
    category: "clothing",
    images: ["/placeholder.svg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Black"],
    in_stock: true,
    rating: 4.2
  },
  {
    id: "3",
    name: "Premium Leather Handbag",
    description: "Handcrafted leather handbag with gold accents.",
    price: 149.99,
    category: "accessories",
    images: ["/placeholder.svg"],
    colors: ["Brown", "Black", "Tan"],
    in_stock: true,
    featured: true,
    rating: 4.7
  },
  {
    id: "4",
    name: "Luxury Lipstick Set",
    description: "Set of 3 premium long-lasting lipsticks.",
    price: 45.99,
    category: "makeup",
    images: ["/placeholder.svg"],
    colors: ["Red", "Nude", "Berry"],
    in_stock: true,
    rating: 4.8
  },
  {
    id: "5",
    name: "Men's Tailored Blazer",
    description: "Sophisticated blazer for formal and casual occasions.",
    price: 129.99,
    category: "mens-clothing",
    images: ["/placeholder.svg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Charcoal", "Black"],
    in_stock: true,
    featured: true,
    rating: 4.6
  },
  {
    id: "6",
    name: "Statement Earrings",
    description: "Eye-catching earrings with crystal details.",
    price: 34.99,
    category: "accessories",
    images: ["/placeholder.svg"],
    colors: ["Silver", "Gold"],
    in_stock: true,
    rating: 4.3
  },
  {
    id: "7",
    name: "Hydrating Foundation",
    description: "Full coverage foundation with SPF 30.",
    price: 38.99,
    category: "makeup",
    images: ["/placeholder.svg"],
    colors: ["Fair", "Medium", "Tan", "Deep"],
    in_stock: true,
    featured: true,
    rating: 4.5
  },
  {
    id: "8",
    name: "Men's Cotton T-Shirt",
    description: "Premium cotton t-shirt for everyday wear.",
    price: 29.99,
    category: "mens-clothing",
    images: ["/placeholder.svg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Gray", "Navy"],
    in_stock: true,
    rating: 4.4
  }
];

export const mockUsers: User[] = [
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@glamup.com",
    phone: "1234567890",
    gender: "Prefer not to say",
    city: "New York",
    pincode: "10001",
    interests: ["fashion", "accessories"],
    age: 30,
    budget: 1000,
    role: "admin"
  },
  {
    id: "user1",
    name: "Regular User",
    email: "user@example.com",
    phone: "9876543210",
    gender: "Female",
    city: "Los Angeles",
    pincode: "90001",
    interests: ["clothing", "makeup"],
    age: 25,
    budget: 500,
    role: "user"
  }
];

export const categoryImages = {
  clothing: "/placeholder.svg",
  accessories: "/placeholder.svg",
  makeup: "/placeholder.svg",
  "mens-clothing": "/placeholder.svg"
};
