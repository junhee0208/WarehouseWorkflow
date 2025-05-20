import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("picker1");
  const [password, setPassword] = useState("password");
  const [role, setRole] = useState("picker");
  const [isLoading, setIsLoading] = useState(false);
  
  // We'll use local login for demo purposes
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Invalid input",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      login(username, password, role as "picker" | "packer" | "manager");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary to-primary-dark">
      <Card className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <CardContent className="p-0">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">WMS</h1>
            <p className="text-muted-foreground">Warehouse Management System</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-muted-foreground mb-1">Username</label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-muted-foreground mb-1">Login As</label>
              <Select
                value={role}
                onValueChange={setRole}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="picker">Picker</SelectItem>
                  <SelectItem value="packer">Packer</SelectItem>
                  <SelectItem value="manager">Warehouse Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-primary text-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo Account: picker1 / password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
