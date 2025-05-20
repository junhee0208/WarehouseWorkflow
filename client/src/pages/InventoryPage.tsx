import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Search, 
  Download, 
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ArrowUpDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useInventoryService } from "@/services/inventoryService";
import { useToast } from "@/hooks/use-toast";

const InventoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [isAdjustStockModalOpen, setIsAdjustStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [adjustmentType, setAdjustmentType] = useState("add");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(1);
  const [adjustmentReason, setAdjustmentReason] = useState("new_shipment");
  const [otherReason, setOtherReason] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  } | null>(null);
  
  const { getAllProducts, updateProductStock } = useInventoryService();
  const { toast } = useToast();
  
  React.useEffect(() => {
    // Load products
    const loadedProducts = getAllProducts();
    setProducts(loadedProducts);
  }, [getAllProducts]);
  
  const handleStockAdjustment = () => {
    if (!selectedProduct) return;
    
    let newStock = selectedProduct.stockQuantity;
    
    if (adjustmentType === "add") {
      newStock += adjustmentQuantity;
    } else if (adjustmentType === "remove") {
      newStock = Math.max(0, newStock - adjustmentQuantity);
    } else { // set
      newStock = adjustmentQuantity;
    }
    
    // Update stock
    updateProductStock(selectedProduct.productId, newStock);
    
    // Update local state
    setProducts(products.map(product => 
      product.productId === selectedProduct.productId 
        ? { ...product, stockQuantity: newStock } 
        : product
    ));
    
    // Show success message
    toast({
      title: "Stock adjusted",
      description: `${selectedProduct.name} stock updated to ${newStock} units`,
      variant: "success",
    });
    
    // Close modal
    setIsAdjustStockModalOpen(false);
  };
  
  const handleAdjustStock = (product: any) => {
    setSelectedProduct(product);
    setAdjustmentQuantity(1);
    setIsAdjustStockModalOpen(true);
  };
  
  const handleRefresh = () => {
    const refreshedProducts = getAllProducts();
    setProducts(refreshedProducts);
    
    toast({
      title: "Inventory refreshed",
      description: "The inventory has been refreshed",
    });
  };
  
  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Inventory data export has started",
    });
  };
  
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };
  
  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.productId.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.location.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      
      const key = sortConfig.key as keyof typeof a;
      
      if (a[key] < b[key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
  const getSortIcon = (columnName: string) => {
    if (!sortConfig || sortConfig.key !== columnName) {
      return <ArrowUpDown size={16} className="ml-1" />;
    }
    
    return sortConfig.direction === 'ascending' 
      ? <ChevronUp size={16} className="ml-1" />
      : <ChevronDown size={16} className="ml-1" />;
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Inventory Management</h1>
        <p className="text-muted-foreground">View and manage your warehouse inventory</p>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Search inventory by name, ID or location..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Select 
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Wearables">Wearables</SelectItem>
                  <SelectItem value="Home Goods">Home Goods</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="default"
                onClick={handleRefresh}
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold">Inventory Items</CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleExport}
          >
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('productId')}>
                    <div className="flex items-center">
                      <span>Product ID</span>
                      {getSortIcon('productId')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('name')}>
                    <div className="flex items-center">
                      <span>Name</span>
                      {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('category')}>
                    <div className="flex items-center">
                      <span>Category</span>
                      {getSortIcon('category')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('location')}>
                    <div className="flex items-center">
                      <span>Location</span>
                      {getSortIcon('location')}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('stockQuantity')}>
                    <div className="flex items-center">
                      <span>Stock</span>
                      {getSortIcon('stockQuantity')}
                    </div>
                  </TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const stockPercentage = (product.stockQuantity / 120) * 100; // Assuming 120 is max capacity
                    
                    let stockBarColor = "bg-green-500";
                    if (stockPercentage < 20) {
                      stockBarColor = "bg-red-500";
                    } else if (stockPercentage < 50) {
                      stockBarColor = "bg-yellow-500";
                    }
                    
                    return (
                      <TableRow key={product.productId}>
                        <TableCell className="font-medium">{product.productId}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-full max-w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <div className={`${stockBarColor} h-2 rounded-full`} style={{ width: `${stockPercentage}%` }}></div>
                            </div>
                            <span className="text-sm">{product.stockQuantity}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="link" className="text-primary hover:text-primary-dark">View</Button>
                            <Button 
                              variant="link" 
                              className="text-secondary hover:text-secondary-dark"
                              onClick={() => handleAdjustStock(product)}
                            >
                              Adjust
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-gray-200 p-4">
          <div className="text-sm text-muted-foreground">
            <span>Showing {filteredProducts.length} of {products.length} products</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-white">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Dialog open={isAdjustStockModalOpen} onOpenChange={setIsAdjustStockModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock Level</DialogTitle>
          </DialogHeader>
          
          <div className="p-2">
            <div className="mb-4">
              <p className="text-sm mb-2">Product: <span className="font-medium">{selectedProduct?.name}</span></p>
              <p className="text-sm mb-2">Current Stock: <span className="font-medium">{selectedProduct?.stockQuantity} units</span></p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="adjustment_type" className="block text-sm font-medium mb-1">Adjustment Type</label>
                <Select
                  value={adjustmentType}
                  onValueChange={setAdjustmentType}
                >
                  <SelectTrigger id="adjustment_type">
                    <SelectValue placeholder="Select adjustment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Stock</SelectItem>
                    <SelectItem value="remove">Remove Stock</SelectItem>
                    <SelectItem value="set">Set Exact Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium mb-1">Quantity</label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={adjustmentQuantity}
                  onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label htmlFor="reason" className="block text-sm font-medium mb-1">Reason for Adjustment</label>
                <Select
                  value={adjustmentReason}
                  onValueChange={setAdjustmentReason}
                >
                  <SelectTrigger id="reason">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_shipment">New Shipment</SelectItem>
                    <SelectItem value="damaged">Damaged Goods</SelectItem>
                    <SelectItem value="inventory_count">Inventory Count</SelectItem>
                    <SelectItem value="returned">Customer Return</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {adjustmentReason === "other" && (
                <div>
                  <label htmlFor="other_reason" className="block text-sm font-medium mb-1">Specify Reason</label>
                  <Input
                    id="other_reason"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustStockModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStockAdjustment}>
              Save Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryPage;
