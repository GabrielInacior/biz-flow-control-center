
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function ChartCard({ title, children, className, action }: ChartCardProps) {
  return (
    <Card className={cn("overflow-hidden bg-card/60 backdrop-blur-sm border border-border/40", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/20">
        <CardTitle className="text-base font-medium gradient-text">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="pt-4">
        {children}
      </CardContent>
    </Card>
  );
}
