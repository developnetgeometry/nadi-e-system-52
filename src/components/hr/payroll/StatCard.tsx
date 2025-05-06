
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  colorVariant?: "default" | "success" | "warning" | "danger";
  icon?: React.ReactElement;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ 
  title, 
  value, 
  subValue, 
  colorVariant = "default",
  icon,
  trend
}: StatCardProps) {
  const getColorClass = () => {
    switch (colorVariant) {
      case "success":
        return "text-green-600";
      case "warning":
        return "text-amber-600";
      case "danger":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex items-start justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="p-2 rounded-md bg-muted">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subValue && (
          <p className={`text-xs mt-1 ${getColorClass()}`}>{subValue}</p>
        )}
        {trend && (
          <div className={`flex items-center mt-1 text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}
