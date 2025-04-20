
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="glamup-container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-montserrat font-bold text-2xl text-glamup-purple">
            GlamUp
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/products" className="text-gray-700 hover:text-glamup-purple transition-colors">
            All Products
          </Link>
          <Link to="/products?category=clothing" className="text-gray-700 hover:text-glamup-purple transition-colors">
            Clothing
          </Link>
          <Link to="/products?category=accessories" className="text-gray-700 hover:text-glamup-purple transition-colors">
            Accessories
          </Link>
          <Link to="/products?category=makeup" className="text-gray-700 hover:text-glamup-purple transition-colors">
            Makeup
          </Link>
          <Link to="/products?category=mens-clothing" className="text-gray-700 hover:text-glamup-purple transition-colors">
            Men's
          </Link>
        </nav>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/search")}>
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={() => navigate("/cart")}>
            <ShoppingCart className="h-5 w-5" />
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate(
                currentUser?.role === "admin" ? "/admin-dashboard" : "/dashboard"
              )}>
                <Avatar>
                  <AvatarImage src={currentUser?.profileImage || ""} />
                  <AvatarFallback className="bg-glamup-purple text-white">
                    {currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : "GU"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">
                  {currentUser?.role === "admin" ? "Admin" : "My Account"}
                </span>
              </div>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
              <Button onClick={() => navigate("/register")}>Register</Button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4 shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link to="/products" className="text-gray-700 py-2" onClick={() => setIsMenuOpen(false)}>
              All Products
            </Link>
            <Link to="/products?category=clothing" className="text-gray-700 py-2" onClick={() => setIsMenuOpen(false)}>
              Clothing
            </Link>
            <Link to="/products?category=accessories" className="text-gray-700 py-2" onClick={() => setIsMenuOpen(false)}>
              Accessories
            </Link>
            <Link to="/products?category=makeup" className="text-gray-700 py-2" onClick={() => setIsMenuOpen(false)}>
              Makeup
            </Link>
            <Link to="/products?category=mens-clothing" className="text-gray-700 py-2" onClick={() => setIsMenuOpen(false)}>
              Men's
            </Link>

            <div className="border-t pt-4 flex justify-between items-center">
              <Button size="icon" variant="ghost" onClick={() => navigateTo("/search")}>
                <Search className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => navigateTo("/cart")}>
                <ShoppingCart className="h-5 w-5" />
              </Button>
              
              {isAuthenticated ? (
                <>
                  <Button variant="outline" onClick={() => navigateTo(
                    currentUser?.role === "admin" ? "/admin-dashboard" : "/dashboard"
                  )}>
                    {currentUser?.role === "admin" ? "Admin Panel" : "My Account"}
                  </Button>
                  <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigateTo("/login")}>Login</Button>
                  <Button onClick={() => navigateTo("/register")}>Register</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
