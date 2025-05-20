import { useState } from 'react';
import { orders as initialOrders, products } from '@/data/mockData';
import { Order, Product } from '@shared/schema';

export function useOrderService() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  const getAllOrders = (): Order[] => {
    return orders;
  };
  
  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.orderId === orderId);
  };
  
  const getPendingOrders = (): Order[] => {
    return orders.filter(order => 
      order.status === 'pending' || order.status === 'processing'
    );
  };
  
  const getPickedOrders = (): Order[] => {
    return orders.filter(order => order.status === 'picked');
  };
  
  const getProductById = (productId: string): Product | undefined => {
    return products.find(product => product.productId === productId);
  };
  
  const markItemAsPicked = (orderId: string, productId: string, quantity: number): boolean => {
    const updatedOrders = orders.map(order => {
      if (order.orderId === orderId) {
        const updatedItems = order.items.map(item => {
          if (item.productId === productId) {
            return { ...item, status: 'picked' };
          }
          return item;
        });
        
        // Check if all items are now picked
        const allItemsPicked = updatedItems.every(item => item.status === 'picked');
        
        return {
          ...order,
          items: updatedItems,
          status: allItemsPicked ? 'picked' : 'processing'
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    return true;
  };
  
  const markItemAsVerified = (orderId: string, productId: string): boolean => {
    const updatedOrders = orders.map(order => {
      if (order.orderId === orderId) {
        const updatedItems = order.items.map(item => {
          if (item.productId === productId) {
            return { ...item, status: 'verified' };
          }
          return item;
        });
        
        // Check if all items are now verified
        const allItemsVerified = updatedItems.every(item => item.status === 'verified');
        
        return {
          ...order,
          items: updatedItems,
          status: allItemsVerified ? 'packed' : order.status
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    return true;
  };
  
  const completeOrderPicking = (orderId: string): boolean => {
    const updatedOrders = orders.map(order => {
      if (order.orderId === orderId) {
        return {
          ...order,
          status: 'picked',
          items: order.items.map(item => ({ ...item, status: 'picked' }))
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    return true;
  };
  
  const completeOrderPacking = (orderId: string): boolean => {
    const updatedOrders = orders.map(order => {
      if (order.orderId === orderId) {
        return {
          ...order,
          status: 'packed',
          items: order.items.map(item => ({ ...item, status: 'verified' }))
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    return true;
  };
  
  const createOrder = (order: Omit<Order, 'id'>): Order => {
    // In a real app, this would make an API call to create the order
    const newOrder = {
      ...order,
      id: Math.max(...orders.map(o => o.id)) + 1
    };
    
    setOrders([...orders, newOrder]);
    return newOrder;
  };
  
  const updateOrderStatus = (orderId: string, status: string): boolean => {
    const updatedOrders = orders.map(order => {
      if (order.orderId === orderId) {
        return { ...order, status };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    return true;
  };

  return {
    getAllOrders,
    getOrderById,
    getPendingOrders,
    getPickedOrders,
    getProductById,
    markItemAsPicked,
    markItemAsVerified,
    completeOrderPicking,
    completeOrderPacking,
    createOrder,
    updateOrderStatus
  };
}
