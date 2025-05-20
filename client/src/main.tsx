import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import { GlobalProvider } from "./contexts/GlobalContext";
import { Toaster } from "@/components/ui/toaster";

// Create a simple component to wrap everything and provide context
const AppWithProviders = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GlobalProvider>
          <App />
          <Toaster />
        </GlobalProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<AppWithProviders />);
