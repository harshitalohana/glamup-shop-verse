
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ClothingSize, ProductCategory, Product } from "@/types";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const Products = () => {
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Parse URL query parameters
  const initialCategory = searchParams.get("category") as ProductCategory | null;
  
  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    category: initialCategory || "all",
    minPrice: 0,
    maxPrice: 1000,
    sizes: [] as ClothingSize[],
    sort: "featured"
  });

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) {
          throw error;
        }

        setProducts(data as Product[] || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to fetch products. Please try again later.",
          variant: "destructive"
        });
        // Fallback to empty array
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    
    if (filters.category !== "all") {
      newSearchParams.set("category", filters.category);
    }
    
    if (filters.search) {
      newSearchParams.set("search", filters.search);
    }
    
    setSearchParams(newSearchParams);
  }, [filters.category, filters.search, setSearchParams]);

  // Apply filters to products
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (filters.category !== "all" && product.category !== filters.category) {
      return false;
    }
    
    // Price filter
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }
    
    // Size filter
    if (
      filters.sizes.length > 0 &&
      product.sizes &&
      !filters.sizes.some((size) => product.sizes?.includes(size as string))
    ) {
      return false;
    }
    
    // Search filter
    if (
      filters.search &&
      !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !product.description.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sort) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return b.featured ? 1 : -1;
    }
  });

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSizeToggle = (size: ClothingSize) => {
    setFilters((prev) => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already updated in real-time, so we don't need to do anything here
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "all",
      minPrice: 0,
      maxPrice: 1000,
      sizes: [],
      sort: "featured"
    });
  };

  return (
    <Layout>
      <div className="glamup-container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {filters.category === "all" ? "All Products" : `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}`}
            </h1>
            <p className="text-gray-500">
              {filteredProducts.length} products found
            </p>
          </div>

          <div className="flex items-center mt-4 md:mt-0">
            <form onSubmit={handleSearch} className="flex w-full md:w-auto">
              <Input
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="max-w-xs mr-2"
              />
              <Button type="submit" variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden ml-2"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden md:block w-64 mr-8 flex-shrink-0">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  <Label
                    className={`block cursor-pointer py-1 px-2 rounded ${
                      filters.category === "all" ? "bg-glamup-purple/10 text-glamup-purple" : ""
                    }`}
                    onClick={() => updateFilter("category", "all")}
                  >
                    All Products
                  </Label>
                  <Label
                    className={`block cursor-pointer py-1 px-2 rounded ${
                      filters.category === "clothing" ? "bg-glamup-purple/10 text-glamup-purple" : ""
                    }`}
                    onClick={() => updateFilter("category", "clothing")}
                  >
                    Clothing
                  </Label>
                  <Label
                    className={`block cursor-pointer py-1 px-2 rounded ${
                      filters.category === "accessories" ? "bg-glamup-purple/10 text-glamup-purple" : ""
                    }`}
                    onClick={() => updateFilter("category", "accessories")}
                  >
                    Accessories
                  </Label>
                  <Label
                    className={`block cursor-pointer py-1 px-2 rounded ${
                      filters.category === "makeup" ? "bg-glamup-purple/10 text-glamup-purple" : ""
                    }`}
                    onClick={() => updateFilter("category", "makeup")}
                  >
                    Makeup
                  </Label>
                  <Label
                    className={`block cursor-pointer py-1 px-2 rounded ${
                      filters.category === "mens-clothing" ? "bg-glamup-purple/10 text-glamup-purple" : ""
                    }`}
                    onClick={() => updateFilter("category", "mens-clothing")}
                  >
                    Men's Clothing
                  </Label>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="px-2">
                  <Slider
                    min={0}
                    max={1000}
                    step={50}
                    value={[filters.minPrice, filters.maxPrice]}
                    onValueChange={([min, max]) => {
                      updateFilter("minPrice", min);
                      updateFilter("maxPrice", max);
                    }}
                    className="mb-6"
                  />
                  <div className="flex items-center justify-between">
                    <span>{formatPrice(filters.minPrice)}</span>
                    <span>{formatPrice(filters.maxPrice)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Sizes</h3>
                <div className="space-y-2">
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <div key={size} className="flex items-center">
                      <Checkbox
                        id={`size-${size}`}
                        checked={filters.sizes.includes(size as ClothingSize)}
                        onCheckedChange={() => handleSizeToggle(size as ClothingSize)}
                      />
                      <Label htmlFor={`size-${size}`} className="ml-2 cursor-pointer">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3">Sort By</h3>
                <Select
                  value={filters.sort}
                  onValueChange={(value) => updateFilter("sort", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                    <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <Button 
                onClick={resetFilters} 
                variant="outline" 
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Mobile Filters */}
          {isMobileFilterOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-white p-6 overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {["all", "clothing", "accessories", "makeup", "mens-clothing"].map((cat) => (
                      <Label
                        key={cat}
                        className={`block cursor-pointer py-1 px-2 rounded ${
                          filters.category === cat ? "bg-glamup-purple/10 text-glamup-purple" : ""
                        }`}
                        onClick={() => updateFilter("category", cat)}
                      >
                        {cat === "all" 
                          ? "All Products" 
                          : cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
                      </Label>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      min={0}
                      max={1000}
                      step={50}
                      value={[filters.minPrice, filters.maxPrice]}
                      onValueChange={([min, max]) => {
                        updateFilter("minPrice", min);
                        updateFilter("maxPrice", max);
                      }}
                      className="mb-6"
                    />
                    <div className="flex items-center justify-between">
                      <span>{formatPrice(filters.minPrice)}</span>
                      <span>{formatPrice(filters.maxPrice)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-3">Sizes</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                      <div key={size} className="flex items-center">
                        <Checkbox
                          id={`mobile-size-${size}`}
                          checked={filters.sizes.includes(size as ClothingSize)}
                          onCheckedChange={() => handleSizeToggle(size as ClothingSize)}
                        />
                        <Label htmlFor={`mobile-size-${size}`} className="ml-2 cursor-pointer">
                          {size}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-3">Sort By</h3>
                  <Select
                    value={filters.sort}
                    onValueChange={(value) => updateFilter("sort", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                      <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Top Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 flex space-x-4">
                  <Button 
                    onClick={resetFilters} 
                    variant="outline" 
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <Button 
                    onClick={() => setIsMobileFilterOpen(false)} 
                    className="flex-1 bg-glamup-purple"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-glamup-purple mb-4" />
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
