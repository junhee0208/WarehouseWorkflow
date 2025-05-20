import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  History, 
  X,
  Plus,
  Minus,
  Package as PackageIcon
} from "lucide-react";
import { useScanningService } from "@/services/scanningService";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailsProps {
  productId: string | null;
  onProductScan: () => void;
  onClose: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  productId, 
  onProductScan, 
  onClose
}) => {
  const { getProductById, updateProductStock } = useScanningService();
  const product = productId ? getProductById(productId) : null;
  const [stockQuantity, setStockQuantity] = useState<number>(product?.stockQuantity || 0);
  const { toast } = useToast();

  const handleStockDecrease = () => {
    if (stockQuantity > 0) {
      setStockQuantity(stockQuantity - 1);
      if (product) {
        updateProductStock(product.productId, stockQuantity - 1);
      }
    }
  };

  const handleStockIncrease = () => {
    setStockQuantity(stockQuantity + 1);
    if (product) {
      updateProductStock(product.productId, stockQuantity + 1);
    }
  };

  if (!product) {
    return (
      <Card>
        <CardContent className="p-6">
          <div id="no-product-selected" className="text-center py-8">
            <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
              <PackageIcon className="text-muted-foreground" size={36} />
            </div>
            <h2 className="text-xl font-medium mb-2">No Product Selected</h2>
            <p className="text-muted-foreground mb-4">Scan a barcode or enter a product ID to view details</p>
            <Button 
              variant="default"
              onClick={onProductScan}
            >
              <Scan className="mr-2" />
              Scan Product
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Product Details</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={20} />
        </Button>
      </CardHeader>
      
      <CardContent>
        {/* Product Image */}
        <div className="mb-6">
          <img 
            src={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80"} 
            alt={product.name} 
            className="w-full h-48 object-contain bg-gray-50 rounded-lg" 
          />
        </div>
        
        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">{product.name}</h3>
            <div className="flex items-center mt-1">
              <span className="text-sm bg-gray-100 px-2 py-1 rounded mr-2">ID: {product.productId}</span>
              <span className="text-sm bg-gray-100 px-2 py-1 rounded">Barcode: {product.barcode}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{product.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{product.location}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Stock Quantity</p>
            <div className="flex items-center mt-1">
              <span className="text-2xl font-bold">{stockQuantity}</span>
              <div className="ml-4 flex items-center space-x-2">
                <Button 
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleStockDecrease}
                >
                  <Minus size={16} />
                </Button>
                <Button 
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleStockIncrease}
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="font-medium">${product.unitPrice.toFixed(2)}</p>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Dimensions</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-muted-foreground">Length</p>
                <p className="font-medium">{product.dimensions.length} {product.dimensions.unit}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-muted-foreground">Width</p>
                <p className="font-medium">{product.dimensions.width} {product.dimensions.unit}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <p className="text-muted-foreground">Height</p>
                <p className="font-medium">{product.dimensions.height} {product.dimensions.unit}</p>
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Weight</p>
            <p className="font-medium">{product.weight.value} {product.weight.unit}</p>
          </div>
          
          <div className="pt-4 border-t flex flex-col space-y-3">
            <Button variant="default" className="w-full">
              <Edit size={16} className="mr-2" />
              Edit Product
            </Button>
            <Button variant="outline" className="w-full">
              <History size={16} className="mr-2" />
              View History
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import { Scan } from "lucide-react";

export default ProductDetails;
