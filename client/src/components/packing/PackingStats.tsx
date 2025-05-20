import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const PackingStats: React.FC = () => {
  // In a real app, this data would be fetched from an API
  const stats = {
    todayProgress: { orders: 8, total: 12 },
    ordersPacked: 8,
    itemsPacked: 27,
    ordersPerHour: 3.2,
    accuracy: "98%",
  };

  // Calculate progress percentage
  const progressPercentage = (stats.todayProgress.orders / stats.todayProgress.total) * 100;

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Packing Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-muted-foreground">Today's Progress</p>
              <p className="font-medium">
                {stats.todayProgress.orders}/{stats.todayProgress.total} orders
              </p>
            </div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div 
                  className="bg-secondary" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-secondary">{stats.ordersPacked}</p>
              <p className="text-sm text-muted-foreground">Orders Packed Today</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-secondary">{stats.itemsPacked}</p>
              <p className="text-sm text-muted-foreground">Items Packed</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-secondary">{stats.ordersPerHour}</p>
              <p className="text-sm text-muted-foreground">Orders/Hour</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-success">{stats.accuracy}</p>
              <p className="text-sm text-muted-foreground">Packing Accuracy</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="material-icons text-secondary">tips_and_updates</span>
              </div>
              <div className="ml-3">
                <p className="text-sm">Always verify each item with a barcode scan before packing.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="material-icons text-secondary">tips_and_updates</span>
              </div>
              <div className="ml-3">
                <p className="text-sm">Use appropriate packaging materials for different product types.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="material-icons text-secondary">tips_and_updates</span>
              </div>
              <div className="ml-3">
                <p className="text-sm">Double-check that all items in the order are included before sealing.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="material-icons text-secondary">tips_and_updates</span>
              </div>
              <div className="ml-3">
                <p className="text-sm">Place the packing slip inside the package before sealing.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button variant="outline" className="w-full">
              <HelpCircle className="mr-2" size={16} />
              View Packing Guide
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackingStats;
