
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/products/ProductCard";
import { mockProducts } from "@/data/mockData";
import QRCode from "react-qr-code";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Filter products by user interests
  const suggestedProducts = mockProducts.filter((product) => 
    currentUser?.interests.some(interest => 
      interest === "fashion" && (product.category === "clothing" || product.category === "mens-clothing") ||
      interest === "accessories" && product.category === "accessories" ||
      interest === "beauty" && product.category === "makeup"
    )
  );

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <Layout>
      <div className="glamup-container py-12">
        <h1 className="text-3xl font-bold mb-8">Welcome, {currentUser.name}!</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - User profile */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  {currentUser.profileImage ? (
                    <div className="w-32 h-32 rounded-full overflow-hidden">
                      <img
                        src={currentUser.profileImage}
                        alt={currentUser.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-glamup-purple flex items-center justify-center text-white text-4xl font-bold">
                      {currentUser.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold">{currentUser.name}</h3>
                  <Badge variant="outline">{currentUser.role === "admin" ? "Admin" : "Member"}</Badge>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Email:</span>
                    <span>{currentUser.email}</span>
                  </div>
                  {currentUser.phone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phone:</span>
                      <span>{currentUser.phone}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Gender:</span>
                    <span>{currentUser.gender}</span>
                  </div>
                  {currentUser.city && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Location:</span>
                      <span>{currentUser.city} {currentUser.pincode}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Age:</span>
                    <span>{currentUser.age}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Monthly Budget:</span>
                    <span>${currentUser.budget}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Interests:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate("/profile/edit")}>
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My QR Code</CardTitle>
                <CardDescription>
                  Scan to visit Vogue Fashion
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-6">
                <QRCode 
                  value="https://www.vogue.com/fashion"
                  size={180}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </CardContent>
              <CardFooter className="text-center text-sm text-gray-500">
                Share this QR code to connect with fashion enthusiasts
              </CardFooter>
            </Card>
          </div>

          {/* Right column - Suggested products and activities */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Discover Products</CardTitle>
                <CardDescription>
                  Curated based on your interests and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="suggested">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="suggested">Suggested</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="new">New Arrivals</TabsTrigger>
                  </TabsList>
                  <TabsContent value="suggested" className="mt-0">
                    {suggestedProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {suggestedProducts.slice(0, 4).map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No suggested products based on your interests yet.</p>
                        <p>Try updating your profile with more interests.</p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="trending" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mockProducts
                        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                        .slice(0, 4)
                        .map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="new" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mockProducts
                        .slice(0, 4)
                        .map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate("/products")}
                >
                  Browse All Products
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">Account Created</p>
                      <p className="text-sm text-gray-500">Welcome to GlamUp</p>
                    </div>
                    <Badge variant="outline">New</Badge>
                  </div>
                  <div className="py-6 text-center text-gray-500">
                    Your activity history will appear here as you explore GlamUp
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
