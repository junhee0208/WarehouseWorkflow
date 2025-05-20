import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableFooter, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useOrderService } from "@/services/orderService";
import { ShoppingCart, FileText } from "lucide-react";

interface OrderDetailsModalProps {
  orderId: string;
  onClose: () => void;
  onStartPicking: (orderId: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  orderId, 
  onClose,
  onStartPicking 
}) => {
  const { getOrderById } = useOrderService();
  const order = getOrderById(orderId);
  
  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Order Details: {orderId}</DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Order Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-medium">{order.orderId}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{formatDate(order.orderDate)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={order.status as "pending" | "processing"}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Priority:</span>
                  <Badge variant={order.priority as "standard" | "express"}>
                    {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Customer Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{order.customer.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{order.customer.email}</span>
                </div>
                <div className="border-b pb-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                  </div>
                  <div className="text-right mt-1">
                    <p>{order.customer.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          <h3 className="text-lg font-medium mb-3">Order Items</h3>
          <div className="overflow-x-auto">
            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="border-b">Product ID</TableHead>
                  <TableHead className="border-b">Product Name</TableHead>
                  <TableHead className="border-b">Location</TableHead>
                  <TableHead className="border-b">Quantity</TableHead>
                  <TableHead className="border-b">Price</TableHead>
                  <TableHead className="border-b">Total</TableHead>
                  <TableHead className="border-b">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => {
                  // In a real app, this would be a join with product data
                  const product = {
                    name: item.productId === "P1001" ? "Wireless Bluetooth Headphones" : 
                           item.productId === "P1002" ? "Smart Fitness Tracker" :
                           item.productId === "P1003" ? "Portable Power Bank 10000mAh" :
                           item.productId === "P1004" ? "Stainless Steel Water Bottle" :
                           "Wireless Charging Pad",
                    location: item.productId === "P1001" ? "A-12-3" :
                              item.productId === "P1002" ? "B-05-2" :
                              item.productId === "P1003" ? "A-14-1" :
                              item.productId === "P1004" ? "C-22-4" :
                              "A-11-5",
                    status: order.status
                  };
                  return (
                    <TableRow key={index}>
                      <TableCell>{item.productId}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.location}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={product.status as "pending" | "processing"}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5} className="text-right font-medium">Order Total:</TableCell>
                  <TableCell className="font-bold">${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          
          {/* Order Timeline */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3">Order Timeline</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="relative flex items-start mb-6">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0 z-10">
                  <ShoppingCart size={16} />
                </div>
                <div className="ml-4">
                  <div className="font-medium">Order Received</div>
                  <div className="text-sm text-muted-foreground">{formatDate(order.orderDate)}</div>
                  <div className="text-sm mt-1">Order has been received and is awaiting processing.</div>
                </div>
              </div>
              
              <div className="relative flex items-start opacity-50">
                <div className="h-8 w-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 flex-shrink-0 z-10">
                  <FileText size={16} />
                </div>
                <div className="ml-4">
                  <div className="font-medium">Picking</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                  <div className="text-sm mt-1">Order items will be collected from the warehouse.</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button variant="outline">
              Print Details
            </Button>
            <Button className="bg-primary text-white" onClick={() => onStartPicking(order.orderId)}>
              Start Picking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
