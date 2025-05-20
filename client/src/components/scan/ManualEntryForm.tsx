import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScanningService } from "@/services/scanningService";
import { useToast } from "@/hooks/use-toast";

interface ManualEntryFormProps {
  onProductLookup: (productId: string) => void;
  onCancel: () => void;
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ 
  onProductLookup,
  onCancel
}) => {
  const [productId, setProductId] = useState("");
  const [barcode, setBarcode] = useState("");
  const { toast } = useToast();
  const { lookupProductById, lookupProductByBarcode } = useScanningService();

  const handleLookup = () => {
    if (productId) {
      const product = lookupProductById(productId);
      if (product) {
        onProductLookup(product.productId);
        toast({
          title: "Product found",
          description: `Found: ${product.name}`,
        });
      } else {
        toast({
          title: "Product not found",
          description: "No product found with that ID",
          variant: "destructive",
        });
      }
    } else if (barcode) {
      const product = lookupProductByBarcode(barcode);
      if (product) {
        onProductLookup(product.productId);
        toast({
          title: "Product found",
          description: `Found: ${product.name}`,
        });
      } else {
        toast({
          title: "Product not found",
          description: "No product found with that barcode",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Input required",
        description: "Please enter a product ID or barcode",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Manual Product Entry</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="product-id" className="block text-sm font-medium text-muted-foreground mb-1">Product ID</label>
            <Input 
              type="text" 
              id="product-id" 
              placeholder="Enter product ID (e.g. P1001)" 
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="barcode" className="block text-sm font-medium text-muted-foreground mb-1">Barcode</label>
            <Input 
              type="text" 
              id="barcode" 
              placeholder="Enter barcode number" 
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-3">
            <Button 
              variant="default"
              className="flex-1"
              onClick={handleLookup}
            >
              Look Up Product
            </Button>
            <Button 
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualEntryForm;
