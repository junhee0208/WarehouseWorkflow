import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WarehouseOverview: React.FC = () => {
  // In a real app, these stats would be fetched from an API
  const warehouseStats = [
    { label: "Space Utilization", value: "87%" },
    { label: "Total SKUs", value: "1,250" },
    { label: "Inventory Accuracy", value: "98.5%" },
    { label: "Avg. Order Processing", value: "24 min" },
  ];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Warehouse Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 rounded-lg p-4 mb-4 flex justify-center">
          <img 
            src="https://images.unsplash.com/photo-1553413077-190dd305871c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=400&q=80" 
            alt="Warehouse layout overview" 
            className="rounded-lg shadow max-h-64 object-cover"
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {warehouseStats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WarehouseOverview;
