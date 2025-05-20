import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  const apiRouter = express.Router();

  // User routes
  apiRouter.post('/users', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  });

  apiRouter.get('/users/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  apiRouter.get('/users/username/:username', async (req: Request, res: Response) => {
    try {
      const username = req.params.username;
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Product routes
  apiRouter.get('/products', async (req: Request, res: Response) => {
    try {
      const products = await storage.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  apiRouter.get('/products/:id', async (req: Request, res: Response) => {
    try {
      const productId = req.params.id;
      const product = await storage.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  apiRouter.get('/products/barcode/:barcode', async (req: Request, res: Response) => {
    try {
      const barcode = req.params.barcode;
      const product = await storage.getProductByBarcode(barcode);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Order routes
  apiRouter.get('/orders', async (req: Request, res: Response) => {
    try {
      const orders = await storage.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  apiRouter.get('/orders/:id', async (req: Request, res: Response) => {
    try {
      const orderId = req.params.id;
      const order = await storage.getOrderById(orderId);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  apiRouter.get('/orders/status/:status', async (req: Request, res: Response) => {
    try {
      const status = req.params.status;
      const orders = await storage.getOrdersByStatus(status);
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  apiRouter.post('/orders/:id/items/:itemId/pick', async (req: Request, res: Response) => {
    try {
      const orderId = req.params.id;
      const itemId = req.params.itemId;
      const success = await storage.markItemAsPicked(orderId, itemId);
      
      if (!success) {
        return res.status(404).json({ message: 'Order or item not found' });
      }

      res.status(200).json({ message: 'Item marked as picked' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  apiRouter.post('/orders/:id/items/:itemId/verify', async (req: Request, res: Response) => {
    try {
      const orderId = req.params.id;
      const itemId = req.params.itemId;
      const success = await storage.markItemAsVerified(orderId, itemId);
      
      if (!success) {
        return res.status(404).json({ message: 'Order or item not found' });
      }

      res.status(200).json({ message: 'Item marked as verified' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Register the API router with prefix
  app.use('/api', apiRouter);

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
