import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { X, User, Home, ClipboardList, QrCode, ShoppingCart, Package, Database, LogOut } from "lucide-react";

interface SidebarMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarMobile: React.FC<SidebarMobileProps> = ({ isOpen, onClose }) => {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location === path;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden">
      <div className="bg-white h-full w-64 shadow-lg p-4 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Menu</h2>
          <button onClick={onClose} className="focus:outline-none">
            <X size={24} />
          </button>
        </div>
        
        <div className="text-center mb-6">
          <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2">
            <User size={24} />
          </div>
          <h2 className="font-medium">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.role}</p>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-1">
            <li>
              <Link href="/dashboard">
                <a 
                  className={`flex items-center p-3 rounded-md ${
                    isActive("/dashboard") || isActive("/") ? "bg-primary-light bg-opacity-10 text-primary" : "hover:bg-gray-100"
                  }`}
                  onClick={onClose}
                >
                  <Home className="mr-3" size={20} />
                  <span>Dashboard</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/orders">
                <a 
                  className={`flex items-center p-3 rounded-md ${
                    isActive("/orders") ? "bg-primary-light bg-opacity-10 text-primary" : "hover:bg-gray-100"
                  }`}
                  onClick={onClose}
                >
                  <ClipboardList className="mr-3" size={20} />
                  <span>Orders</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/scan">
                <a 
                  className={`flex items-center p-3 rounded-md ${
                    isActive("/scan") ? "bg-primary-light bg-opacity-10 text-primary" : "hover:bg-gray-100"
                  }`}
                  onClick={onClose}
                >
                  <QrCode className="mr-3" size={20} />
                  <span>Scan Products</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/picking">
                <a 
                  className={`flex items-center p-3 rounded-md ${
                    isActive("/picking") ? "bg-primary-light bg-opacity-10 text-primary" : "hover:bg-gray-100"
                  }`}
                  onClick={onClose}
                >
                  <ShoppingCart className="mr-3" size={20} />
                  <span>Picking</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/packing">
                <a 
                  className={`flex items-center p-3 rounded-md ${
                    isActive("/packing") ? "bg-primary-light bg-opacity-10 text-primary" : "hover:bg-gray-100"
                  }`}
                  onClick={onClose}
                >
                  <Package className="mr-3" size={20} />
                  <span>Packing</span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/inventory">
                <a 
                  className={`flex items-center p-3 rounded-md ${
                    isActive("/inventory") ? "bg-primary-light bg-opacity-10 text-primary" : "hover:bg-gray-100"
                  }`}
                  onClick={onClose}
                >
                  <Database className="mr-3" size={20} />
                  <span>Inventory</span>
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="border-t pt-4">
          <button 
            onClick={() => {
              logout();
              onClose();
            }} 
            className="flex items-center p-3 text-red-600 w-full hover:bg-gray-100 rounded-md"
          >
            <LogOut className="mr-3" size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarMobile;
