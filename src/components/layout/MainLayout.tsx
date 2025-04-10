
import { ReactNode, useState, useEffect } from "react";
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  ReceiptText,
  BarChart, 
  MessageCircle, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Menu
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type NavItem = {
  name: string;
  path: string;
  icon: React.ElementType;
};

const navigation: NavItem[] = [
  { name: "Dashboard", path: "/", icon: BarChart3 },
  { name: "Customers", path: "/customers", icon: Users },
  { name: "Inventory", path: "/inventory", icon: Package },
  { name: "Sales", path: "/sales", icon: ShoppingCart },
  { name: "Expenses", path: "/expenses", icon: ReceiptText },
  { name: "Reports", path: "/reports", icon: BarChart },
  { name: "Support", path: "/support", icon: MessageCircle },
  { name: "Settings", path: "/settings", icon: Settings },
];

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);
  
  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header for mobile */}
      <header className="lg:hidden bg-card/50 backdrop-blur-sm shadow-sm py-4 px-4 border-b border-muted">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-foreground"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="ml-3 text-xl font-bold gradient-text">
              BizManager
            </h1>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "bg-sidebar text-sidebar-foreground flex-shrink-0 border-r border-sidebar-border transition-all duration-300 ease-in-out z-30",
            sidebarOpen 
              ? "w-64 translate-x-0" 
              : "w-0 -translate-x-full lg:w-20 lg:translate-x-0",
            isMobile && sidebarOpen ? "fixed inset-y-0 left-0 h-full" : ""
          )}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar header */}
            <div className={cn(
              "flex items-center justify-between h-16 px-4",
              !sidebarOpen && "lg:justify-center"
            )}>
              {sidebarOpen && (
                <h1 className="text-xl font-bold gradient-text">BizManager</h1>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <ChevronLeft className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Sidebar navigation */}
            <nav className="flex-1 py-4 px-2">
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.name}>
                      <Link to={item.path}>
                        <div
                          className={cn(
                            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            isActive
                              ? "bg-gradient-to-r from-primary to-secondary text-white"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
                          )}
                        >
                          <item.icon className={cn(
                            "h-5 w-5 mr-3 flex-shrink-0",
                            !sidebarOpen && "lg:mr-0"
                          )} />
                          {sidebarOpen && <span>{item.name}</span>}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* User profile at bottom */}
            <div className={cn(
              "border-t border-sidebar-border p-4",
              !sidebarOpen && "lg:flex lg:justify-center"
            )}>
              {sidebarOpen ? (
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white">
                    A
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">Admin User</p>
                    <p className="text-xs text-gray-300">admin@bizmanager.com</p>
                  </div>
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white">
                  A
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container py-6 px-4 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
