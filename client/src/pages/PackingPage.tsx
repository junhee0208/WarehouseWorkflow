import React, { useState } from "react";
import PackingOrdersList from "@/components/packing/PackingOrdersList";
import PackingStats from "@/components/packing/PackingStats";
import PackingProcess from "@/components/packing/PackingProcess";
import { useGlobal } from "@/contexts/GlobalContext";
import { useOrderService } from "@/services/orderService";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const PackingPage: React.FC = () => {
  const { activePackingOrder, setActivePackingOrder } = useGlobal();
  const { completeOrderPacking } = useOrderService();
  const { toast } = useToast();
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  
  const handlePackingComplete = () => {
    if (activePackingOrder) {
      completeOrderPacking(activePackingOrder.orderId);
      setCompletedOrderId(activePackingOrder.orderId);
      setActivePackingOrder(null);
      setShowCompleteDialog(true);
      
      toast({
        title: "Packing completed",
        description: `Order ${activePackingOrder.orderId} has been successfully packed`,
        variant: "success",
      });
    }
  };
  
  const handlePackingCancel = () => {
    if (activePackingOrder) {
      setActivePackingOrder(null);
      
      toast({
        title: "Packing cancelled",
        description: `Packing for order ${activePackingOrder.orderId} has been cancelled`,
      });
    }
  };
  
  const handleCloseCompleteDialog = () => {
    setShowCompleteDialog(false);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Packing</h1>
        <p className="text-muted-foreground">Pack and prepare orders for shipping</p>
      </div>
      
      {!activePackingOrder ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PackingOrdersList />
          <PackingStats />
        </div>
      ) : (
        <PackingProcess
          orderId={activePackingOrder.orderId}
          onComplete={handlePackingComplete}
          onCancel={handlePackingCancel}
        />
      )}
      
      <Dialog open={showCompleteDialog} onOpenChange={handleCloseCompleteDialog}>
        <DialogContent className="max-w-md">
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-success bg-opacity-20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-success" size={32} />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Packing Complete!</h2>
            <p className="text-muted-foreground mb-6">
              Order <span className="font-semibold">{completedOrderId}</span> has been successfully packed and is ready for shipping.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Packing Accuracy:</span>
                <span className="font-medium text-success">100%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Elapsed:</span>
                <span className="font-medium">3m 45s</span>
              </div>
            </div>
            
            <Button 
              variant="default"
              onClick={handleCloseCompleteDialog}
              className="w-full"
            >
              Return to Packing List
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackingPage;
