
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { NewProduct } from "@/types";
import { PlusCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ProductFormProps {
  onProductAdded: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    description: "",
    price: 0,
    category: "clothing",
    images: ["/placeholder.svg"],
    sizes: ["M"],
    colors: ["Black"],
    in_stock: true,
    featured: false,
  });

  const handleProductChange = (field: string, value: any) => {
    setNewProduct({ ...newProduct, [field]: value });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Make sure newProduct has all required fields
    if (!newProduct.name || !newProduct.description || !newProduct.price || !newProduct.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Insert the single NewProduct object, not an array
      const { data, error } = await supabase
        .from('products')
        .insert(newProduct)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Product Added",
        description: `${data.name} has been added to the catalog.`,
      });
      
      // Reset form
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        category: "clothing",
        images: ["/placeholder.svg"],
        sizes: ["M"],
        colors: ["Black"],
        in_stock: true,
        featured: false,
      });
      
      // Notify parent component
      onProductAdded();
    } catch (error: any) {
      toast({
        title: "Error adding product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Product
        </CardTitle>
        <CardDescription>
          Create a new product in your catalog
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => handleProductChange("name", e.target.value)}
                className="glamup-input"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => handleProductChange("price", parseFloat(e.target.value))}
                className="glamup-input"
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => handleProductChange("description", e.target.value)}
                className="glamup-input h-24 resize-none"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newProduct.category}
                onValueChange={(value) => 
                  handleProductChange("category", value)
                }
              >
                <SelectTrigger className="glamup-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="makeup">Makeup</SelectItem>
                  <SelectItem value="mens-clothing">Men's Clothing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sizes">Available Sizes</Label>
              <Select
                value={newProduct.sizes?.[0] as string}
                onValueChange={(value) => 
                  handleProductChange("sizes", [value])
                }
                disabled={newProduct.category === "makeup" || newProduct.category === "accessories"}
              >
                <SelectTrigger className="glamup-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">Small</SelectItem>
                  <SelectItem value="M">Medium</SelectItem>
                  <SelectItem value="L">Large</SelectItem>
                  <SelectItem value="XL">X-Large</SelectItem>
                  <SelectItem value="XXL">XX-Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 flex items-center">
              <div className="flex flex-1 items-center space-x-2">
                <Switch
                  id="inStock"
                  checked={newProduct.in_stock}
                  onCheckedChange={(checked) => handleProductChange("in_stock", checked)}
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
            </div>
            
            <div className="space-y-2 flex items-center">
              <div className="flex flex-1 items-center space-x-2">
                <Switch
                  id="featured"
                  checked={newProduct.featured}
                  onCheckedChange={(checked) => handleProductChange("featured", checked)}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="glamup-btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Product...
                </>
              ) : (
                'Add Product'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
