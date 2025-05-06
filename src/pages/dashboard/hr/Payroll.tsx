
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/user";
import { SuperAdminPage } from "@/components/hr/payroll/SuperAdminPage";
import { AdminPage } from "@/components/hr/payroll/AdminPage";

export default function Payroll() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        // For demo purposes, we'll just set a default role
        // In production, you would fetch the actual role from your backend
        setUserRole(UserRole.SUPER_ADMIN);
      } catch (error) {
        console.error("Error checking user role:", error);
        toast({
          title: "Error",
          description: "Failed to determine user role",
          variant: "destructive"
        });
      }
    };
    
    if (user) {
      checkUserRole();
    }
  }, [user, toast]);
  
  // Show different views based on user role
  if (userRole === UserRole.SUPER_ADMIN) {
    return <SuperAdminPage />;
  }
  
  if (userRole === UserRole.ADMIN || userRole === UserRole.MANAGER) {
    return <AdminPage />;
  }
  
  // Default view for staff
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Payroll</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>My Payslips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You can view and download your payslips here
              </p>
              <Button>View Latest Payslip</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
