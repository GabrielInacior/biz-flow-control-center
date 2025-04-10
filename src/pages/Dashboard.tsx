
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

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  
  // Convert activities to the format needed by the RecentActivityCard
  const recentActivities = mockActivities.map(activity => {
    let icon;
    switch (activity.type) {
      case 'customer':
        icon = <UserPlus className="h-4 w-4 text-bizblue-500" />;
        break;
      case 'sale':
        icon = <ShoppingCart className="h-4 w-4 text-bizteal-500" />;
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => navigate("/sales/new")} className="bg-bizteal-500 hover:bg-bizteal-600">
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
        />
        <StatCard 
          title="Total Products" 
          value={totalProducts}
          icon={<Package size={24} />}
          trend={{ value: 5, isPositive: true }}
          onClick={() => navigate("/inventory")}
        />
        <StatCard 
          title="Total Sales" 
          value={formatCurrency(totalSales)}
          icon={<ShoppingBag size={24} />}
          trend={{ value: 8, isPositive: true }}
          onClick={() => navigate("/sales")}
        />
        <StatCard 
          title="Net Profit" 
          value={formatCurrency(totalSales - totalExpenses)}
          icon={<DollarSign size={24} />}
          trend={{ value: 3, isPositive: true }}
          onClick={() => navigate("/reports")}
        />
      </div>
      
      {/* Alerts */}
      {(lowStockProducts > 0 || pendingSales > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockProducts > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                <p>
                  <span className="font-medium text-amber-800">Inventory Alert:</span>{" "}
                  <span className="text-amber-700">{lowStockProducts} products are low in stock</span>
                </p>
              </div>
            </div>
          )}
          
          {pendingSales > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                <p>
                  <span className="font-medium text-blue-800">Payment Alert:</span>{" "}
                  <span className="text-blue-700">{pendingSales} sales with pending payments</span>
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
          className="lg:col-span-2"
          action={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {timeframe === 'week' ? 'Weekly' : timeframe === 'month' ? 'Monthly' : 'Yearly'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
                <Bar dataKey="sales" fill="#0c92e8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        
        {/* Product categories */}
        <ChartCard title="Product Categories">
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
      />
    </div>
  );
}
