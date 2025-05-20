import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrderService } from "@/services/orderService";
import OrderDetailsModal from "./OrderDetailsModal";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useLocation } from "wouter";
import { FilterIcon, Download, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OrdersTable: React.FC = () => {
  const [, setLocation] = useLocation();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { getAllOrders } = useOrderService();
  
  const orders = getAllOrders();

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleStartPicking = (orderId: string) => {
    // Store the order ID in localStorage for the picking page to use
    localStorage.setItem('activeOrderId', orderId);
    setLocation("/picking");
  };

  const handleStartPacking = (orderId: string) => {
    // In a real app, we would start a packing process
    setLocation("/packing");
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
            <Select defaultValue="all">
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="picked">Picked</SelectItem>
                <SelectItem value="packed">Packed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-muted-foreground mb-1">Priority</label>
            <Select defaultValue="all">
              <SelectTrigger id="priority-filter">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="rush">Rush</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="date-filter" className="block text-sm font-medium text-muted-foreground mb-1">Date Range</label>
            <Select defaultValue="month">
              <SelectTrigger id="date-filter">
                <SelectValue placeholder="Select Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="order-search" className="block text-sm font-medium text-muted-foreground mb-1">Search</label>
            <Input 
              type="text" 
              id="order-search" 
              placeholder="Order ID or customer" 
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button className="bg-primary text-white">
            Apply Filters
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold">Orders List</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <RefreshCw className="text-muted-foreground h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="text-muted-foreground h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.orderId} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{order.orderId}</TableCell>
                    <TableCell>
                      <div>{order.customer.name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer.email}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.orderDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>{order.items.length}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={order.priority as "standard" | "express"}>
                        {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.status as "pending" | "processing" | "picked" | "packed"}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2 whitespace-nowrap">
                      <Button 
                        variant="link" 
                        className="text-primary hover:text-primary-dark"
                        onClick={() => handleViewDetails(order.orderId)}
                      >
                        Details
                      </Button>
                      
                      {(order.status === "pending" || order.status === "processing") && (
                        <Button 
                          variant="link" 
                          className="text-primary hover:text-primary-dark"
                          onClick={() => handleStartPicking(order.orderId)}
                        >
                          {order.status === "processing" ? "Continue Picking" : "Start Picking"}
                        </Button>
                      )}
                      
                      {order.status === "picked" && (
                        <Button 
                          variant="link" 
                          className="text-secondary hover:text-secondary-dark"
                          onClick={() => handleStartPacking(order.orderId)}
                        >
                          Start Packing
                        </Button>
                      )}
                      
                      {order.status === "packed" && (
                        <Button 
                          variant="link" 
                          className="text-gray-500 cursor-not-allowed"
                          disabled
                        >
                          Complete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">12</span> results
              </p>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" disabled>
                <span className="sr-only">Previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="default" size="sm" className="px-3">
                1
              </Button>
              <Button variant="outline" size="sm" className="px-3">
                2
              </Button>
              <Button variant="outline" size="sm" className="px-3">
                3
              </Button>
              <Button variant="outline" size="icon">
                <span className="sr-only">Next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {selectedOrderId && (
        <OrderDetailsModal 
          orderId={selectedOrderId} 
          onClose={() => setSelectedOrderId(null)} 
          onStartPicking={handleStartPicking}
        />
      )}
    </>
  );
};

import { ChevronLeft, ChevronRight } from "lucide-react";

export default OrdersTable;
