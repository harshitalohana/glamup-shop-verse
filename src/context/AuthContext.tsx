
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole } from "../types";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // We need to fetch the user profile data separately
          // Use setTimeout to prevent recursive lock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setCurrentUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        throw error;
      }

      if (profile) {
        // Transform the profile data to match our User type
        const userData: User = {
          id: profile.id,
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          gender: profile.gender || '',
          city: profile.city || '',
          pincode: profile.pincode || '',
          interests: profile.interests || [],
          age: profile.age || 0,
          budget: profile.budget || 0,
          profileImage: profile.profile_image,
          role: (profile.role as UserRole) || 'user'
        };
        
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      // The user data is fetched by onAuthStateChange
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Failed to login",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    userData: Omit<User, "id" | "role"> & { password: string, role: UserRole }
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // First, register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });
      
      if (authError) {
        throw authError;
      }
      
      if (!authData.user) {
        throw new Error("Failed to create user");
      }
      
      // Then create the user profile in our profiles table
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        gender: userData.gender,
        city: userData.city,
        pincode: userData.pincode,
        interests: userData.interests,
        age: userData.age,
        budget: userData.budget,
        profile_image: userData.profileImage,
        role: userData.role
      });
      
      if (profileError) {
        throw profileError;
      }
      
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
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
