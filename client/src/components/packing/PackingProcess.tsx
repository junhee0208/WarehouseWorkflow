import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  X, 
  CheckCircle,
  QrCode,
  Check,
  Printer
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useOrderService } from "@/services/orderService";
// Removed GlobalContext dependency
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Html5Qrcode } from "html5-qrcode";

interface PackingProcessProps {
  orderId: string;
  onComplete: () => void;
  onCancel: () => void;
}

const PackingProcess: React.FC<PackingProcessProps> = ({ 
  orderId, 
  onComplete, 
  onCancel 
}) => {
  const { toast } = useToast();
  const { getOrderById, getProductById, markItemAsVerified } = useOrderService();
  // No need for global context
  
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [packingScannerActive, setPackingScannerActive] = useState(false);
  const [selectedItemForVerification, setSelectedItemForVerification] = useState("");
  const scannerRef = React.useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "packing-scanner-container";
  
  const order = getOrderById(orderId);
  
  // Calculate progress
  useEffect(() => {
    if (order) {
      const totalItems = order.items.length;
      const verified = order.items.filter(item => item.status === "verified").length;
      const newProgress = totalItems > 0 ? (verified / totalItems) * 100 : 0;
      setProgress(newProgress);
    }
  }, [order]);
  
  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (scannerRef.current && packingScannerActive) {
        scannerRef.current.stop().catch(err => {
          console.error("Error stopping scanner:", err);
        });
      }
    };
  }, [packingScannerActive]);
  
  if (!order) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold">Order not found</h2>
        <Button 
          variant="default"
          className="mt-4"
          onClick={onCancel}
        >
          Back to Packing List
        </Button>
      </div>
    );
  }
  
  // Calculate if we can complete the order
  const canComplete = order.items.every(item => item.status === "verified");
  
  const activatePackingScanner = async () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId);
      }

      const qrCodeSuccessCallback = (decodedText: string) => {
        // Look up product by barcode
        const itemToVerify = order.items.find(item => {
          const product = getProductById(item.productId);
          return product && product.barcode === decodedText;
        });
        
        if (itemToVerify) {
          verifyItem(itemToVerify.productId);
          stopPackingScanner();
        } else {
          toast({
            title: "Product not found",
            description: `No product in this order found with barcode: ${decodedText}`,
            variant: "destructive",
          });
        }
      };

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        qrCodeSuccessCallback
      );

      setPackingScannerActive(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      toast({
        title: "Scanner Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  
  const stopPackingScanner = async () => {
    if (scannerRef.current && packingScannerActive) {
      try {
        await scannerRef.current.stop();
        setPackingScannerActive(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };
  
  const verifyItem = (productId: string) => {
    if (!productId) {
      toast({
        title: "No item selected",
        description: "Please select an item to verify",
        variant: "destructive",
      });
      return;
    }
    
    const item = order.items.find(item => item.productId === productId);
    if (!item) {
      toast({
        title: "Item not found",
        description: "The selected item was not found in this order",
        variant: "destructive",
      });
      return;
    }
    
    if (item.status === "verified") {
      toast({
        title: "Already verified",
        description: "This item has already been verified",
      });
      return;
    }
    
    // Mark item as verified
    markItemAsVerified(orderId, productId);
    
    const product = getProductById(productId);
    
    toast({
      title: "Item verified",
      description: `${item.quantity} x ${product?.name}`,
      variant: "default",
    });
    
    // Update progress
    const totalItems = order.items.length;
    const verifiedItems = order.items.filter(item => item.status === "verified").length + 1;
    const newProgress = (verifiedItems / totalItems) * 100;
    setProgress(newProgress);
    
    // Reset selection
    setSelectedItemForVerification("");
    
    // Check if all items are verified
    if (verifiedItems === totalItems) {
      toast({
        title: "All items verified",
        description: "You can now complete the packing process",
      });
    }
  };
  
  const handleCompletePackingOrder = () => {
    if (!canComplete) {
      toast({
        title: "Cannot complete packing",
        description: "There are still items that need to be verified",
        variant: "destructive",
      });
      return;
    }
    
    // Complete the packing process
    onComplete();
  };
  
  const printPackingSlip = () => {
    toast({
      title: "Printing packing slip",
      description: "The packing slip has been sent to the printer",
    });
  };
  
  const printShippingLabel = () => {
    toast({
      title: "Printing shipping label",
      description: "The shipping label has been sent to the printer",
    });
  };

  // For demo purposes, simulate scanner activation
  const simulateScanner = () => {
    setPackingScannerActive(true);
    
    // Simulate a successful scan after 2 seconds
    setTimeout(() => {
      setPackingScannerActive(false);
      
      // Verify the first unverified item
      const unverifiedItem = order.items.find(item => item.status !== "verified");
      if (unverifiedItem) {
        verifyItem(unverifiedItem.productId);
      }
    }, 2000);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-wrap justify-between items-center">
        <div>
          <CardTitle className="text-xl font-semibold">
            Packing Order: {order.orderId}
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
              {order.items.filter(item => item.status === "verified").length}/{order.items.length} items
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
        {/* Customer Info */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Information</h4>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="font-medium">{order.customer.name}</p>
            <p className="text-sm text-gray-500">{order.customer.address}</p>
            <p className="text-sm text-gray-500">{order.customer.email}</p>
          </div>
        </div>
        
        {/* Pack Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">Packing Progress</h4>
            <span className="text-sm font-medium">
              {order.items.filter(item => item.status === "verified").length} of {order.items.length} items
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        {/* Verification Section */}
        <div className="mb-6">
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
            <h4 className="font-medium text-gray-700 mb-3">Verify Items</h4>
            <p className="text-sm text-gray-600 mb-4">Scan each item to verify it's the correct product before packing</p>
            
            <div id={scannerContainerId} className="camera-container mb-4 relative rounded-lg overflow-hidden bg-black" style={{ height: "200px" }}>
              {!packingScannerActive ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white flex-col">
                  <QrCode size={48} className="mb-4 text-gray-400" />
                  <p className="text-gray-400">Camera preview will appear here</p>
                  <Button
                    variant="default"
                    size="sm"
                    className="mt-4"
                    onClick={simulateScanner}
                  >
                    <QrCode className="mr-2" size={16} />
                    Start Camera
                  </Button>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                  <div className="animate-pulse text-white">Scanning...</div>
                </div>
              )}
              
              {packingScannerActive && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="border-2 border-primary w-32 h-32 rounded-lg mx-auto mt-16"></div>
                  <div className="absolute left-0 right-0 mx-auto h-1 bg-primary opacity-80 scan-line" style={{ width: "128px", top: "100px", marginLeft: "auto", marginRight: "auto" }}></div>
                </div>
              )}
            </div>
            
            <p className="text-sm text-center text-gray-500 mb-3">- or manually verify item -</p>
            
            <div className="flex flex-col sm:flex-row sm:space-x-2">
              <Select
                value={selectedItemForVerification}
                onValueChange={setSelectedItemForVerification}
              >
                <SelectTrigger className="flex-1 mb-2 sm:mb-0">
                  <SelectValue placeholder="Select item to verify..." />
                </SelectTrigger>
                <SelectContent>
                  {order.items.map((item) => {
                    const product = getProductById(item.productId);
                    return (
                      <SelectItem
                        key={item.productId}
                        value={item.productId}
                        disabled={item.status === "verified"}
                      >
                        {product?.name} (Qty: {item.quantity})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <Button
                variant="secondary"
                className="flex-shrink-0"
                onClick={() => verifyItem(selectedItemForVerification)}
                disabled={!selectedItemForVerification}
              >
                <Check className="mr-1" size={16} />
                Verify
              </Button>
            </div>
          </div>
        </div>
        
        {/* Items to Pack List */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Items to Pack</h4>
          <div className="space-y-3">
            {order.items.map((item) => {
              const product = getProductById(item.productId);
              const isVerified = item.status === "verified";
              
              return (
                <div 
                  key={item.productId}
                  className={`flex items-center p-3 border rounded-lg ${
                    isVerified ? "bg-green-50 border-green-200" : ""
                  }`}
                >
                  <div className={`flex-shrink-0 h-10 w-10 rounded-md ${
                    isVerified ? "bg-green-100" : "bg-gray-100"
                  } flex items-center justify-center ${
                    isVerified ? "text-success" : "text-gray-400"
                  }`}
                  >
                    {isVerified ? <CheckCircle /> : <QrCode />}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{product?.name}</p>
                        <p className="text-xs text-gray-500">Product ID: {item.productId} • Qty: {item.quantity}</p>
                      </div>
                      <span className={`text-xs ${
                        isVerified ? "text-success" : "text-gray-500"
                      }`}>
                        {isVerified ? "Verified" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      
      {/* Shipping Information */}
      <CardFooter className="flex-col items-start p-4 border-t border-gray-100">
        <div className="mb-4 w-full">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Packaging Instructions</h4>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              {order.priority === "express" 
                ? "Use red packaging for this express order. Add extra padding for fragile items."
                : "Use standard packaging for this order. Please add bubble wrap for the electronics."}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 w-full">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={printPackingSlip}
          >
            <Printer className="mr-2" size={16} />
            Packing Slip
          </Button>
          <Button 
            variant="outline"
            className="flex items-center"
            onClick={printShippingLabel}
          >
            <Printer className="mr-2" size={16} />
            Shipping Label
          </Button>
          
          <div className="ml-auto">
            <Button 
              variant="default"
              className="bg-primary text-white hover:bg-primary/90"
              disabled={!canComplete}
              onClick={handleCompletePackingOrder}
            >
              <CheckCircle className="mr-2" size={16} />
              Complete Packing
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PackingProcess;
