import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrderService } from "@/services/orderService";
import { useLocation } from "wouter";
import { Order } from "@shared/schema";

const PackingOrdersList: React.FC = () => {
  const [, setLocation] = useLocation();
  const { getOrderById, getPickedOrders } = useOrderService();
  const [pickedOrders, setPickedOrders] = useState<Order[]>([]);
  
  // Get picked orders from both the service and localStorage
  useEffect(() => {
    // Get service picked orders
    const servicePickedOrders = getPickedOrders();
    
    // Get localStorage picked order IDs
    const storedPickedOrderIds = JSON.parse(localStorage.getItem('pickedOrders') || '[]');
    
    // Combine both sources, ensuring no duplicates
    const allPickedOrderIds = new Set([
      ...servicePickedOrders.map(order => order.orderId),
      ...storedPickedOrderIds
    ]);
    
    // Convert to array of order objects
    const combinedOrders = Array.from(allPickedOrderIds)
      .map(id => getOrderById(id))
      .filter(order => order !== undefined) as Order[];
    
    setPickedOrders(combinedOrders);
  }, [getOrderById, getPickedOrders]);
  
  const handleStartPacking = (orderId: string) => {
    // Store the order ID in localStorage for the packing page to use
    localStorage.setItem('activePackingOrderId', orderId);
    setLocation("/packing");
  };

  return (
    <Card className="col-span-full mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Orders Ready for Packing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pickedOrders.map((order) => (
                <TableRow key={order.orderId} className="hover:bg-gray-50">
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>
                    <Badge variant={order.priority as "standard" | "express"}>
                      {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="picked">
                      Picked
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="link" 
                      className="text-secondary hover:text-secondary-dark"
                      onClick={() => handleStartPacking(order.orderId)}
                    >
                      Start Packing
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {pickedOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No orders are ready for packing
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackingOrdersList;
