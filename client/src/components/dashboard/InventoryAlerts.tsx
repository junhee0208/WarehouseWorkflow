import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, AlertTriangle, InfoIcon } from "lucide-react";
import { useInventoryService } from "@/services/inventoryService";

const InventoryAlerts: React.FC = () => {
  const { getLowStockAlerts, getActivityFeed } = useInventoryService();
  
  const alerts = getLowStockAlerts();
  const activityFeed = getActivityFeed();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Inventory Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div 
              key={index} 
              className={`p-3 ${
                alert.type === 'error' 
                  ? 'bg-red-50 border-l-4 border-error' 
                  : alert.type === 'warning' 
                    ? 'bg-yellow-50 border-l-4 border-warning' 
                    : 'bg-blue-50 border-l-4 border-info'
              } rounded-md`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {alert.type === 'error' && <AlertCircle className="text-error" size={20} />}
                  {alert.type === 'warning' && <AlertTriangle className="text-warning" size={20} />}
                  {alert.type === 'info' && <InfoIcon className="text-info" size={20} />}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    alert.type === 'error' 
                      ? 'text-error' 
                      : alert.type === 'warning' 
                        ? 'text-warning' 
                        : 'text-info'
                  }`}>
                    {alert.title}
                  </h3>
                  <p className={`text-sm ${
                    alert.type === 'error' 
                      ? 'text-red-700' 
                      : alert.type === 'warning' 
                        ? 'text-yellow-700' 
                        : 'text-blue-700'
                  } mt-1`}>
                    {alert.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {activityFeed.map((activity, index) => (
              <div key={index} className="flex items-start">
                <span className={`material-icons text-sm mr-2 ${
                  activity.type === 'success' 
                    ? 'text-success' 
                    : activity.type === 'primary' 
                      ? 'text-primary' 
                      : 'text-secondary'
                }`}>
                  {activity.icon}
                </span>
                <div>
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryAlerts;
