
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
import { ProductModal, ProductData } from "@/components/inventory/ProductModal";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filter, setFilter] = useState<"all" | "low-stock">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  
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

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalMode("edit");
    setModalOpen(true);
  };

  // Handle add new product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalMode("create");
    setModalOpen(true);
  };
  
  // Handle save product from modal
  const handleSaveProduct = (productData: ProductData) => {
    if (modalMode === "create") {
      // Add new product
      const newProduct = {
        ...productData,
        id: Date.now().toString(),
        reorderLevel: 5, // Default reorder level
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Product;
      
      setProducts([...products, newProduct]);
    } else {
      // Update existing product
      setProducts(products.map(p => 
        p.id === selectedProduct?.id 
          ? { ...p, ...productData, updatedAt: new Date().toISOString() } 
          : p
      ));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Inventory</h1>
        <Button onClick={handleAddProduct} className="btn-gradient">
          <PlusCircle className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>
      
      <Card className="border-muted bg-card/50 backdrop-blur-sm card-hover">
        <CardHeader className="pb-3">
          <CardTitle className="text-foreground">Product Management</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your products, track inventory levels, and add new items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-background/50"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className={filter === "all" ? "btn-gradient" : ""}
              >
                All
              </Button>
              <Button 
                variant={filter === "low-stock" ? "default" : "outline"}
                onClick={() => setFilter("low-stock")}
                className={filter === "low-stock" ? "btn-gradient" : ""}
              >
                Low Stock
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border border-muted">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/10">
                  <TableHead className="text-muted-foreground">Product</TableHead>
                  <TableHead className="text-muted-foreground">SKU</TableHead>
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-muted-foreground">Price</TableHead>
                  <TableHead className="text-muted-foreground">Stock</TableHead>
                  <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const isLowStock = product.stockQuantity <= product.reorderLevel;
                    const isOutOfStock = product.stockQuantity === 0;
                    
                    return (
                      <TableRow key={product.id} className="hover:bg-muted/10">
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center mr-3">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="h-8 w-8 object-contain" 
                                />
                              ) : (
                                <Package className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="text-foreground">{product.name}</div>
                              {product.description && (
                                <div className="text-xs text-muted-foreground">{product.description}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground">{formatCurrency(product.price)}</TableCell>
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
                              <span className="text-foreground">{product.stockQuantity}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <ChevronDown className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card border-muted">
                              <DropdownMenuItem 
                                className="text-foreground hover:bg-muted cursor-pointer"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive hover:bg-destructive/10 cursor-pointer"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
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

      {/* Product Modal */}
      <ProductModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        product={selectedProduct as unknown as ProductData | undefined}
        onSave={handleSaveProduct}
        mode={modalMode}
      />
    </div>
  );
}
