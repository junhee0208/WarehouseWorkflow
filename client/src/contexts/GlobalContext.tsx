import React, { createContext, useState, useContext } from 'react';
import { useOrderService } from '@/services/orderService';
import { Order, Product, OrderItem } from '@shared/schema';

interface GlobalContextType {
  activePickingOrder: Order | null;
  activePackingOrder: Order | null;
  setActivePickingOrder: (order: Order | null) => void;
  setActivePackingOrder: (order: Order | null) => void;
  startPickingProcess: (orderId: string) => void;
  startPackingProcess: (orderId: string) => void;
  currentScanProduct: Product | null;
  setCurrentScanProduct: (product: Product | null) => void;
  scannedItems: {
    time: string;
    productId: string;
    name: string;
    location: string;
  }[];
  addScannedItem: (productId: string, name: string, location: string) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePickingOrder, setActivePickingOrder] = useState<Order | null>(null);
  const [activePackingOrder, setActivePackingOrder] = useState<Order | null>(null);
  const [currentScanProduct, setCurrentScanProduct] = useState<Product | null>(null);
  const [scannedItems, setScannedItems] = useState<{
    time: string;
    productId: string;
    name: string;
    location: string;
  }[]>([]);
  
  const { getOrderById } = useOrderService();

  const startPickingProcess = (orderId: string) => {
    const order = getOrderById(orderId);
    if (order) {
      setActivePickingOrder(order);
    }
  };

  const startPackingProcess = (orderId: string) => {
    const order = getOrderById(orderId);
    if (order) {
      setActivePackingOrder(order);
    }
  };

  const addScannedItem = (productId: string, name: string, location: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
    
    const newScannedItem = {
      time: timeString,
      productId,
      name,
      location,
    };
    
    setScannedItems((prevItems) => [newScannedItem, ...prevItems.slice(0, 9)]);
  };

  return (
    <GlobalContext.Provider
      value={{
        activePickingOrder,
        activePackingOrder,
        setActivePickingOrder,
        setActivePackingOrder,
        startPickingProcess,
        startPackingProcess,
        currentScanProduct,
        setCurrentScanProduct,
        scannedItems,
        addScannedItem
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
