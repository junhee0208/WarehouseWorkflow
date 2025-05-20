import React from "react";
import { 
  ClipboardList, 
  ShoppingCart, 
  Check, 
  Gauge
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Metric {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change: {
    value: string;
    positive: boolean;
  };
  iconBgColor: string;
  iconColor: string;
}

const DashboardMetrics: React.FC = () => {
  // In a real app, this would be fetched from an API
  const metrics: Metric[] = [
    {
      title: "Pending Orders",
      value: 8,
      icon: <ClipboardList size={20} />,
      change: {
        value: "+3 from yesterday",
        positive: false,
      },
      iconBgColor: "bg-primary bg-opacity-10",
      iconColor: "text-primary",
    },
    {
      title: "Items Picked Today",
      value: 42,
      icon: <ShoppingCart size={20} />,
      change: {
        value: "+12 from yesterday",
        positive: true,
      },
      iconBgColor: "bg-success bg-opacity-10",
      iconColor: "text-success",
    },
    {
      title: "Orders Completed",
      value: 12,
      icon: <Check size={20} />,
      change: {
        value: "86% completion rate",
        positive: true,
      },
      iconBgColor: "bg-info bg-opacity-10",
      iconColor: "text-info",
    },
    {
      title: "Efficiency Rate",
      value: "94%",
      icon: <Gauge size={20} />,
      change: {
        value: "+2% from yesterday",
        positive: true,
      },
      iconBgColor: "bg-secondary bg-opacity-10",
      iconColor: "text-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm">{metric.title}</p>
                <h2 className="text-2xl font-bold">{metric.value}</h2>
              </div>
              <div className={`h-10 w-10 rounded-full ${metric.iconBgColor} flex items-center justify-center ${metric.iconColor}`}>
                {metric.icon}
              </div>
            </div>
            <div className="mt-2 text-sm">
              <span className={metric.change.positive ? "text-success" : "text-warning"}>
                {metric.change.value}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardMetrics;
