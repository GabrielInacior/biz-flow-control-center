
import { useState } from "react";
import { 
  PlusCircle, 
  Search, 
  Eye, 
  ChevronDown,
  ShoppingCart,
  Check,
  Clock,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockSales } from "@/data/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sale } from "@/models/types";
import { useNavigate } from "react-router-dom";

export default function Sales() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "cancelled">("all");
  const navigate = useNavigate();
  
  // Filter sales based on search query and payment status
  const filteredSales = mockSales.filter((sale) => {
    // Apply search filter
    const matchesSearch = 
      sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply payment status filter
    const matchesStatus = filter === "all" || sale.paymentStatus === filter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Get status badge
  const getStatusBadge = (status: Sale['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="outline" className="bg-green-950/20 text-green-400 border-green-900/30 flex items-center gap-1">
            <Check className="h-3 w-3" /> Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-950/20 text-amber-400 border-amber-900/30 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-950/20 text-red-400 border-red-900/30 flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6 animate-fade">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Sales</h1>
        <Button 
          className="btn-gradient"
          onClick={() => navigate("/sales/new")}
        >
          <PlusCircle className="h-4 w-4 mr-2" /> New Sale
        </Button>
      </div>
      
      <Card className="dashboard-card">
        <CardHeader className="pb-3">
          <CardTitle>Sales Management</CardTitle>
          <CardDescription>
            View and manage your sales transactions and payment status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-background/50"
              />
            </div>
            
            <div className="flex items-center space-x-2 flex-wrap">
              <Button 
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                size="sm"
                className={filter === "all" ? "btn-gradient" : "bg-background/50"}
              >
                All
              </Button>
              <Button 
                variant={filter === "paid" ? "default" : "outline"}
                onClick={() => setFilter("paid")}
                size="sm"
                className={filter === "paid" ? "btn-gradient" : "bg-background/50"}
              >
                Paid
              </Button>
              <Button 
                variant={filter === "pending" ? "default" : "outline"}
                onClick={() => setFilter("pending")}
                size="sm"
                className={filter === "pending" ? "btn-gradient" : "bg-background/50"}
              >
                Pending
              </Button>
              <Button 
                variant={filter === "cancelled" ? "default" : "outline"}
                onClick={() => setFilter("cancelled")}
                size="sm"
                className={filter === "cancelled" ? "btn-gradient" : "bg-background/50"}
              >
                Cancelled
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border border-border/40">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/5">
                  <TableHead className="text-muted-foreground">Sale ID</TableHead>
                  <TableHead className="text-muted-foreground">Customer</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-muted-foreground">Items</TableHead>
                  <TableHead className="text-muted-foreground">Total</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      No sales found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSales.map((sale) => (
                    <TableRow key={sale.id} className="hover:bg-muted/5">
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <ShoppingCart className="h-4 w-4 mr-2 text-primary" />
                          {sale.id}
                        </div>
                      </TableCell>
                      <TableCell>{sale.customerName}</TableCell>
                      <TableCell>{formatDate(sale.date)}</TableCell>
                      <TableCell>{sale.items.length} items</TableCell>
                      <TableCell className="font-medium">{formatCurrency(sale.total)}</TableCell>
                      <TableCell>{getStatusBadge(sale.paymentStatus)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                              <ChevronDown className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border/40">
                            <DropdownMenuItem className="focus:bg-muted/30">
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            {sale.paymentStatus === 'pending' && (
                              <DropdownMenuItem className="focus:bg-muted/30">
                                <Check className="h-4 w-4 mr-2" /> Mark as Paid
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
