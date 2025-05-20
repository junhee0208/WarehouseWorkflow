import { useState } from 'react';
import { products } from '@/data/mockData';
import { Product } from '@shared/schema';

export function useScanningService() {
  const [scannedProducts, setScannedProducts] = useState<Product[]>([]);
  
  const scanProductBarcode = (barcode: string): Product | null => {
    // In a real app, this would make an API call to scan the barcode
    const product = products.find(p => p.barcode === barcode);
    
    if (product) {
      // Add to recently scanned products
      setScannedProducts(prev => [product, ...prev].slice(0, 10));
      return product;
    }
    
    return null;
  };
  
  const lookupProductById = (productId: string): Product | null => {
    const product = products.find(p => p.productId === productId);
    
    if (product) {
      // Add to recently scanned products
      setScannedProducts(prev => [product, ...prev].slice(0, 10));
      return product;
    }
    
    return null;
  };
  
  const lookupProductByBarcode = (barcode: string): Product | null => {
    return scanProductBarcode(barcode);
  };
  
  const getProductById = (productId: string): Product | undefined => {
    return products.find(product => product.productId === productId);
  };
  
  const getRecentlyScannedProducts = (): Product[] => {
    return scannedProducts;
  };
  
  const updateProductStock = (productId: string, newQuantity: number): boolean => {
    // In a real app, this would make an API call to update the stock
    // For demo, we'll just return true
    return true;
  };

  return {
    scanProductBarcode,
    lookupProductById,
    lookupProductByBarcode,
    getProductById,
    getRecentlyScannedProducts,
    updateProductStock
  };
}
