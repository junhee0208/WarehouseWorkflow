import { 
  users, 
  type User, 
  type InsertUser,
  products,
  type Product,
  type InsertProduct,
  orders,
  type Order,
  type OrderItem
} from "@shared/schema";

// Storage interface with CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProductById(productId: string): Promise<Product | undefined>;
  getProductByBarcode(barcode: string): Promise<Product | undefined>;
  updateProductStock(productId: string, quantity: number): Promise<boolean>;
  
  // Order methods
  getAllOrders(): Promise<Order[]>;
  getOrderById(orderId: string): Promise<Order | undefined>;
  getOrdersByStatus(status: string): Promise<Order[]>;
  markItemAsPicked(orderId: string, productId: string): Promise<boolean>;
  markItemAsVerified(orderId: string, productId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  
  currentUserId: number;
  currentProductId: number;
  currentOrderId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentOrderId = 1;
    
    // Initialize with some mock data
    this.initializeMockData();
  }
  
  private initializeMockData() {
    // Add mock users, products, orders as needed
    // This would be populated with real data in a production implementation
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductById(productId: string): Promise<Product | undefined> {
    return this.products.get(productId);
  }
  
  async getProductByBarcode(barcode: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.barcode === barcode
    );
  }
  
  async updateProductStock(productId: string, quantity: number): Promise<boolean> {
    const product = this.products.get(productId);
    if (!product) return false;
    
    product.stockQuantity = quantity;
    this.products.set(productId, product);
    return true;
  }
  
  // Order methods
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getOrderById(orderId: string): Promise<Order | undefined> {
    return this.orders.get(orderId);
  }
  
  async getOrdersByStatus(status: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.status === status
    );
  }
  
  async markItemAsPicked(orderId: string, productId: string): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) return false;
    
    const itemIndex = order.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return false;
    
    // Mark item as picked
    order.items[itemIndex].status = "picked";
    
    // Check if all items are picked
    const allPicked = order.items.every(item => item.status === "picked");
    if (allPicked) {
      order.status = "picked";
    } else {
      order.status = "processing";
    }
    
    this.orders.set(orderId, order);
    return true;
  }
  
  async markItemAsVerified(orderId: string, productId: string): Promise<boolean> {
    const order = this.orders.get(orderId);
    if (!order) return false;
    
    const itemIndex = order.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return false;
    
    // Mark item as verified
    order.items[itemIndex].status = "verified";
    
    // Check if all items are verified
    const allVerified = order.items.every(item => item.status === "verified");
    if (allVerified) {
      order.status = "packed";
    }
    
    this.orders.set(orderId, order);
    return true;
  }
}

export const storage = new MemStorage();
