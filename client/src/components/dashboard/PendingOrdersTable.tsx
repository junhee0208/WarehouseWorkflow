import React from "react";
import { useLocation } from "wouter";
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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useOrderService } from "@/services/orderService";

const PendingOrdersTable: React.FC = () => {
  const [, setLocation] = useLocation();
  const { getPendingOrders } = useOrderService();
  
  const pendingOrders = getPendingOrders();

  const handleStartPicking = (orderId: string) => {
    // For demo purposes, we'll just navigate to the picking page
    // In a real app, we would use context or state management to track the active order
    localStorage.setItem('activeOrderId', orderId);
    setLocation("/picking");
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Your Assigned Pick Lists</CardTitle>
        <Button variant="ghost" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingOrders.map((order) => (
                <TableRow key={order.orderId} className="hover:bg-gray-50">
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell>
                    <Badge variant={order.priority as "standard" | "express"}>
                      {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.status as "pending" | "processing"}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="link" 
                      onClick={() => handleStartPicking(order.orderId)}
                      className="text-primary hover:text-primary-dark"
                    >
                      {order.status === "processing" ? "Continue Picking" : "Start Picking"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingOrdersTable;
