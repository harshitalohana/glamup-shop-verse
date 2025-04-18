
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Product, ClothingSize } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Heart, ArrowLeft, Star, Loader2 } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { currentUser } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          navigate('/products');
          return;
        }

        const productData = data as Product;
        setProduct(productData);
        setMainImage(productData.images[0] || "/placeholder.svg");
        
        // Set default selections
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
        
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details. Please try again.",
          variant: "destructive"
        });
        navigate('/products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const addToCart = async () => {
    if (!product) return;
    
    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!product.in_stock) {
      toast({
        title: "Product unavailable",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    // Size validation for clothing
    if ((product.category === "clothing" || product.category === "mens-clothing") && 
        product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "You need to select a size for this product.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);

    try {
      // Check if item already exists in cart with same size and color
      const { data: existingCartItems, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('product_id', product.id)
        .eq('selected_size', selectedSize || null)
        .eq('selected_color', selectedColor || null);

      if (fetchError) throw fetchError;

      if (existingCartItems && existingCartItems.length > 0) {
        // Update quantity if already in cart
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingCartItems[0].quantity + quantity })
          .eq('id', existingCartItems[0].id);

        if (updateError) throw updateError;
      } else {
        // Add new item to cart
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: currentUser.id,
            product_id: product.id,
            quantity: quantity,
            selected_size: selectedSize || null,
            selected_color: selectedColor || null
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Added to cart",
        description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart`,
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="glamup-container py-8 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-glamup-purple" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="glamup-container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Button onClick={() => navigate('/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="glamup-container py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/products')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
              <img
                src={mainImage}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-square overflow-hidden rounded-md border cursor-pointer ${
                      mainImage === image ? "border-glamup-purple" : "border-gray-200"
                    }`}
                    onClick={() => setMainImage(image)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            
            <div className="mt-2 flex items-center">
              {product.rating && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {product.rating.toFixed(1)} rating
                  </span>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {!product.in_stock && (
                <span className="ml-3 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
                  Out of Stock
                </span>
              )}
              {product.featured && (
                <span className="ml-3 inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                  Featured
                </span>
              )}
            </div>
            
            <div className="mt-6">
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <Separator className="my-6" />
            
            {/* Size Options */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <Label htmlFor="size-select" className="block text-sm font-medium mb-2">
                  Size
                </Label>
                <Select
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  disabled={!product.in_stock}
                >
                  <SelectTrigger id="size-select" className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Color Options */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <Label className="block text-sm font-medium mb-2">
                  Color
                </Label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      className={`relative w-10 h-10 rounded-full cursor-pointer border-2 ${
                        selectedColor === color 
                          ? "border-glamup-purple" 
                          : "border-transparent"
                      }`}
                      onClick={() => product.in_stock && setSelectedColor(color)}
                    >
                      <div 
                        className="absolute inset-1 rounded-full"
                        style={{ backgroundColor: color.toLowerCase() }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity */}
            <div className="mb-6">
              <Label className="block text-sm font-medium mb-2">
                Quantity
              </Label>
              <div className="flex items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1 || !product.in_stock}
                >
                  -
                </Button>
                <span className="mx-4 w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={increaseQuantity}
                  disabled={!product.in_stock}
                >
                  +
                </Button>
              </div>
            </div>
            
            {/* Add to Cart */}
            <div className="flex space-x-4 mt-6">
              <Button
                className="flex-1 bg-glamup-purple hover:bg-glamup-purple/90"
                size="lg"
                onClick={addToCart}
                disabled={isAddingToCart || !product.in_stock}
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="flex-none"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Additional Product Info */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Category:</span>{" "}
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' ')}
                </div>
                <div>
                  <span className="font-medium">Availability:</span>{" "}
                  {product.in_stock ? 'In stock' : 'Out of stock'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
