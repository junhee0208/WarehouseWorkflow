import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import SidebarMobile from "./SidebarMobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleMobileMenu={toggleMobileMenu} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <SidebarMobile isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
        <main className="flex-1 overflow-y-auto p-4 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
