import React from "react";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import PendingOrdersTable from "@/components/dashboard/PendingOrdersTable";
import InventoryAlerts from "@/components/dashboard/InventoryAlerts";
import WarehouseOverview from "@/components/dashboard/WarehouseOverview";

const Dashboard: React.FC = () => {
  // Use demo data 
  const user = { name: "Demo User" };
  
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}. Here's your daily summary.</p>
      </div>
      
      <DashboardMetrics />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <PendingOrdersTable />
        <InventoryAlerts />
      </div>
      
      <WarehouseOverview />
    </div>
  );
};

export default Dashboard;
