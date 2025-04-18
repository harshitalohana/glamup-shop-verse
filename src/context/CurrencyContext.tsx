import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

type Currency = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";

interface CurrencyContextType {
  currentCurrency: Currency;
  exchangeRates: Record<Currency, number>;
  convertPrice: (price: number, targetCurrency?: Currency) => number;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number, currency?: Currency) => string;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

// Fallback exchange rates in case the API fails
const fallbackExchangeRates: Record<Currency, number> = {
  USD: 1,      // Base currency
  EUR: 0.85,   // 1 USD = 0.85 EUR
  GBP: 0.75,   // 1 USD = 0.75 GBP
  JPY: 110.42, // 1 USD = 110.42 JPY
  CAD: 1.25,   // 1 USD = 1.25 CAD
  AUD: 1.35    // 1 USD = 1.35 AUD
};

const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$"
};

export const CurrencyProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>("USD");
  const [exchangeRates, setExchangeRates] = useState<Record<Currency, number>>(fallbackExchangeRates);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch exchange rates from an API
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setIsLoading(true);
      try {
        // Free, public API for currency exchange rates
        const response = await fetch(`https://open.er-api.com/v6/latest/USD`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }
        
        const data = await response.json();
        
        if (data && data.rates) {
          setExchangeRates({
            USD: 1,
            EUR: data.rates.EUR || fallbackExchangeRates.EUR,
            GBP: data.rates.GBP || fallbackExchangeRates.GBP,
            JPY: data.rates.JPY || fallbackExchangeRates.JPY,
            CAD: data.rates.CAD || fallbackExchangeRates.CAD,
            AUD: data.rates.AUD || fallbackExchangeRates.AUD
          });
        }
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        toast({
          title: "Exchange Rate Warning",
          description: "Using fallback exchange rates as we couldn't fetch the latest rates.",
          variant: "destructive"
        });
        // Keep using fallback rates
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRates();
    
    // Refresh exchange rates every hour
    const intervalId = setInterval(fetchExchangeRates, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [toast]);

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
    // Save preference to localStorage
    localStorage.setItem('preferredCurrency', currency);
  };

  // Initialize currency from localStorage if available
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency') as Currency;
    if (savedCurrency && Object.keys(currencySymbols).includes(savedCurrency)) {
      setCurrentCurrency(savedCurrency);
    }
  }, []);

  const convertPrice = (price: number, targetCurrency: Currency = currentCurrency): number => {
    return price * exchangeRates[targetCurrency];
  };

  const formatPrice = (price: number, currency: Currency = currentCurrency): string => {
    const convertedPrice = convertPrice(price, currency);
    const symbol = currencySymbols[currency];
    
    // Format based on currency conventions
    if (currency === "JPY") {
      return `${symbol}${Math.round(convertedPrice)}`;
    }
    
    return `${symbol}${convertedPrice.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        exchangeRates,
        convertPrice,
        setCurrency,
        formatPrice,
        isLoading
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
