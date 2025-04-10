
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon?: ReactNode;
}

interface RecentActivityCardProps {
  title: string;
  activities: ActivityItem[];
  className?: string;
  onViewAll?: () => void;
}

export function RecentActivityCard({ 
  title, 
  activities, 
  className,
  onViewAll 
}: RecentActivityCardProps) {
  return (
    <Card className={cn("overflow-hidden bg-card/60 backdrop-blur-sm border border-border/40", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/20">
        <CardTitle className="text-base font-medium gradient-text">{title}</CardTitle>
        {onViewAll && (
          <Button variant="link" size="sm" onClick={onViewAll} className="text-primary hover:text-primary/80">
            View all
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 animate-fade hover:bg-muted/10 p-2 rounded-md transition-colors">
              {activity.icon && (
                <div className="mt-1 bg-background/80 rounded-full p-1.5">
                  {activity.icon}
                </div>
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                No recent activities
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
