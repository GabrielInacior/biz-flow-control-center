
import { useState } from "react";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Wallet, 
  DollarSign, 
  ShoppingBag, 
  UserPlus, 
  AlertCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";
import { 
  mockCustomers, 
  mockProducts, 
  mockSales,
  mockExpenses,
  mockActivities,
  monthlySalesData,
  productCategoryData
} from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

// Calculate dashboard stats
const totalCustomers = mockCustomers.length;
const totalProducts = mockProducts.length;
const totalSales = mockSales.reduce((sum, sale) => sum + sale.total, 0);
const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
const lowStockProducts = mockProducts.filter(product => product.stockQuantity <= product.reorderLevel).length;
const pendingSales = mockSales.filter(sale => sale.paymentStatus === 'pending').length;

// Format numbers as currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Colors for pie chart - updated to use orange to purple gradient
const COLORS = ['#FF8042', '#FFA07A', '#E0115F', '#C71585', '#8B008B', '#9932CC'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  
  // Convert activities to the format needed by the RecentActivityCard
  const recentActivities = mockActivities.map(activity => {
    let icon;
    switch (activity.type) {
      case 'customer':
        icon = <UserPlus className="h-4 w-4 text-primary" />;
        break;
      case 'sale':
        icon = <ShoppingCart className="h-4 w-4 text-secondary" />;
        break;
      case 'product':
        icon = <Package className="h-4 w-4 text-amber-500" />;
        break;
      case 'expense':
        icon = <Wallet className="h-4 w-4 text-red-500" />;
        break;
      default:
        icon = <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
    
    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      timestamp: formatDate(activity.timestamp),
      icon
    };
  });

  return (
    <div className="space-y-6 animate-fade">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Dashboard</h1>
        <Button onClick={() => navigate("/sales/new")} className="btn-gradient">
          New Sale
        </Button>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Customers" 
          value={totalCustomers}
          icon={<Users size={24} />}
          trend={{ value: 12, isPositive: true }}
          onClick={() => navigate("/customers")}
          className="card-hover"
        />
        <StatCard 
          title="Total Products" 
          value={totalProducts}
          icon={<Package size={24} />}
          trend={{ value: 5, isPositive: true }}
          onClick={() => navigate("/inventory")}
          className="card-hover"
        />
        <StatCard 
          title="Total Sales" 
          value={formatCurrency(totalSales)}
          icon={<ShoppingBag size={24} />}
          trend={{ value: 8, isPositive: true }}
          onClick={() => navigate("/sales")}
          className="card-hover"
        />
        <StatCard 
          title="Net Profit" 
          value={formatCurrency(totalSales - totalExpenses)}
          icon={<DollarSign size={24} />}
          trend={{ value: 3, isPositive: true }}
          onClick={() => navigate("/reports")}
          className="card-hover"
        />
      </div>
      
      {/* Alerts */}
      {(lowStockProducts > 0 || pendingSales > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockProducts > 0 && (
            <div className="dashboard-card p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                <p>
                  <span className="font-medium text-amber-500">Inventory Alert:</span>{" "}
                  <span className="text-amber-400">{lowStockProducts} products are low in stock</span>
                </p>
              </div>
            </div>
          )}
          
          {pendingSales > 0 && (
            <div className="dashboard-card p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-primary mr-2" />
                <p>
                  <span className="font-medium text-primary">Payment Alert:</span>{" "}
                  <span className="text-primary/80">{pendingSales} sales with pending payments</span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales chart */}
        <ChartCard 
          title="Sales Overview" 
          className="lg:col-span-2 dashboard-card"
          action={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-background/50 border-border/50">
                  {timeframe === 'week' ? 'Weekly' : timeframe === 'month' ? 'Monthly' : 'Yearly'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border/50">
                <DropdownMenuItem onClick={() => setTimeframe('week')}>Weekly</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeframe('month')}>Monthly</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTimeframe('year')}>Yearly</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        >
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySalesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Sales']}
                  labelFormatter={(label) => `${label}`} 
                />
                <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                  {monthlySalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#barGradient${index})`} />
                  ))}
                </Bar>
                <defs>
                  {monthlySalesData.map((_, index) => (
                    <linearGradient key={`gradient-${index}`} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--secondary))" />
                    </linearGradient>
                  ))}
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        
        {/* Product categories */}
        <ChartCard title="Product Categories" className="dashboard-card">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {productCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
      
      {/* Recent activity */}
      <RecentActivityCard 
        title="Recent Activity" 
        activities={recentActivities} 
        onViewAll={() => console.log("View all activities")}
        className="dashboard-card" 
      />
    </div>
  );
}
