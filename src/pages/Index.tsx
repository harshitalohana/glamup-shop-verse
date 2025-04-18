
import React from "react";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Clothing",
    image: "/placeholder.svg",
    slug: "clothing",
  },
  {
    name: "Accessories",
    image: "/placeholder.svg",
    slug: "accessories",
  },
  {
    name: "Makeup",
    image: "/placeholder.svg",
    slug: "makeup",
  },
  {
    name: "Men's Clothing",
    image: "/placeholder.svg",
    slug: "mens-clothing",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const featuredProducts = mockProducts.filter((product) => product.featured);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-gray-200 h-[70vh] relative overflow-hidden">
          <img
            src="/placeholder.svg"
            alt="GlamUp Fashion"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
            <h1 className="text-4xl md:text-6xl font-bold text-glamup-black mb-4">
              Discover Your Style
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 max-w-2xl mb-8">
              Explore our latest collection of fashion, accessories, and beauty products
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate("/products")}
                className="glamup-btn-primary text-lg px-8 py-3"
              >
                Shop Now
              </Button>
              <Button
                onClick={() => navigate("/register")}
                variant="outline"
                className="text-lg px-8 py-3 border-glamup-purple text-glamup-purple hover:bg-glamup-purple hover:text-white"
              >
                Join GlamUp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="glamup-container">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop By Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.slug}
                onClick={() => navigate(`/products?category=${category.slug}`)}
                className="relative rounded-lg overflow-hidden h-64 cursor-pointer group"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <h3 className="text-white font-semibold text-xl">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="glamup-container">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              onClick={() => navigate("/products")}
              variant="outline"
              className="glamup-btn-secondary"
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-glamup-purple text-white">
        <div className="glamup-container text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-glamup-purple hover:bg-gray-100 px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
