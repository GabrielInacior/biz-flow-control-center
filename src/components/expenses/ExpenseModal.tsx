
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export interface ExpenseData {
  id?: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
  reference: string;
  notes: string;
}

interface ExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: ExpenseData;
  onSave: (expense: ExpenseData) => void;
  mode: "create" | "edit";
}

const initialData: ExpenseData = {
  title: "",
  amount: 0,
  date: new Date().toISOString().split("T")[0],
  category: "",
  paymentMethod: "cash",
  reference: "",
  notes: ""
};

const CATEGORIES = [
  "Rent",
  "Utilities",
  "Payroll",
  "Inventory",
  "Marketing",
  "Office Supplies",
  "Insurance",
  "Travel",
  "Maintenance",
  "Software",
  "Taxes",
  "Other"
];

const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Check",
  "PayPal",
  "Other"
];

export function ExpenseModal({
  open,
  onOpenChange,
  expense,
  onSave,
  mode
}: ExpenseModalProps) {
  const [formData, setFormData] = useState<ExpenseData>(expense || initialData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "amount" ? parseFloat(value) || 0 : value 
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }));
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
        title: `Expense ${mode === "create" ? "recorded" : "updated"} successfully`,
        description: `${formData.title} has been ${mode === "create" ? "added to" : "updated in"} your expense records.`,
      });
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-card border-muted">
        <DialogHeader>
          <DialogTitle className="gradient-text">
            {mode === "create" ? "Record New Expense" : "Edit Expense"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "create"
              ? "Fill in the details to record a new expense."
              : "Update the expense information."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right text-foreground">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Expense title"
                value={formData.title}
                onChange={handleChange}
                className="col-span-3 bg-background/50"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right text-foreground">
                Amount
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className="col-span-3 bg-background/50"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right text-foreground">
                Date
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="col-span-3 bg-background/50"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right text-foreground">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="col-span-3 bg-background/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-muted">
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentMethod" className="text-right text-foreground">
                Payment Method
              </Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={handlePaymentMethodChange}
              >
                <SelectTrigger className="col-span-3 bg-background/50">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-card border-muted">
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method} value={method.toLowerCase()}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reference" className="text-right text-foreground">
                Reference
              </Label>
              <Input
                id="reference"
                name="reference"
                placeholder="Invoice or receipt number"
                value={formData.reference}
                onChange={handleChange}
                className="col-span-3 bg-background/50"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2 text-foreground">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional details about this expense"
                value={formData.notes}
                onChange={handleChange}
                className="col-span-3 bg-background/50"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              {loading ? "Saving..." : "Save Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
