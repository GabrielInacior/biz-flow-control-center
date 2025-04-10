
import { useState } from "react";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Download,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

import { 
  mockSales,
  mockExpenses,
  mockProducts,
  monthlySalesData,
  productCategoryData
} from "@/data/mockData";

// Calculate sales by payment method
const salesByPaymentMethod = mockSales.reduce((acc, sale) => {
  const method = sale.paymentMethod || "Other";
  if (!acc[method]) {
    acc[method] = 0;
  }
  acc[method] += sale.total;
  return acc;
}, {} as Record<string, number>);

// Format as chart data
const paymentMethodData = Object.entries(salesByPaymentMethod).map(([name, value]) => ({
  name,
  value
}));

// Calculate expenses by category
const expensesByCategory = mockExpenses.reduce((acc, expense) => {
  if (!acc[expense.category]) {
    acc[expense.category] = 0;
  }
  acc[expense.category] += expense.amount;
  return acc;
}, {} as Record<string, number>);

// Format as chart data
const expenseCategoryData = Object.entries(expensesByCategory).map(([name, value]) => ({
  name,
  value
}));

// Calculate monthly profit data (revenue - expenses)
const monthlyProfitData = [
  { month: "Jan", sales: 4200, expenses: 3100, profit: 1100 },
  { month: "Feb", sales: 5800, expenses: 4200, profit: 1600 },
  { month: "Mar", sales: 6800, expenses: 4900, profit: 1900 },
  { month: "Apr", sales: 5500, expenses: 4500, profit: 1000 },
  { month: "May", sales: 7200, expenses: 5100, profit: 2100 },
  { month: "Jun", sales: 8100, expenses: 5600, profit: 2500 },
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#0c92e8'];

export default function Reports() {
  const [period, setPeriod] = useState<"week" | "month" | "year" | "custom">("month");
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate totals
  const totalRevenue = mockSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalProfit = totalRevenue - totalExpenses;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </Button>
          <Button variant="outline" className="space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bizblue-600">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-bizteal-600">{formatCurrency(totalProfit)}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Report tabs */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" /> Sales
          </TabsTrigger>
          <TabsTrigger value="profit" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" /> Profit
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-1">
            <PieChart className="h-4 w-4" /> Inventory
          </TabsTrigger>
        </TabsList>
        
        {/* Sales tab content */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
                <CardDescription>
                  Sales revenue breakdown by month
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData} margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                      <Legend />
                      <Bar dataKey="sales" fill="#0c92e8" name="Sales" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Sales by payment method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={paymentMethodData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>
                  Expenses by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={expenseCategoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Profit tab content */}
        <TabsContent value="profit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Profit Analysis</CardTitle>
              <CardDescription>
                Overview of revenue, expenses, and profit over time
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={monthlyProfitData}
                    margin={{ top: 5, right: 30, bottom: 5, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#0c92e8" 
                      name="Sales" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#ff8042" 
                      name="Expenses" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#00d4b0" 
                      name="Profit" 
                      strokeWidth={3}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Avg. Monthly Revenue</div>
                  <div className="font-bold text-bizblue-600">$6,266</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Avg. Monthly Expenses</div>
                  <div className="font-bold text-red-600">$4,566</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Avg. Monthly Profit</div>
                  <div className="font-bold text-bizteal-600">$1,700</div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Inventory tab content */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>
                  Distribution of products by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={productCategoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {productCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
                <CardDescription>
                  Inventory levels by product
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical" 
                      data={mockProducts.map(p => ({ name: p.name, stock: p.stockQuantity, reorderLevel: p.reorderLevel }))}
                      margin={{ top: 5, right: 30, bottom: 5, left: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" scale="band" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="stock" name="Current Stock" fill="#0c92e8" />
                      <Bar dataKey="reorderLevel" name="Reorder Level" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
