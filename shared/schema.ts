import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // manager, picker, packer
  permissions: text("permissions").array().notNull()
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
  permissions: true
});

// Product Schema
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  productId: text("product_id").notNull().unique(),
  barcode: text("barcode").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  stockQuantity: integer("stock_quantity").notNull().default(0),
  unitPrice: integer("unit_price").notNull(),
  imageUrl: text("image_url"),
  dimensions: jsonb("dimensions").notNull(),
  weight: jsonb("weight").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertProductSchema = createInsertSchema(products).pick({
  productId: true,
  barcode: true,
  name: true,
  category: true,
  location: true,
  stockQuantity: true,
  unitPrice: true,
  imageUrl: true,
  dimensions: true,
  weight: true
});

// Order Schema
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull(),
  productId: text("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  status: text("status").notNull().default("pending") // pending, picked, verified
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerAddress: text("customer_address").notNull(),
  orderDate: timestamp("order_date").defaultNow(),
  status: text("status").notNull().default("pending"), // pending, processing, picked, packed, shipped
  totalAmount: integer("total_amount").notNull(),
  priority: text("priority").notNull().default("standard"), // standard, express
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  orderId: true,
  customerName: true,
  customerEmail: true,
  customerAddress: true,
  status: true,
  totalAmount: true,
  priority: true
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  quantity: true,
  price: true,
  status: true
});

// Types for the client
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect & {
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  weight: {
    value: number;
    unit: string;
  };
};
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type DbOrder = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// Combined order type for the client
export type Order = {
  id: number;
  orderId: string;
  customer: {
    name: string;
    email: string;
    address: string;
  };
  orderDate: string;
  status: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    status: string;
  }[];
  totalAmount: number;
  priority: string;
};
