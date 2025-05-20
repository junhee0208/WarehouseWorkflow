import React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrderService } from "@/services/orderService";

const PickingOrdersList: React.FC = () => {
  const [, setLocation] = useLocation();
  const { getPendingOrders } = useOrderService();
  
  const pendingOrders = getPendingOrders();
  
  const handleStartPicking = (orderId: string) => {
    // Store the order ID in localStorage for the picking page to use
    localStorage.setItem('activeOrderId', orderId);
    setLocation("/picking");
  };

  return (
    <Card className="col-span-full mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Your Assigned Orders</CardTitle>
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
                <TableHead>Progress</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingOrders.map((order) => {
                // Calculate progress percentage
                const progress = order.status === "processing" ? 33 : 0;
                
                return (
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
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div 
                            className="bg-primary" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="link" 
                        className="text-primary hover:text-primary-dark"
                        onClick={() => handleStartPicking(order.orderId)}
                      >
                        {order.status === "processing" ? "Continue Picking" : "Start Picking"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PickingOrdersList;
