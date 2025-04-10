import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface SaleData {
  id?: string;
  customerId: string;
  customerName: string;
  date: string;
  items: SaleItem[];
  subTotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: "paid" | "pending" | "overdue";
  notes: string;
}

interface SaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale?: SaleData;
  onSave: (sale: SaleData) => void;
  mode: "create" | "edit";
  customers: { id: string; name: string }[];
  products: { id: string; name: string; price: number }[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialItem: SaleItem = {
  id: generateId(),
  productId: "",
  productName: "",
  quantity: 1,
  price: 0,
  total: 0
};

const initialData: SaleData = {
  customerId: "",
  customerName: "",
  date: new Date().toISOString().split("T")[0],
  items: [],
  subTotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
  paymentStatus: "pending",
  notes: ""
};

export function SaleModal({
  open,
  onOpenChange,
  sale,
  onSave,
  mode,
  customers,
  products
}: SaleModalProps) {
  const [formData, setFormData] = useState<SaleData>(sale || initialData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const calculateTotals = (items: SaleItem[], discount: number, taxRate: number) => {
    const subTotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = discount;
    const taxableAmount = subTotal - discountAmount;
    const taxAmount = taxableAmount * (taxRate / 100);
    const total = taxableAmount + taxAmount;
    
    return {
      subTotal,
      tax: taxAmount,
      total
    };
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData(prev => ({
      ...prev,
      customerId,
      customerName: customer?.name || ""
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "discount") {
      const discount = parseFloat(value) || 0;
      const { subTotal, tax, total } = calculateTotals(formData.items, discount, formData.tax);
      
      setFormData(prev => ({
        ...prev,
        discount,
        subTotal,
        tax,
        total
      }));
    } else if (name === "tax") {
      const taxRate = parseFloat(value) || 0;
      const { subTotal, tax, total } = calculateTotals(formData.items, formData.discount, taxRate);
      
      setFormData(prev => ({
        ...prev,
        tax: taxRate,
        total
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePaymentStatusChange = (value: "paid" | "pending" | "overdue") => {
    setFormData(prev => ({ ...prev, paymentStatus: value }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...initialItem, id: generateId() }]
    }));
  };

  const removeItem = (itemId: string) => {
    const updatedItems = formData.items.filter(item => item.id !== itemId);
    const { subTotal, tax, total } = calculateTotals(updatedItems, formData.discount, formData.tax);
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      subTotal,
      tax,
      total
    }));
  };

  const updateItem = (itemId: string, field: string, value: string | number) => {
    const updatedItems = formData.items.map(item => {
      if (item.id === itemId) {
        if (field === "productId") {
          const selectedProduct = products.find(p => p.id === value);
          if (selectedProduct) {
            const price = selectedProduct.price;
            const total = price * item.quantity;
            
            return {
              ...item,
              productId: value as string,
              productName: selectedProduct.name,
              price,
              total
            };
          }
        } else if (field === "quantity") {
          const quantity = parseFloat(value as string) || 0;
          const total = item.price * quantity;
          
          return {
            ...item,
            quantity,
            total
          };
        }
        
        return { ...item, [field]: value };
      }
      return item;
    });
    
    const { subTotal, tax, total } = calculateTotals(updatedItems, formData.discount, formData.tax);
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      subTotal,
      tax,
      total
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSave(formData);
      setLoading(false);
      onOpenChange(false);
      
      toast({
        title: `Sale ${mode === "create" ? "created" : "updated"} successfully`,
        description: `Invoice for ${formData.customerName} has been ${mode === "create" ? "created" : "updated"}.`,
      });
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Sale" : "Edit Sale"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new sales invoice for your customer."
              : "Update the sales invoice information."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer">Customer</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={handleCustomerChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="date">Invoice Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select
                    value={formData.paymentStatus}
                    onValueChange={handlePaymentStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Invoice notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Items</h3>
                <Button
                  type="button"
                  size="sm"
                  onClick={addItem}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Item
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-[100px]">Quantity</TableHead>
                      <TableHead className="w-[100px]">Price</TableHead>
                      <TableHead className="w-[100px]">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-6">
                          No items added. Click "Add Item" to add products to this invoice.
                        </TableCell>
                      </TableRow>
                    ) : (
                      formData.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Select
                              value={item.productId}
                              onValueChange={(value) => updateItem(item.id, "productId", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            ${item.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            ${item.total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right">
                        Subtotal
                      </TableCell>
                      <TableCell className="text-right">
                        ${formData.subTotal.toFixed(2)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} className="text-right">
                        Discount
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          name="discount"
                          value={formData.discount}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        ${formData.discount.toFixed(2)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} className="text-right">
                        Tax (%)
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          name="tax"
                          value={formData.tax}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        ${(formData.subTotal - formData.discount) * (formData.tax / 100)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${formData.total.toFixed(2)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="bg-bizblue-600 hover:bg-bizblue-700">
              {loading ? "Saving..." : "Save Invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
