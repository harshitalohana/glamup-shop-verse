
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "../types";
import { mockUsers } from "../data/mockData";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, "id" | "role"> & { password: string, role: UserRole }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem("glamUpUser");
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("glamUpUser");
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // In a real app, this would be an API call
    // For now, we'll simulate a delay and check against mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email);
        
        if (user) {
          setCurrentUser(user);
          localStorage.setItem("glamUpUser", JSON.stringify(user));
          toast({
            title: "Login successful",
            description: `Welcome back, ${user.name}!`,
          });
          resolve(true);
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password",
            variant: "destructive",
          });
          resolve(false);
        }
        
        setIsLoading(false);
      }, 1000);
    });
  };

  const register = async (
    userData: Omit<User, "id" | "role"> & { password: string, role: UserRole }
  ): Promise<boolean> => {
    setIsLoading(true);
    
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if email already exists
        const existingUser = mockUsers.find(u => u.email === userData.email);
        
        if (existingUser) {
          toast({
            title: "Registration failed",
            description: "Email already in use",
            variant: "destructive",
          });
          resolve(false);
        } else {
          // Create new user
          const newUser: User = {
            ...userData,
            id: `user${mockUsers.length + 1}`,
          };
          
          // In a real app, we would add this to the database
          // Here we just add to our mock array (but it won't persist on reload)
          mockUsers.push(newUser);
          
          // Log in the new user
          setCurrentUser(newUser);
          localStorage.setItem("glamUpUser", JSON.stringify(newUser));
          
          toast({
            title: "Registration successful",
            description: "Your account has been created.",
          });
          
          resolve(true);
        }
        
        setIsLoading(false);
      }, 1500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("glamUpUser");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
