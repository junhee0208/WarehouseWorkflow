import { Order, Product, User } from '@shared/schema';

// Products data
export const products: Product[] = [
  {
    id: 1,
    productId: "P1001",
    barcode: "8901234567890",
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    location: "A-12-3",
    stockQuantity: 45,
    unitPrice: 49.99,
    imageUrl: "https://example.com/images/headphones.jpg",
    dimensions: {
      length: 8,
      width: 6,
      height: 3,
      unit: "inches"
    },
    weight: {
      value: 0.35,
      unit: "kg"
    }
  },
  {
    id: 2,
    productId: "P1002",
    barcode: "8901234567891",
    name: "Smart Fitness Tracker",
    category: "Wearables",
    location: "B-05-2",
    stockQuantity: 32,
    unitPrice: 79.99,
    imageUrl: "https://example.com/images/fitnesstracker.jpg",
    dimensions: {
      length: 4,
      width: 2,
      height: 1,
      unit: "inches"
    },
    weight: {
      value: 0.05,
      unit: "kg"
    }
  },
  {
    id: 3,
    productId: "P1003",
    barcode: "8901234567892",
    name: "Portable Power Bank 10000mAh",
    category: "Electronics",
    location: "A-14-1",
    stockQuantity: 78,
    unitPrice: 29.99,
    imageUrl: "https://example.com/images/powerbank.jpg",
    dimensions: {
      length: 5,
      width: 3,
      height: 1,
      unit: "inches"
    },
    weight: {
      value: 0.25,
      unit: "kg"
    }
  },
  {
    id: 4,
    productId: "P1004",
    barcode: "8901234567893",
    name: "Stainless Steel Water Bottle",
    category: "Home Goods",
    location: "C-22-4",
    stockQuantity: 120,
    unitPrice: 19.99,
    imageUrl: "https://example.com/images/waterbottle.jpg",
    dimensions: {
      length: 10,
      width: 3,
      height: 3,
      unit: "inches"
    },
    weight: {
      value: 0.3,
      unit: "kg"
    }
  },
  {
    id: 5,
    productId: "P1005",
    barcode: "8901234567894",
    name: "Wireless Charging Pad",
    category: "Electronics",
    location: "A-11-5",
    stockQuantity: 55,
    unitPrice: 24.99,
    imageUrl: "https://example.com/images/chargingpad.jpg",
    dimensions: {
      length: 4,
      width: 4,
      height: 0.5,
      unit: "inches"
    },
    weight: {
      value: 0.15,
      unit: "kg"
    }
  }
];

// Orders data
export const orders: Order[] = [
  {
    id: 1,
    orderId: "ORD10001",
    customer: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      address: "123 Main St, Anytown, CA 94524"
    },
    orderDate: "2025-05-01T10:30:00Z",
    status: "pending",
    items: [
      {
        productId: "P1001",
        quantity: 2,
        price: 49.99,
        status: "pending"
      },
      {
        productId: "P1003",
        quantity: 1,
        price: 29.99,
        status: "pending"
      }
    ],
    totalAmount: 129.97,
    priority: "standard"
  },
  {
    id: 2,
    orderId: "ORD10002",
    customer: {
      name: "John Davis",
      email: "john.davis@example.com",
      address: "456 Oak Ave, Somewhere, NY 10001"
    },
    orderDate: "2025-05-02T09:15:00Z",
    status: "processing",
    items: [
      {
        productId: "P1002",
        quantity: 1,
        price: 79.99,
        status: "picked"
      },
      {
        productId: "P1005",
        quantity: 2,
        price: 24.99,
        status: "pending"
      }
    ],
    totalAmount: 129.97,
    priority: "express"
  },
  {
    id: 3,
    orderId: "ORD10003",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      address: "789 Pine St, Elsewhere, TX 75001"
    },
    orderDate: "2025-05-02T14:45:00Z",
    status: "pending",
    items: [
      {
        productId: "P1004",
        quantity: 3,
        price: 19.99,
        status: "pending"
      },
      {
        productId: "P1001",
        quantity: 1,
        price: 49.99,
        status: "pending"
      },
      {
        productId: "P1005",
        quantity: 1,
        price: 24.99,
        status: "pending"
      }
    ],
    totalAmount: 134.95,
    priority: "standard"
  },
  {
    id: 4,
    orderId: "ORD10004",
    customer: {
      name: "Michael Brown",
      email: "michael.brown@example.com",
      address: "321 Elm St, Anytown, CA 94525"
    },
    orderDate: "2025-05-03T11:20:00Z",
    status: "picked",
    items: [
      {
        productId: "P1002",
        quantity: 1,
        price: 79.99,
        status: "picked"
      },
      {
        productId: "P1003",
        quantity: 1,
        price: 29.99,
        status: "picked"
      }
    ],
    totalAmount: 109.98,
    priority: "standard"
  },
  {
    id: 5,
    orderId: "ORD10005",
    customer: {
      name: "Emily Wilson",
      email: "emily.wilson@example.com",
      address: "987 Maple Ave, Somewhere, NY 10002"
    },
    orderDate: "2025-05-03T16:30:00Z",
    status: "packed",
    items: [
      {
        productId: "P1001",
        quantity: 1,
        price: 49.99,
        status: "verified"
      },
      {
        productId: "P1004",
        quantity: 2,
        price: 19.99,
        status: "verified"
      },
      {
        productId: "P1005",
        quantity: 1,
        price: 24.99,
        status: "verified"
      }
    ],
    totalAmount: 114.96,
    priority: "express"
  }
];

// Users data
export const users: User[] = [
  {
    id: 1,
    username: "warehouse_manager",
    password: "password",
    name: "Alex Rodriguez",
    role: "manager",
    permissions: ["view", "edit", "approve", "admin"]
  },
  {
    id: 2,
    username: "picker1",
    password: "password",
    name: "Chris Wong",
    role: "picker",
    permissions: ["view", "pick"]
  },
  {
    id: 3,
    username: "packer1",
    password: "password",
    name: "Taylor Garcia",
    role: "packer",
    permissions: ["view", "pack"]
  }
];

// Inventory alerts
export const inventoryAlerts = [
  {
    id: 1,
    type: "error",
    title: "Low Stock Alert",
    message: "Smart Fitness Tracker (P1002) has only 5 units left in stock."
  },
  {
    id: 2,
    type: "warning",
    title: "Restock Required",
    message: "Wireless Charging Pad (P1005) falling below threshold (10 units remaining)."
  },
  {
    id: 3,
    type: "info",
    title: "Misplaced Item",
    message: "Portable Power Bank (P1003) found in location B-05-2 instead of A-14-1."
  }
];

// Activity feed
export const activityFeed = [
  {
    id: 1,
    type: "success",
    icon: "check_circle",
    message: "Order ORD10005 has been completed",
    time: "Today at 10:23 AM"
  },
  {
    id: 2,
    type: "primary",
    icon: "shopping_cart",
    message: "Started picking order ORD10002",
    time: "Today at 9:45 AM"
  },
  {
    id: 3,
    type: "secondary",
    icon: "inventory",
    message: "Inventory count updated for P1001",
    time: "Yesterday at 4:12 PM"
  }
];
