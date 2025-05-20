import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, Bell, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/components/icons/Logo";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="mr-2 block lg:hidden focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <Logo />
        </div>
        
        <div className="flex items-center">
          <span className="mr-4 hidden md:block">
            {user?.name} ({user?.role})
          </span>
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none flex items-center">
                <User size={24} />
                <ChevronDown size={16} className="ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
