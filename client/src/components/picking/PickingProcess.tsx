import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  QrCode, 
  MapPin, 
  AlertTriangle,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useOrderService } from "@/services/orderService";
// Removed GlobalContext dependency
import { Html5QrcodeScanner } from "html5-qrcode";

interface PickingProcessProps {
  orderId: string;
  onComplete: () => void;
  onCancel: () => void;
}

const PickingProcess: React.FC<PickingProcessProps> = ({ 
  orderId, 
  onComplete, 
  onCancel 
}) => {
  const { toast } = useToast();
  const { getOrderById, getProductById, markItemAsPicked } = useOrderService();
  
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [pickedQuantity, setPickedQuantity] = useState(0);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const order = getOrderById(orderId);
  
  // Get the current item to pick
  const currentItem = order?.items[currentItemIndex];
  const product = currentItem ? getProductById(currentItem.productId) : null;
  
  // Calculate progress
  useEffect(() => {
    if (order) {
      const totalItems = order.items.length;
      const completed = order.items.filter(item => item.status === "picked").length;
      const newProgress = totalItems > 0 ? (completed / totalItems) * 100 : 0;
      setProgress(newProgress);
    }
  }, [order]);
  
  if (!order || !currentItem || !product) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold">Order not found</h2>
        <Button 
          variant="default"
          className="mt-4"
          onClick={onCancel}
        >
          Back to Picking List
        </Button>
      </div>
    );
  }

  const isFirstItem = currentItemIndex === 0;
  const isLastItem = currentItemIndex === order.items.length - 1;
  
  // Calculate if we can complete the order
  const canComplete = order.items.every(item => item.status === "picked");
  
  const handlePreviousItem = () => {
    if (!isFirstItem) {
      setCurrentItemIndex(currentItemIndex - 1);
      setPickedQuantity(0);
    }
  };
  
  const handleNextItem = () => {
    if (!isLastItem) {
      setCurrentItemIndex(currentItemIndex + 1);
      setPickedQuantity(0);
    }
  };
  
  const handleScanItem = () => {
    // In a real app, this would activate the scanner
    setIsScannerActive(true);
    
    // For demo: simulate a successful scan after 2 seconds
    setTimeout(() => {
      setIsScannerActive(false);
      toast({
        title: "Scan successful",
        description: `Verified: ${product.name}`,
        variant: "default",
      });
      
      // Set quantity to the required amount by default
      setPickedQuantity(currentItem.quantity);
    }, 2000);
  };
  
  const handleConfirmPick = () => {
    if (pickedQuantity <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Please pick at least one item",
        variant: "destructive",
      });
      return;
    }
    
    if (pickedQuantity > currentItem.quantity) {
      toast({
        title: "Invalid quantity",
        description: `You can't pick more than ${currentItem.quantity} items`,
        variant: "destructive",
      });
      return;
    }
    
    // Mark item as picked
    markItemAsPicked(orderId, currentItem.productId, pickedQuantity);
    
    toast({
      title: "Item picked",
      description: `${pickedQuantity} x ${product.name}`,
      variant: "default",
    });
    
    // Update progress
    const totalItems = order.items.length;
    const completedItems = order.items.filter(item => item.status === "picked").length + 1;
    const newProgress = (completedItems / totalItems) * 100;
    setProgress(newProgress);
    
    // Move to next item if available
    if (!isLastItem) {
      setCurrentItemIndex(currentItemIndex + 1);
      setPickedQuantity(0);
    } else {
      setPickedQuantity(0);
      // Check if all items are picked
      if (completedItems === totalItems) {
        // All items picked, enable the complete button
        toast({
          title: "All items picked",
          description: "You can now complete the picking process",
        });
      }
    }
  };
  
  const handleItemNotFound = () => {
    toast({
      title: "Item not found",
      description: "This issue has been reported to the warehouse manager",
      variant: "destructive",
    });
  };
  
  const handleSkipItem = () => {
    toast({
      title: "Item skipped",
      description: "You can come back to this item later",
    });
    
    if (!isLastItem) {
      setCurrentItemIndex(currentItemIndex + 1);
      setPickedQuantity(0);
    }
  };
  
  const handleCompletePicking = () => {
    if (!canComplete) {
      toast({
        title: "Cannot complete picking",
        description: "There are still items that need to be picked",
        variant: "destructive",
      });
      return;
    }
    
    // Complete the picking process
    onComplete();
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-wrap justify-between items-center">
        <div>
          <CardTitle className="text-xl font-semibold">
            Picking Order: {order.orderId}
          </CardTitle>
          <p className="text-muted-foreground">
            Customer: {order.customer.name} | Priority: 
            <Badge 
              variant={order.priority as "standard" | "express"}
              className="ml-2"
            >
              {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
            </Badge>
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
          <div>
            <span className="text-muted-foreground">Progress:</span>
            <span className="font-medium ml-1">
              {order.items.filter(item => item.status === "picked").length}/{order.items.length} items
            </span>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={onCancel}
          >
            <X className="h-4 w-4 mr-1" />
            Abort
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Progress Bar */}
        <div className="relative pt-1 mb-6">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
            <div 
              className="bg-primary animate-progress" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Current Item to Pick */}
        <div className="mb-6 border border-primary border-l-4 rounded-lg p-4 bg-blue-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Product Info */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-2">{product.name}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product ID</p>
                  <p className="font-medium">{product.productId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Barcode</p>
                  <p className="font-medium">{product.barcode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{product.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity to Pick</p>
                  <p className="font-medium">{currentItem.quantity}</p>
                </div>
              </div>
              
              {/* Location Guide */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Location Guide</p>
                <div className="bg-white p-3 rounded border flex items-center">
                  <div className="flex items-center">
                    <MapPin className="text-primary mr-2" />
                    <div>
                      <p className="font-medium">
                        Zone {product.location.split('-')[0]}, 
                        Aisle {product.location.split('-')[1]}, 
                        Shelf {product.location.split('-')[2]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category === "Electronics" ? "East Wing, Electronics Section" : 
                         product.category === "Wearables" ? "North Wing, Wearables Section" :
                         "West Wing, Home Goods Section"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Picking Instructions */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Instructions</p>
                <div className="bg-white p-3 rounded border">
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="text-primary mr-2 h-4 w-4 mt-0.5" />
                      <span>Verify the product ID and barcode match before picking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-primary mr-2 h-4 w-4 mt-0.5" />
                      <span>Check that the product is in good condition</span>
                    </li>
                    <li className="flex items-start">
                      <AlertTriangle className="text-warning mr-2 h-4 w-4 mt-0.5" />
                      <span>
                        {product.category === "Electronics" ? "Handle with care - fragile electronics" :
                         product.category === "Wearables" ? "Keep away from moisture and heat" :
                         "Stack carefully to avoid damage"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Scan Verification */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg border p-4 h-full flex flex-col">
                <h4 className="font-medium mb-3">Verify Item</h4>
                
                {/* Mini Scanner */}
                <div className="relative rounded-lg overflow-hidden bg-black mb-3" style={{ height: "100px" }}>
                  {isScannerActive ? (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <div className="animate-pulse text-white">Scanning...</div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <QrCode className="text-gray-400" size={32} />
                    </div>
                  )}
                  
                  {/* Scanner overlay */}
                  {isScannerActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="border-2 border-primary w-32 h-32 rounded-lg"></div>
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="default"
                  className="mb-3"
                  onClick={handleScanItem}
                  disabled={isScannerActive}
                >
                  <QrCode className="mr-2" size={16} />
                  Scan Item
                </Button>
                
                <Button 
                  variant="outline"
                  className="mb-3"
                  onClick={() => setPickedQuantity(currentItem.quantity)}
                >
                  Manual Verification
                </Button>
                
                <div className="bg-gray-50 p-3 rounded-lg mt-auto">
                  <p className="text-sm text-muted-foreground mb-1">Quantity Picked</p>
                  <div className="flex items-center">
                    <Button 
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setPickedQuantity(Math.max(0, pickedQuantity - 1))}
                    >
                      <Minus size={16} />
                    </Button>
                    <Input 
                      type="number" 
                      className="mx-2 w-16 text-center"
                      value={pickedQuantity} 
                      min="0"
                      max={currentItem.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          setPickedQuantity(value);
                        }
                      }}
                    />
                    <Button 
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setPickedQuantity(Math.min(currentItem.quantity, pickedQuantity + 1))}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0">
            <Button 
              variant="outline"
              className="sm:w-auto border-yellow-500 text-yellow-700 hover:bg-yellow-50"
              onClick={handleItemNotFound}
            >
              <AlertTriangle className="mr-2" size={16} />
              Item Not Found
            </Button>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                className="sm:w-auto"
                onClick={handleSkipItem}
              >
                Skip for Now
              </Button>
              <Button 
                variant="default"
                className="sm:w-auto"
                onClick={handleConfirmPick}
                disabled={pickedQuantity <= 0}
              >
                <CheckCircle className="mr-2" size={16} />
                Confirm Pick
              </Button>
            </div>
          </div>
        </div>
        
        {/* Picking List */}
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-3">Order Items</h3>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item, index) => {
                  const itemProduct = getProductById(item.productId);
                  const isCurrentItem = index === currentItemIndex;
                  
                  return (
                    <TableRow 
                      key={index}
                      className={isCurrentItem ? "bg-blue-50" : ""}
                    >
                      <TableCell>
                        <div className="flex items-center">
                          {isCurrentItem && <ArrowRight className="text-primary mr-2" size={16} />}
                          <div>
                            <div className="font-medium">{itemProduct?.name}</div>
                            <div className="text-xs text-muted-foreground">{itemProduct?.barcode}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.productId}</TableCell>
                      <TableCell>{itemProduct?.location}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            item.status === "picked" ? "success" : 
                            isCurrentItem ? "info" : "secondary"
                          }
                        >
                          {item.status === "picked" ? "Picked" : 
                           isCurrentItem ? "In Progress" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button 
            variant="success"
            className="bg-success text-white hover:bg-success/90"
            disabled={!canComplete}
            onClick={handleCompletePicking}
          >
            <CheckCircle className="mr-2" size={16} />
            Complete Picking
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="border-t flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={handlePreviousItem}
          disabled={isFirstItem}
        >
          <ArrowLeft className="mr-2" size={16} />
          Previous
        </Button>
        <Button 
          variant="default" 
          onClick={handleNextItem}
          disabled={isLastItem}
        >
          Next
          <ArrowRight className="ml-2" size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

import { Plus, Minus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default PickingProcess;
