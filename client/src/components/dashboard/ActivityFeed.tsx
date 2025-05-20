import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Archive, ClipboardPlus } from "lucide-react";

const ActivityFeed: React.FC = () => {
  // In a real app, this would be fetched from an API
  const activities = [
    {
      id: 1,
      type: "success",
      icon: <CheckCircle className="text-success" size={16} />,
      message: "Order ORD10005 has been completed",
      time: "Today at 10:23 AM",
    },
    {
      id: 2,
      type: "primary",
      icon: <Package className="text-primary" size={16} />,
      message: "Started picking order ORD10002",
      time: "Today at 9:45 AM",
    },
    {
      id: 3,
      type: "secondary",
      icon: <Archive className="text-secondary" size={16} />,
      message: "Archive count updated for P1001",
      time: "Yesterday at 4:12 PM",
    },
    {
      id: 4,
      type: "info",
      icon: <ClipboardPlus className="text-info" size={16} />,
      message: "New order ORD10006 received",
      time: "Yesterday at 2:30 PM",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                {activity.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
