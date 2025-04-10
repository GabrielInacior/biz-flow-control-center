
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export interface ProductData {
  id?: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  description: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductData;
  onSave: (product: ProductData) => void;
  mode: "create" | "edit";
}

const initialData: ProductData = {
  name: "",
  sku: "",
  category: "",
  price: 0,
  costPrice: 0,
  stockQuantity: 0,
  description: "",
  status: "in-stock"
};

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food",
  "Beverages",
  "Furniture",
  "Office Supplies",
  "Other"
];

export function ProductModal({
  open,
  onOpenChange,
  product,
  onSave,
  mode
}: ProductModalProps) {
  const [formData, setFormData] = useState<ProductData>(product || initialData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "price" || name === "costPrice" || name === "stockQuantity" 
        ? parseFloat(value) || 0 
        : value 
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Calculate the status based on stock quantity
    let calculatedStatus: "in-stock" | "low-stock" | "out-of-stock";
    if (formData.stockQuantity <= 0) {
      calculatedStatus = "out-of-stock";
    } else if (formData.stockQuantity <= 5) {
      calculatedStatus = "low-stock";
    } else {
      calculatedStatus = "in-stock";
    }
    
    const updatedFormData = { ...formData, status: calculatedStatus };
    
    // Simulate API call
    setTimeout(() => {
      onSave(updatedFormData);
      setLoading(false);
      onOpenChange(false);
      
      toast({
        title: `Product ${mode === "create" ? "created" : "updated"} successfully`,
        description: `${formData.name} has been ${mode === "create" ? "added to" : "updated in"} your inventory.`,
      });
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Product" : "Edit Product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to add a new product to your inventory."
              : "Update the product information in your inventory."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Product name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">
                SKU
              </Label>
              <Input
                id="sku"
                name="sku"
                placeholder="Stock keeping unit"
                value={formData.sku}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costPrice" className="text-right">
                Cost Price
              </Label>
              <Input
                id="costPrice"
                name="costPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.costPrice}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stockQuantity" className="text-right">
                Stock Quantity
              </Label>
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stockQuantity}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Product description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-bizblue-600 hover:bg-bizblue-700">
              {loading ? "Saving..." : "Save Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
