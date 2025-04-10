
// User models
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  avatar?: string;
}

// Customer models
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  totalPurchases: number;
  lastPurchase?: string;
  notes?: string;
}

// Product models
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost?: number;
  stockQuantity: number;
  reorderLevel: number;
  description?: string;
  image?: string;
}

// Sales models
export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  items: SaleItem[];
  total: number;
  paymentStatus: 'paid' | 'pending' | 'cancelled';
  paymentMethod?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Expense models
export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
  receipt?: string;
}

// Dashboard stat models
export interface DashboardStat {
  id: string;
  label: string;
  value: number | string;
  change: number;
  isPositive: boolean;
}

// Activity models
export interface Activity {
  id: string;
  type: 'customer' | 'sale' | 'product' | 'expense';
  title: string;
  description: string;
  timestamp: string;
}
