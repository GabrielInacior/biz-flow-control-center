
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export interface CustomerData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  address: string;
  notes: string;
}

interface CustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: CustomerData;
  onSave: (customer: CustomerData) => void;
  mode: 'create' | 'edit';
}

const initialData: CustomerData = {
  name: "",
  email: "",
  phone: "",
  status: "active",
  address: "",
  notes: ""
};

export function CustomerModal({
  open,
  onOpenChange,
  customer,
  onSave,
  mode
}: CustomerModalProps) {
  const [formData, setFormData] = useState<CustomerData>(customer || initialData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: "active" | "inactive") => {
    setFormData((prev) => ({ ...prev, status: value }));
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
        title: `Customer ${mode === 'create' ? 'created' : 'updated'} successfully`,
        description: `${formData.name} has been ${mode === 'create' ? 'added to' : 'updated in'} your customer database.`,
      });
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-card border-muted">
        <DialogHeader>
          <DialogTitle className="gradient-text">
            {mode === 'create' ? 'Add New Customer' : 'Edit Customer'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === 'create' 
              ? 'Fill in the details to add a new customer to your database.' 
              : 'Update the customer information in your database.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-foreground">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3 bg-background/50"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="customer@example.com"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3 bg-background/50"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right text-foreground">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-3 bg-background/50"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right text-foreground">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="col-span-3 bg-background/50">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-muted">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right text-foreground">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                placeholder="Customer address"
                value={formData.address}
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
                placeholder="Additional notes about this customer"
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
              {loading ? "Saving..." : "Save Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
