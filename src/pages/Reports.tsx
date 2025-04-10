
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

// Updated colors for charts - orange to purple gradient
const COLORS = ['#FF8042', '#FFA07A', '#E0115F', '#C71585', '#8B008B', '#9932CC'];

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
    <div className="space-y-6 animate-fade">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Reports</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="space-x-2 bg-background/50 border-border/40">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </Button>
          <Button variant="outline" className="space-x-2 bg-background/50 border-border/40">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {/* Key metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{formatCurrency(totalProfit)}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Report tabs */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="bg-muted/30 backdrop-blur-sm">
          <TabsTrigger value="sales" className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4" /> Sales
          </TabsTrigger>
          <TabsTrigger value="profit" className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
            <LineChart className="h-4 w-4" /> Profit
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white">
            <PieChart className="h-4 w-4" /> Inventory
          </TabsTrigger>
        </TabsList>
        
        {/* Sales tab content */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="lg:col-span-2 dashboard-card">
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Sales revenue breakdown by month
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData} margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                      <Legend />
                      <Bar dataKey="sales" name="Sales" radius={[4, 4, 0, 0]}>
                        {monthlySalesData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#salesBarGradient)`} />
                        ))}
                      </Bar>
                      <defs>
                        <linearGradient id="salesBarGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--secondary))" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription className="text-muted-foreground">
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
            
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription className="text-muted-foreground">
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
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Monthly Profit Analysis</CardTitle>
              <CardDescription className="text-muted-foreground">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                    <Legend />
                    <defs>
                      <linearGradient id="salesLineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.7} />
                      </linearGradient>
                      <linearGradient id="expensesLineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ff8042" stopOpacity={1} />
                        <stop offset="100%" stopColor="#ff8042" stopOpacity={0.7} />
                      </linearGradient>
                      <linearGradient id="profitLineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={1} />
                        <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0.7} />
                      </linearGradient>
                    </defs>
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="url(#salesLineGradient)" 
                      name="Sales" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="url(#expensesLineGradient)" 
                      name="Expenses" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="url(#profitLineGradient)" 
                      name="Profit" 
                      strokeWidth={3}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/40 bg-muted/10">
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground">Avg. Monthly Revenue</div>
                  <div className="font-bold text-primary">$6,266</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground">Avg. Monthly Expenses</div>
                  <div className="font-bold text-destructive">$4,566</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground">Avg. Monthly Profit</div>
                  <div className="font-bold text-secondary">$1,700</div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Inventory tab content */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription className="text-muted-foreground">
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
            
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Stock Levels</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Inventory levels by product
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical" 
                      data={mockProducts.slice(0, 6).map(p => ({ name: p.name, stock: p.stockQuantity, reorderLevel: p.reorderLevel }))}
                      margin={{ top: 5, right: 30, bottom: 5, left: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" scale="band" />
                      <Tooltip />
                      <Legend />
                      <defs>
                        <linearGradient id="stockGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="hsl(var(--secondary))" />
                        </linearGradient>
                        <linearGradient id="reorderGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#ff8042" />
                          <stop offset="100%" stopColor="#ffaf7a" />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="stock" name="Current Stock" fill="url(#stockGradient)" />
                      <Bar dataKey="reorderLevel" name="Reorder Level" fill="url(#reorderGradient)" />
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
