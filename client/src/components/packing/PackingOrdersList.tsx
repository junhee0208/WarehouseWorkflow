import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGlobal } from "@/contexts/GlobalContext";
import { useOrderService } from "@/services/orderService";

const PackingOrdersList: React.FC = () => {
  const { startPackingProcess } = useGlobal();
  const { getPickedOrders } = useOrderService();
  
  const pickedOrders = getPickedOrders();
  
  const handleStartPacking = (orderId: string) => {
    startPackingProcess(orderId);
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
