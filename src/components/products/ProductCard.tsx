
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "@/context/CurrencyContext";
import { Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  return (
    <Card className="glamup-card group overflow-hidden animate-fade-in">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
          <Button 
            onClick={() => navigate(`/product/${product.id}`)}
            className="w-full bg-white text-glamup-black hover:bg-white/90 mb-4"
          >
            View Details
          </Button>
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
