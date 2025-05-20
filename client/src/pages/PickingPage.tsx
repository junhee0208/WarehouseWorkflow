import React, { useState, useEffect } from "react";
import PickingOrdersList from "@/components/picking/PickingOrdersList";
import PickingStats from "@/components/picking/PickingStats";
import PickingProcess from "@/components/picking/PickingProcess";
import PickingCompleteDialog from "@/components/picking/PickingCompleteDialog";
import { useOrderService } from "@/services/orderService";
import { useToast } from "@/hooks/use-toast";

const PickingPage: React.FC = () => {
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const { completeOrderPicking, getOrderById } = useOrderService();
  const { toast } = useToast();
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  
  // Check if there's an active order ID in localStorage (set by OrdersTable)
  useEffect(() => {
    const storedOrderId = localStorage.getItem('activeOrderId');
    if (storedOrderId) {
      setActiveOrderId(storedOrderId);
    }
  }, []);
  
  const handlePickingComplete = () => {
    if (activeOrderId) {
      completeOrderPicking(activeOrderId);
      setCompletedOrderId(activeOrderId);
      setActiveOrderId(null);
      localStorage.removeItem('activeOrderId');
      setShowCompleteDialog(true);
      
      toast({
        title: "Picking completed",
        description: `Order ${activeOrderId} has been successfully picked`,
        variant: "default",
      });
    }
  };
  
  const handlePickingCancel = () => {
    if (activeOrderId) {
      setActiveOrderId(null);
      localStorage.removeItem('activeOrderId');
      
      toast({
        title: "Picking cancelled",
        description: `Picking for order ${activeOrderId} has been cancelled`,
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
      
      {!activeOrderId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PickingOrdersList />
          <PickingStats />
        </div>
      ) : (
        <PickingProcess
          orderId={activeOrderId}
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
