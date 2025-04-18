
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, ShoppingCart, Product } from '@/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface CartContextType {
  cart: ShoppingCart;
  isLoading: boolean;
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<ShoppingCart>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart when user changes
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchCart();
    } else {
      // Clear cart when logged out
      setCart({ items: [], total: 0 });
    }
  }, [currentUser, isAuthenticated]);

  const fetchCart = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      // Fetch cart items
      const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', currentUser.id);
        
      if (cartError) throw cartError;

      // If there are cart items, fetch their corresponding products
      if (cartItems && cartItems.length > 0) {
        const productIds = cartItems.map(item => item.product_id);
        
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);
          
        if (productsError) throw productsError;

        // Combine cart items with their product details
        const itemsWithProducts = cartItems.map(item => {
          const product = products?.find(p => p.id === item.product_id);
          return {
            ...item,
            product: product || undefined
          };
        });

        // Calculate total
        const total = itemsWithProducts.reduce((sum, item) => {
          if (item.product) {
            return sum + (item.product.price * item.quantity);
          }
          return sum;
        }, 0);

        setCart({
          items: itemsWithProducts as CartItem[],
          total
        });
      } else {
        setCart({ items: [], total: 0 });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Error",
        description: "Failed to load your shopping cart",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product: Product, quantity: number, size?: string, color?: string) => {
    if (!currentUser) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Check if item already exists in cart with same size and color
      const { data: existingItems, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('product_id', product.id)
        .eq('selected_size', size || null)
        .eq('selected_color', color || null);

      if (fetchError) throw fetchError;

      if (existingItems && existingItems.length > 0) {
        // Update quantity if already in cart
        const existingItem = existingItems[0];
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (updateError) throw updateError;
      } else {
        // Add new item to cart
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: currentUser.id,
            product_id: product.id,
            quantity: quantity,
            selected_size: size || null,
            selected_color: color || null
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });

      // Refresh cart
      await fetchCart();
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      // Refresh cart
      await fetchCart();
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      toast({
        title: "Item removed",
        description: "The item has been removed from your cart",
      });

      // Refresh cart
      await fetchCart();
    } catch (error: any) {
      console.error('Error removing item from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setCart({ items: [], total: 0 });
      
      toast({
        title: "Cart cleared",
        description: "Your shopping cart has been cleared",
      });
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear your cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
