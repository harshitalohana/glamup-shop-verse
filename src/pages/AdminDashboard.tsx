
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { mockProducts, mockUsers } from "@/data/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProductCategory, Product, ClothingSize } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Package, Users, BarChart3 } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "clothing",
    images: ["/placeholder.svg"],
    sizes: ["M"],
    colors: ["Black"],
    inStock: true,
    featured: false,
  });

  if (!currentUser || currentUser.role !== "admin") {
    navigate("/login");
    return null;
  }

  const handleProductChange = (field: string, value: any) => {
    setNewProduct({ ...newProduct, [field]: value });
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send a request to add the product to the database
    const product: Product = {
      id: `product-${Date.now()}`,
      ...newProduct as Omit<Product, 'id'>,
    };
    
    // For demo purposes, just add to our mock array
    mockProducts.push(product);
    
    toast({
      title: "Product Added",
      description: `${product.name} has been added to the catalog.`,
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
      inStock: true,
      featured: false,
    });
  };

  return (
    <Layout>
      <div className="glamup-container py-12">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-500 mb-8">Manage products, users, and site settings</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Products</p>
                <h3 className="text-2xl font-bold">{mockProducts.length}</h3>
              </div>
              <Package className="h-8 w-8 text-glamup-purple opacity-80" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Users</p>
                <h3 className="text-2xl font-bold">{mockUsers.length}</h3>
              </div>
              <Users className="h-8 w-8 text-glamup-purple opacity-80" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Featured Products</p>
                <h3 className="text-2xl font-bold">{mockProducts.filter(p => p.featured).length}</h3>
              </div>
              <BarChart3 className="h-8 w-8 text-glamup-purple opacity-80" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="add-product">Add New Product</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Manage Products</CardTitle>
                <CardDescription>View, edit, or delete products from your catalog</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>In Stock</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.inStock ? "Yes" : "No"}</TableCell>
                        <TableCell>{product.featured ? "Yes" : "No"}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.city}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="destructive" size="sm">Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add-product" className="space-y-4">
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
                          handleProductChange("category", value as ProductCategory)
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
                        value={newProduct.sizes?.[0]}
                        onValueChange={(value) => 
                          handleProductChange("sizes", [value as ClothingSize])
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
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="inStock" className="mr-2">In Stock</Label>
                        <input
                          type="checkbox"
                          id="inStock"
                          checked={newProduct.inStock}
                          onChange={(e) => handleProductChange("inStock", e.target.checked)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="featured" className="mr-2">Featured Product</Label>
                        <input
                          type="checkbox"
                          id="featured"
                          checked={newProduct.featured}
                          onChange={(e) => handleProductChange("featured", e.target.checked)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="glamup-btn-primary">
                      Add Product
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
