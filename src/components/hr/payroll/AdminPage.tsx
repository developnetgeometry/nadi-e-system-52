
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/hr/payroll/StatCard";
import { Icons } from "@/components/ui/icons";

export const AdminPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Payroll Dashboard - Admin View</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Staff" 
            value="124" 
            subValue="Active employees"
          />
          <StatCard 
            title="Monthly Payroll" 
            value="RM 452,800" 
            subValue="+2.4% from last month"
            colorVariant="success"
          />
          <StatCard 
            title="Average Salary" 
            value="RM 3,650" 
            subValue="Per employee"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payroll Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No recent payroll activities to display.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Staff Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Staff distribution visualization will appear here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPage;
