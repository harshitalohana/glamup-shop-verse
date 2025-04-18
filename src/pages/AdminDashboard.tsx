
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Package, Users, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProductForm from "@/components/admin/ProductForm";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Redirect if not admin
  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      navigate("/");
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
    }
  }, [currentUser, navigate]);

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
    } catch (error: any) {
      toast({
        title: "Error fetching products",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  const handleEditProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          images: product.images,
          sizes: product.sizes,
          colors: product.colors,
          in_stock: product.in_stock,
          featured: product.featured
        })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Product Updated",
        description: `${product.name} has been updated.`,
      });

      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error updating product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Product Deleted",
        description: "The product has been removed from the catalog.",
      });

      setProducts(products.filter(p => p.id !== id));
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    }
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
                <h3 className="text-2xl font-bold">{products.length}</h3>
              </div>
              <Package className="h-8 w-8 text-glamup-purple opacity-80" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Users</p>
                <h3 className="text-2xl font-bold">0</h3>
              </div>
              <Users className="h-8 w-8 text-glamup-purple opacity-80" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-1">Featured Products</p>
                <h3 className="text-2xl font-bold">{products.filter(p => p.featured).length}</h3>
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
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin h-8 w-8 border-4 border-glamup-purple border-t-transparent rounded-full"></div>
                  </div>
                ) : (
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
                      {products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">No products found</TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.in_stock ? "Yes" : "No"}</TableCell>
                            <TableCell>{product.featured ? "Yes" : "No"}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => navigate(`/product/${product.id}`)}
                                >
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
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
                <div className="text-center py-6">
                  <p>User management features coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add-product" className="space-y-4">
            <ProductForm onProductAdded={fetchProducts} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
