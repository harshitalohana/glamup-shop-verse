
import React, { useState } from "react";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "@/context/CurrencyContext";
import { Heart, ShoppingCart, Eye, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
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

    setIsAddingToCart(true);
    try {
      await addToCart(product, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Card className="glamup-card group overflow-hidden animate-fade-in">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
          <div className="flex space-x-2 w-full">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
              className="flex-1 bg-white text-glamup-black hover:bg-white/90"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-1" /> View
            </Button>
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-glamup-purple hover:bg-glamup-purple/90"
              size="sm"
              disabled={isAddingToCart || !product.in_stock}
            >
              {isAddingToCart ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Adding...
                </span>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-1" /> Add
                </>
              )}
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full"
        >
          <Heart className="h-5 w-5" />
        </Button>
        {product.featured && (
          <div className="absolute top-2 left-2 bg-glamup-gold text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </div>
        )}
        {!product.in_stock && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>
      <CardContent className="pt-4">
        <h3 className="font-medium line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0 pb-4">
        <span className="font-semibold">{formatPrice(product.price)}</span>
        {product.rating && (
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="text-sm ml-1">{product.rating}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
