import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "wouter";
import { useOrderService } from "@/services/orderService";

interface PickingCompleteDialogProps {
  orderId: string | null;
  open: boolean;
  onClose: () => void;
}

const PickingCompleteDialog: React.FC<PickingCompleteDialogProps> = ({
  orderId,
  open,
  onClose
}) => {
  const [, navigate] = useNavigate();
  const { getOrderById } = useOrderService();
  const order = orderId ? getOrderById(orderId) : null;
  
  if (!open || !order) return null;
  
  const handleBackToPickList = () => {
    onClose();
  };
  
  const handleGoToPacking = () => {
    onClose();
    navigate("/packing");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-success bg-opacity-20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-success" size={32} />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Picking Complete!</h2>
          <p className="text-muted-foreground mb-6">
            You've successfully picked all items for order <span className="font-semibold">{order.orderId}</span>.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Total Items Picked:</span>
              <span className="font-medium">{order.items.length} items</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Pick Accuracy:</span>
              <span className="font-medium text-success">100%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Elapsed:</span>
              <span className="font-medium">4m 12s</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleBackToPickList}
            >
              Back to Pick List
            </Button>
            <Button 
              variant="default" 
              className="flex-1"
              onClick={handleGoToPacking}
            >
              Go to Packing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PickingCompleteDialog;
