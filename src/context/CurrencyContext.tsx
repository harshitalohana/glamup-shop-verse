
import React, { createContext, useState, useContext, useEffect } from "react";

type Currency = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";

interface CurrencyContextType {
  currentCurrency: Currency;
  exchangeRates: Record<Currency, number>;
  convertPrice: (price: number, targetCurrency?: Currency) => number;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: number, currency?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

// Mock exchange rates (in a real app, these would come from an API)
const mockExchangeRates: Record<Currency, number> = {
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
  const [exchangeRates, setExchangeRates] = useState<Record<Currency, number>>(mockExchangeRates);

  // In a real app, we would fetch exchange rates from an API
  // For now, we'll use the mock data
  useEffect(() => {
    // Simulating API fetch
    // In a real app, replace this with actual API call like:
    // fetch("https://api.exchangerate-api.com/v4/latest/USD")
    //  .then(response => response.json())
    //  .then(data => {
    //    setExchangeRates({
    //      USD: 1,
    //      EUR: data.rates.EUR,
    //      GBP: data.rates.GBP,
    //      JPY: data.rates.JPY,
    //      CAD: data.rates.CAD,
    //      AUD: data.rates.AUD
    //    });
    //  })
    //  .catch(error => console.error("Failed to fetch exchange rates:", error));
  }, []);

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
  };

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
        formatPrice
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
