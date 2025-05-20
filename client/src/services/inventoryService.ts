import { useState } from 'react';
import { products, inventoryAlerts, activityFeed } from '@/data/mockData';
import { Product } from '@shared/schema';

export function useInventoryService() {
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  
  const getAllProducts = (): Product[] => {
    return allProducts;
  };
  
  const getProductById = (productId: string): Product | undefined => {
    return allProducts.find(product => product.productId === productId);
  };
  
  const updateProductStock = (productId: string, newQuantity: number): boolean => {
    const updatedProducts = allProducts.map(product => {
      if (product.productId === productId) {
        return { ...product, stockQuantity: newQuantity };
      }
      return product;
    });
    
    setAllProducts(updatedProducts);
    return true;
  };
  
  const getLowStockAlerts = () => {
    return inventoryAlerts;
  };
  
  const getActivityFeed = () => {
    return activityFeed;
  };
  
  const addProduct = (product: Omit<Product, 'id'>): Product => {
    // In a real app, this would make an API call to add the product
    const newProduct = {
      ...product,
      id: Math.max(...allProducts.map(p => p.id)) + 1
    };
    
    setAllProducts([...allProducts, newProduct]);
    return newProduct;
  };
  
  const updateProduct = (productId: string, updates: Partial<Product>): boolean => {
    const updatedProducts = allProducts.map(product => {
      if (product.productId === productId) {
        return { ...product, ...updates };
      }
      return product;
    });
    
    setAllProducts(updatedProducts);
    return true;
  };
  
  const deleteProduct = (productId: string): boolean => {
    const filteredProducts = allProducts.filter(product => product.productId !== productId);
    
    if (filteredProducts.length === allProducts.length) {
      return false; // Product not found
    }
    
    setAllProducts(filteredProducts);
    return true;
  };

  return {
    getAllProducts,
    getProductById,
    updateProductStock,
    getLowStockAlerts,
    getActivityFeed,
    addProduct,
    updateProduct,
    deleteProduct
  };
}
