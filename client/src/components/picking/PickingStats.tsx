import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const PickingStats: React.FC = () => {
  // In a real app, this data would be fetched from an API
  const stats = {
    todayProgress: { items: 12, total: 20 },
    itemsPicked: 42,
    ordersCompleted: 5,
    itemsPerHour: 8.4,
    accuracy: "94%",
  };

  // Calculate progress percentage
  const progressPercentage = (stats.todayProgress.items / stats.todayProgress.total) * 100;

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Picking Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-muted-foreground">Today's Progress</p>
              <p className="font-medium">
                {stats.todayProgress.items}/{stats.todayProgress.total} items
              </p>
            </div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div 
                  className="bg-primary" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-primary">{stats.itemsPicked}</p>
              <p className="text-sm text-muted-foreground">Items Picked Today</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-primary">{stats.ordersCompleted}</p>
              <p className="text-sm text-muted-foreground">Orders Completed</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-primary">{stats.itemsPerHour}</p>
              <p className="text-sm text-muted-foreground">Items/Hour</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-success">{stats.accuracy}</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="material-icons text-primary">tips_and_updates</span>
              </div>
              <div className="ml-3">
                <p className="text-sm">Always scan items to verify they're the correct product before adding to your cart.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="material-icons text-primary">tips_and_updates</span>
              </div>
              <div className="ml-3">
                <p className="text-sm">Follow the suggested pick route to minimize travel time in the warehouse.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="material-icons text-primary">tips_and_updates</span>
              </div>
              <div className="ml-3">
                <p className="text-sm">If a product is not in its expected location, report it immediately.</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="material-icons text-primary">tips_and_updates</span>
              </div>
              <div className="ml-3">
                <p className="text-sm">Express orders (red tag) should be prioritized over standard orders.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button variant="outline" className="w-full">
              <HelpCircle className="mr-2" size={16} />
              View Picking Guide
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PickingStats;
