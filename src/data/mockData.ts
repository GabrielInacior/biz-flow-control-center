
import { 
  Customer,
  Product,
  Sale,
  Expense,
  Activity
} from "../models/types";

// Generate mock customers
export const mockCustomers: Customer[] = [
  {
    id: "c1",
    name: "John Smith",
    email: "john@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown, USA",
    createdAt: "2024-03-15T10:30:00Z",
    totalPurchases: 1250.75,
    lastPurchase: "2024-04-02T14:20:00Z",
    notes: "Regular client, prefers appointments on Mondays"
  },
  {
    id: "c2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "555-987-6543",
    address: "456 Oak Ave, Somewhere, USA",
    createdAt: "2024-02-22T15:45:00Z",
    totalPurchases: 875.50,
    lastPurchase: "2024-04-05T11:10:00Z"
  },
  {
    id: "c3",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "555-456-7890",
    address: "789 Pine Rd, Elsewhere, USA",
    createdAt: "2024-01-10T09:15:00Z",
    totalPurchases: 2340.25,
    lastPurchase: "2024-03-28T16:45:00Z",
    notes: "Bulk purchaser, eligible for loyalty discount"
  },
  {
    id: "c4",
    name: "Emma Wilson",
    email: "emma@example.com",
    phone: "555-789-0123",
    createdAt: "2024-03-05T13:40:00Z",
    totalPurchases: 450.00,
    lastPurchase: "2024-04-01T10:30:00Z"
  },
  {
    id: "c5",
    name: "David Lee",
    email: "david@example.com",
    phone: "555-234-5678",
    address: "321 Maple Dr, Nowhere, USA",
    createdAt: "2024-02-18T11:20:00Z",
    totalPurchases: 1875.35,
    lastPurchase: "2024-04-04T15:15:00Z",
    notes: "Corporate account"
  }
];

// Generate mock products
export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Premium Shampoo",
    sku: "SH-001",
    category: "Hair Care",
    price: 24.99,
    cost: 12.50,
    stockQuantity: 45,
    reorderLevel: 10,
    description: "Luxury shampoo for all hair types",
    image: "/placeholder.svg"
  },
  {
    id: "p2",
    name: "Styling Gel",
    sku: "SG-002",
    category: "Hair Care",
    price: 18.50,
    cost: 8.25,
    stockQuantity: 32,
    reorderLevel: 8,
    description: "Strong hold styling gel",
    image: "/placeholder.svg"
  },
  {
    id: "p3",
    name: "Facial Cleanser",
    sku: "FC-003",
    category: "Skincare",
    price: 32.99,
    cost: 15.75,
    stockQuantity: 28,
    reorderLevel: 5,
    description: "Gentle daily cleanser for sensitive skin",
    image: "/placeholder.svg"
  },
  {
    id: "p4",
    name: "Moisturizing Lotion",
    sku: "ML-004",
    category: "Skincare",
    price: 27.50,
    cost: 13.25,
    stockQuantity: 22,
    reorderLevel: 7,
    description: "24-hour hydration for all skin types",
    image: "/placeholder.svg"
  },
  {
    id: "p5",
    name: "Nail Polish Set",
    sku: "NP-005",
    category: "Nails",
    price: 42.00,
    cost: 22.50,
    stockQuantity: 15,
    reorderLevel: 3,
    description: "Set of 5 seasonal colors",
    image: "/placeholder.svg"
  },
  {
    id: "p6",
    name: "Hair Dryer - Professional",
    sku: "HD-006",
    category: "Equipment",
    price: 189.99,
    cost: 95.00,
    stockQuantity: 8,
    reorderLevel: 2,
    description: "Salon-quality hair dryer with attachments",
    image: "/placeholder.svg"
  },
  {
    id: "p7",
    name: "Beard Trimmer",
    sku: "BT-007",
    category: "Equipment",
    price: 65.50,
    cost: 32.75,
    stockQuantity: 12,
    reorderLevel: 4,
    description: "Precision beard trimmer with multiple guards",
    image: "/placeholder.svg"
  }
];

// Generate mock sales
export const mockSales: Sale[] = [
  {
    id: "s1",
    customerId: "c1",
    customerName: "John Smith",
    date: "2024-04-02T14:20:00Z",
    items: [
      {
        productId: "p1",
        productName: "Premium Shampoo",
        quantity: 1,
        unitPrice: 24.99,
        total: 24.99
      },
      {
        productId: "p2",
        productName: "Styling Gel",
        quantity: 1,
        unitPrice: 18.50,
        total: 18.50
      }
    ],
    total: 43.49,
    paymentStatus: "paid",
    paymentMethod: "credit card"
  },
  {
    id: "s2",
    customerId: "c2",
    customerName: "Sarah Johnson",
    date: "2024-04-05T11:10:00Z",
    items: [
      {
        productId: "p3",
        productName: "Facial Cleanser",
        quantity: 1,
        unitPrice: 32.99,
        total: 32.99
      },
      {
        productId: "p4",
        productName: "Moisturizing Lotion",
        quantity: 1,
        unitPrice: 27.50,
        total: 27.50
      }
    ],
    total: 60.49,
    paymentStatus: "paid",
    paymentMethod: "cash"
  },
  {
    id: "s3",
    customerId: "c3",
    customerName: "Michael Brown",
    date: "2024-03-28T16:45:00Z",
    items: [
      {
        productId: "p6",
        productName: "Hair Dryer - Professional",
        quantity: 1,
        unitPrice: 189.99,
        total: 189.99
      }
    ],
    total: 189.99,
    paymentStatus: "paid",
    paymentMethod: "credit card"
  },
  {
    id: "s4",
    customerId: "c4",
    customerName: "Emma Wilson",
    date: "2024-04-01T10:30:00Z",
    items: [
      {
        productId: "p5",
        productName: "Nail Polish Set",
        quantity: 1,
        unitPrice: 42.00,
        total: 42.00
      }
    ],
    total: 42.00,
    paymentStatus: "paid",
    paymentMethod: "credit card"
  },
  {
    id: "s5",
    customerId: "c5",
    customerName: "David Lee",
    date: "2024-04-04T15:15:00Z",
    items: [
      {
        productId: "p7",
        productName: "Beard Trimmer",
        quantity: 1,
        unitPrice: 65.50,
        total: 65.50
      },
      {
        productId: "p1",
        productName: "Premium Shampoo",
        quantity: 2,
        unitPrice: 24.99,
        total: 49.98
      }
    ],
    total: 115.48,
    paymentStatus: "pending",
    paymentMethod: "invoice"
  }
];

// Generate mock expenses
export const mockExpenses: Expense[] = [
  {
    id: "e1",
    category: "Rent",
    amount: 1500.00,
    date: "2024-04-01T00:00:00Z",
    description: "Monthly rent payment"
  },
  {
    id: "e2",
    category: "Utilities",
    amount: 285.75,
    date: "2024-04-03T00:00:00Z",
    description: "Electricity, water, internet"
  },
  {
    id: "e3",
    category: "Inventory",
    amount: 1250.45,
    date: "2024-03-25T00:00:00Z",
    description: "Monthly product order"
  },
  {
    id: "e4",
    category: "Marketing",
    amount: 450.00,
    date: "2024-03-15T00:00:00Z",
    description: "Social media promotions"
  },
  {
    id: "e5",
    category: "Equipment",
    amount: 350.25,
    date: "2024-03-10T00:00:00Z",
    description: "Repair for salon chair"
  }
];

// Generate mock recent activities
export const mockActivities: Activity[] = [
  {
    id: "a1",
    type: "customer",
    title: "New Customer",
    description: "Sarah Johnson registered as a new customer",
    timestamp: "2024-04-05T11:00:00Z"
  },
  {
    id: "a2",
    type: "sale",
    title: "New Sale",
    description: "Sold Premium Shampoo and Styling Gel to John Smith",
    timestamp: "2024-04-02T14:20:00Z"
  },
  {
    id: "a3",
    type: "product",
    title: "Low Stock Alert",
    description: "Nail Polish Set is running low (3 remaining)",
    timestamp: "2024-04-03T09:15:00Z"
  },
  {
    id: "a4",
    type: "expense",
    title: "New Expense",
    description: "Utility bills paid ($285.75)",
    timestamp: "2024-04-03T10:30:00Z"
  },
  {
    id: "a5",
    type: "sale",
    title: "Pending Payment",
    description: "David Lee has a pending payment of $115.48",
    timestamp: "2024-04-04T15:15:00Z"
  }
];

// Generate monthly sales data for charts
export const monthlySalesData = [
  { month: "Jan", sales: 4200 },
  { month: "Feb", sales: 5800 },
  { month: "Mar", sales: 6800 },
  { month: "Apr", sales: 5500 },
  { month: "May", sales: 7200 },
  { month: "Jun", sales: 8100 },
  { month: "Jul", sales: 7400 },
  { month: "Aug", sales: 6200 },
  { month: "Sep", sales: 5900 },
  { month: "Oct", sales: 6700 },
  { month: "Nov", sales: 7500 },
  { month: "Dec", sales: 9200 }
];

// Generate product category distribution data
export const productCategoryData = [
  { name: "Hair Care", value: 32 },
  { name: "Skincare", value: 25 },
  { name: "Makeup", value: 18 },
  { name: "Nails", value: 15 },
  { name: "Equipment", value: 10 }
];
