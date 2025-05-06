
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  colorVariant?: "default" | "success" | "warning" | "danger";
}

export function StatCard({ title, value, subValue, colorVariant = "default" }: StatCardProps) {
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
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subValue && (
          <p className={`text-xs mt-1 ${getColorClass()}`}>{subValue}</p>
        )}
      </CardContent>
    </Card>
  );
}
