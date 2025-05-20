import React from "react";
import { Link, useLocation } from "wouter";
import Logo from "@/components/icons/Logo";
import {
  Home,
  ClipboardList,
  QrCode,
  ShoppingCart,
  Package,
  Database,
  User
} from "lucide-react";

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  // Use mock data instead of context for demo
  const user = { name: "Demo User", role: "Picker" };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <aside className="bg-white w-64 shadow-lg hidden lg:block flex-shrink-0 overflow-y-auto">
      <div className="p-4 border-b">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2">
            <User size={24} />
          </div>
          <h2 className="font-medium">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.role}</p>
        </div>
      </div>
      
      <nav className="p-2">
        <ul className="space-y-1">
          <li>
            <div
              onClick={() => window.location.href = "/dashboard"}
              className={`flex items-center p-3 rounded-md cursor-pointer ${
                isActive("/dashboard") || isActive("/") ? "bg-primary-light bg-opacity-10 text-primary" : "hover:bg-gray-100"
              }`}
            >
              <Home className="mr-3" size={20} />
              <span>Dashboard</span>
            </div>
          </li>
          <li>
            <div
              onClick={() => window.location.href = "/orders"}
              className={`flex items-center p-3 rounded-md cursor-pointer ${
                isActive("/orders") ? "bg-primary-light bg-opacity-10 text-primary" : "hover:bg-gray-100"
              }`}
            >
              <ClipboardList className="mr-3" size={20} />
              <span>Orders</span>
            </div>
          </li>
          <li>
            <div
              onClick={() => window.location.href = "/scan"}
              className={`flex items-center p-3 rounded-md cursor-pointer ${
                isActive("/scan") ? "bg-primary-light bg-opacity-10 text-primary" : "hover:bg-gray-100"
              }`}
            >
              <QrCode className="mr-3" size={20} />
              <span>Scan Products</span>
            </div>
          </li>
          <li>
            <div
              onClick={() => window.location.href = "/picking"}
              className={`flex items-center p-3 rounded-md cursor-pointer ${
                isActive("/picking") ? "bg-primary-light bg-opacity-10 text-primary" : "hover:bg-gray-100"
              }`}
            >
              <ShoppingCart className="mr-3" size={20} />
              <span>Picking</span>
            </div>
          </li>
          <li>
            <div
              onClick={() => window.location.href = "/packing"}
              className={`flex items-center p-3 rounded-md cursor-pointer ${
                isActive("/packing") ? "bg-primary-light bg-opacity-10 text-primary" : "hover:bg-gray-100"
              }`}
            >
              <Package className="mr-3" size={20} />
              <span>Packing</span>
            </div>
          </li>
          <li>
            <Link href="/inventory">
              <a className={`flex items-center p-3 rounded-md ${
                isActive("/inventory") ? "bg-primary-light bg-opacity-10 text-primary" : "hover:bg-gray-100"
              }`}>
                <Database className="mr-3" size={20} />
                <span>Inventory</span>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
