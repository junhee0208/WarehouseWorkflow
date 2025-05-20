import React, { useState } from "react";
import ScannerView from "@/components/scan/ScannerView";
import ManualEntryForm from "@/components/scan/ManualEntryForm";
import ProductDetails from "@/components/scan/ProductDetails";
import ScannedItemsHistory from "@/components/scan/ScannedItemsHistory";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useScanningService } from "@/services/scanningService";
import { useGlobal } from "@/contexts/GlobalContext";

const ProductScanner: React.FC = () => {
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  
  const { getProductById } = useScanningService();
  const { scannedItems, addScannedItem } = useGlobal();
  
  const handleProductLookup = (productId: string) => {
    setSelectedProductId(productId);
    setShowManualEntry(false);
    
    // Add to scan history
    const product = getProductById(productId);
    if (product) {
      addScannedItem(
        product.productId,
        product.name,
        product.location
      );
    }
  };

  const handleManualEntry = () => {
    setShowManualEntry(true);
  };

  const handleScannerToggle = (isActive: boolean) => {
    setIsScannerActive(isActive);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Product Scanner</h1>
        <p className="text-muted-foreground">Scan product barcodes to view and manage inventory</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!showManualEntry ? (
            <ScannerView 
              onScanSuccess={handleProductLookup}
              onScannerToggle={handleScannerToggle}
            />
          ) : (
            <ManualEntryForm 
              onProductLookup={handleProductLookup}
              onCancel={() => setShowManualEntry(false)}
            />
          )}
          
          {!showManualEntry && !isScannerActive && (
            <div className="mb-6">
              <Button 
                variant="outline"
                onClick={handleManualEntry}
                className="w-full"
              >
                <Edit className="mr-2" size={16} />
                Manual Entry
              </Button>
            </div>
          )}
          
          <ScannedItemsHistory 
            scannedItems={scannedItems}
            onViewDetails={setSelectedProductId}
          />
        </div>
        
        <div>
          <ProductDetails 
            productId={selectedProductId}
            onProductScan={() => {
              setShowManualEntry(false);
            }}
            onClose={() => setSelectedProductId(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductScanner;
