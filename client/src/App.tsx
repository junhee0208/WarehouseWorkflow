import { Route, Switch, useLocation } from "wouter";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import ProductScanner from "@/pages/ProductScanner";
import OrdersManagement from "@/pages/OrdersManagement";
import PickingPage from "@/pages/PickingPage";
import PackingPage from "@/pages/PackingPage";
import InventoryPage from "@/pages/InventoryPage";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();

  // If user is not authenticated and not on login page, redirect to login
  if (!isAuthenticated && location !== "/") {
    window.location.href = "/";
    return null;
  }

  return (
    <TooltipProvider>
      {!isAuthenticated ? (
        <LoginPage />
      ) : (
        <AppLayout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/orders" component={OrdersManagement} />
            <Route path="/scan" component={ProductScanner} />
            <Route path="/picking" component={PickingPage} />
            <Route path="/packing" component={PackingPage} />
            <Route path="/inventory" component={InventoryPage} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      )}
    </TooltipProvider>
  );
}

export default App;
