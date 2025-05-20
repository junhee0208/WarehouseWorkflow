import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Camera, FlashlightIcon, Scan } from "lucide-react";
import { useScanningService } from "@/services/scanningService";
import { useToast } from "@/hooks/use-toast";
import { Html5Qrcode } from "html5-qrcode";

interface ScannerViewProps {
  onScanSuccess: (productId: string) => void;
  onScannerToggle: (isActive: boolean) => void;
}

const ScannerView: React.FC<ScannerViewProps> = ({ 
  onScanSuccess,
  onScannerToggle
}) => {
  const [scanning, setScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "scanner-container";
  const { toast } = useToast();
  const { lookupProductByBarcode } = useScanningService();

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      if (scannerRef.current && scanning) {
        scannerRef.current.stop().catch(err => {
          console.error("Error stopping scanner:", err);
        });
      }
    };
  }, [scanning]);

  const startScanner = async () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId);
      }

      const qrCodeSuccessCallback = (decodedText: string) => {
        // Look up product by barcode
        const product = lookupProductByBarcode(decodedText);
        if (product) {
          onScanSuccess(product.productId);
          toast({
            title: "Product scanned",
            description: `Found product: ${product.name}`,
            variant: "success",
          });
        } else {
          toast({
            title: "Product not found",
            description: `No product found with barcode: ${decodedText}`,
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

      setScanning(true);
      onScannerToggle(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      toast({
        title: "Scanner Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scanning) {
      try {
        await scannerRef.current.stop();
        setScanning(false);
        onScannerToggle(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const toggleFlash = async () => {
    if (scannerRef.current && scanning) {
      try {
        if (flashOn) {
          await scannerRef.current.disableTorch();
        } else {
          await scannerRef.current.enableTorch();
        }
        setFlashOn(!flashOn);
      } catch (err) {
        console.error("Error toggling flash:", err);
        toast({
          title: "Flash Error",
          description: "Could not toggle flash. Your device may not support this feature.",
          variant: "destructive",
        });
      }
    }
  };

  const flipCamera = async () => {
    if (scannerRef.current && scanning) {
      try {
        await scannerRef.current.stop();
        await startScanner();
      } catch (err) {
        console.error("Error flipping camera:", err);
      }
    }
  };

  // For demo purposes, simulate scan after 3 seconds
  const simulateScan = () => {
    if (!scanning) {
      startScanner();
      
      // Show indicator after 3 seconds
      setTimeout(() => {
        const scanIndicator = document.getElementById("scan-indicator");
        if (scanIndicator) {
          scanIndicator.classList.remove("hidden");
        }
        
        // Simulate scan success
        onScanSuccess("P1001");
        
        toast({
          title: "Product scanned",
          description: "Found product: Wireless Bluetooth Headphones",
        });
      }, 3000);
    } else {
      stopScanner();
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <CardTitle className="text-xl font-semibold mb-2 md:mb-0">Barcode Scanner</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={flipCamera}
            disabled={!scanning}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Flip Camera
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={toggleFlash}
            disabled={!scanning}
            className={flashOn ? "bg-amber-100" : ""}
          >
            <FlashlightIcon className="h-4 w-4 mr-2" />
            Flash {flashOn ? "Off" : "On"}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Camera feed container */}
        <div className="relative rounded-lg overflow-hidden bg-black mb-4" style={{ height: "300px" }}>
          {/* Camera view or placeholder */}
          {!scanning ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white flex-col">
              <Camera size={48} className="mb-4 text-gray-400" />
              <p className="text-gray-400">Camera preview will appear here</p>
            </div>
          ) : (
            <>
              {/* Scanner container */}
              <div id={scannerContainerId} className="w-full h-full"></div>
              
              {/* Overlay with scanning animation */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="border-2 border-primary w-64 h-64 rounded-lg mx-auto mt-16"></div>
                <div className="absolute left-0 right-0 mx-auto h-1 bg-primary opacity-80 scan-line" style={{ width: "256px", top: "72px", marginLeft: "auto", marginRight: "auto" }}></div>
              </div>
              
              {/* Scan indicator - shown on successful scan */}
              <div id="scan-indicator" className="absolute bottom-0 left-0 right-0 bg-success text-white text-center py-2 hidden">
                <span className="flex items-center justify-center">
                  <Scan className="mr-2" />
                  Barcode detected - 8901234567890
                </span>
              </div>
            </>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button 
            variant={scanning ? "outline" : "default"}
            className="flex-1"
            onClick={simulateScan}
          >
            <span className="flex items-center justify-center">
              <Scan className="mr-2" />
              {scanning ? "Stop Scanning" : "Start Scanning"}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScannerView;
