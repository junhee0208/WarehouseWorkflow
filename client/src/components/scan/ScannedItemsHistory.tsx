import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ScannedItem {
  time: string;
  productId: string;
  name: string;
  location: string;
}

interface ScannedItemsHistoryProps {
  scannedItems: ScannedItem[];
  onViewDetails: (productId: string) => void;
}

const ScannedItemsHistory: React.FC<ScannedItemsHistoryProps> = ({ 
  scannedItems,
  onViewDetails
}) => {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recently Scanned Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scannedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No items scanned yet. Start scanning to see results here.
                  </TableCell>
                </TableRow>
              ) : (
                scannedItems.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell>{item.time}</TableCell>
                    <TableCell>{item.productId}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      <Button 
                        variant="link" 
                        className="text-primary hover:text-primary-dark"
                        onClick={() => onViewDetails(item.productId)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScannedItemsHistory;
