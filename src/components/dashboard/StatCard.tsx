
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  className,
  onClick
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        "stat-card overflow-hidden bg-card/60 backdrop-blur-sm border border-border/40", 
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="stat-label">{title}</p>
          <p className="stat-value gradient-text">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs font-medium flex items-center",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                <span className="ml-1 text-muted-foreground">
                  from last period
                </span>
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="text-primary dark:text-primary">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
