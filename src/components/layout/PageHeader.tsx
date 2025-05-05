
import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function PageHeader({ 
  title, 
  description, 
  className, 
  ...props 
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)} {...props}>
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
}
