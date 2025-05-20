import React from "react";
import OrdersTable from "@/components/orders/OrdersTable";

const OrdersManagement: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Orders Management</h1>
        <p className="text-muted-foreground">View and manage warehouse orders</p>
      </div>
      
      <OrdersTable />
    </div>
  );
};

export default OrdersManagement;
