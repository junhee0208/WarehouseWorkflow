import React, { useState } from "react";
import PickingOrdersList from "@/components/picking/PickingOrdersList";
import PickingStats from "@/components/picking/PickingStats";
import PickingProcess from "@/components/picking/PickingProcess";
import PickingCompleteDialog from "@/components/picking/PickingCompleteDialog";
import { useGlobal } from "@/contexts/GlobalContext";
import { useOrderService } from "@/services/orderService";
import { useToast } from "@/hooks/use-toast";

const PickingPage: React.FC = () => {
  const { activePickingOrder, setActivePickingOrder } = useGlobal();
  const { completeOrderPicking } = useOrderService();
  const { toast } = useToast();
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  
  const handlePickingComplete = () => {
    if (activePickingOrder) {
      completeOrderPicking(activePickingOrder.orderId);
      setCompletedOrderId(activePickingOrder.orderId);
      setActivePickingOrder(null);
      setShowCompleteDialog(true);
      
      toast({
        title: "Picking completed",
        description: `Order ${activePickingOrder.orderId} has been successfully picked`,
        variant: "success",
      });
    }
  };
  
  const handlePickingCancel = () => {
    if (activePickingOrder) {
      setActivePickingOrder(null);
      
      toast({
        title: "Picking cancelled",
        description: `Picking for order ${activePickingOrder.orderId} has been cancelled`,
      });
    }
  };
  
  const handleCloseCompleteDialog = () => {
    setShowCompleteDialog(false);
    setCompletedOrderId(null);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Picking</h1>
        <p className="text-muted-foreground">Manage your assigned pick lists and fulfill orders</p>
      </div>
      
      {!activePickingOrder ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PickingOrdersList />
          <PickingStats />
        </div>
      ) : (
        <PickingProcess
          orderId={activePickingOrder.orderId}
          onComplete={handlePickingComplete}
          onCancel={handlePickingCancel}
        />
      )}
      
      <PickingCompleteDialog
        orderId={completedOrderId}
        open={showCompleteDialog}
        onClose={handleCloseCompleteDialog}
      />
    </div>
  );
};

export default PickingPage;
