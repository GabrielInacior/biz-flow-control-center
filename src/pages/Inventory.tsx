
import { useState } from "react";
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash, 
  ChevronDown,
  AlertCircle,
  AlertTriangle,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockProducts } from "@/data/mockData";
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
import { Product } from "@/models/types";
import { toast } from "sonner";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filter, setFilter] = useState<"all" | "low-stock">("all");
  
  // Filter products based on search query and filter
  const filteredProducts = products.filter((product) => {
    // Apply search filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply stock filter
    const matchesStockFilter = filter === "all" || 
      (filter === "low-stock" && product.stockQuantity <= product.reorderLevel);
    
    return matchesSearch && matchesStockFilter;
  });
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Handle delete product
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    toast.success("Product deleted successfully.");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <Button className="bg-bizteal-500 hover:bg-bizteal-600">
          <PlusCircle className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Product Management</CardTitle>
          <CardDescription>
            Manage your products, track inventory levels, and add new items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={filter === "low-stock" ? "default" : "outline"}
                onClick={() => setFilter("low-stock")}
              >
                Low Stock
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const isLowStock = product.stockQuantity <= product.reorderLevel;
                    const isOutOfStock = product.stockQuantity === 0;
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center mr-3">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="h-8 w-8 object-contain" 
                                />
                              ) : (
                                <Package className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                            <div>
                              <div>{product.name}</div>
                              {product.description && (
                                <div className="text-xs text-gray-500">{product.description}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {isOutOfStock ? (
                              <Badge variant="destructive" className="mr-2">
                                Out of stock
                              </Badge>
                            ) : isLowStock ? (
                              <div className="flex items-center text-amber-500">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                <span>{product.stockQuantity}</span>
                              </div>
                            ) : (
                              <span>{product.stockQuantity}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <ChevronDown className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600"
                                onClick={() => handleDeleteProduct(product.id)}>
                                <Trash className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
