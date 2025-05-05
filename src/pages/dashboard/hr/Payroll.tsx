
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useUserAccess } from "@/hooks/use-user-access";
import { SuperAdminPage } from "@/components/hr/payroll/SuperAdminPage";
import { MCMCPage } from "@/components/hr/payroll/MCMCPage";
import { DUSPPage } from "@/components/hr/payroll/DUSPPage";
import { TPPage } from "@/components/hr/payroll/TPPage";
import { StaffPage } from "@/components/hr/payroll/StaffPage";
import { useState, useEffect } from "react";
import { UserType } from "@/types/auth"; // Import UserType from auth types

export default function PayrollPage() {
  const { userType, isSuperAdmin, accessChecked } = useUserAccess(); // Use the hook to get user type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessChecked) {
      setLoading(false);
    }
  }, [accessChecked]);

  // Render the appropriate dashboard based on user type
  const renderDashboard = () => {
    // Add console.log to debug user type
    console.log("Current user type for payroll:", userType);

    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Check user type and return appropriate component
    if (isSuperAdmin || userType === "super_admin") {
      return <SuperAdminPage />;
    } else if (userType === "mcmc_admin" || userType === "mcmc_operation" || userType === "mcmc_management" || userType === "2") {
      return <MCMCPage />;
    } else if (userType === "dusp_admin" || userType === "dusp_management" || userType === "dusp_operation" || userType === "1") {
      return <DUSPPage />;
    } else if (
      userType === "tp_operation" || 
      userType === "tp_admin" || 
      userType === "tp_hr" || 
      userType === "tp_pic" || 
      userType === "tp_site" || 
      userType === "tp_region" || 
      userType === "tp_finance" || 
      userType === "3"
    ) {
      return <TPPage />;
    } else if (
      userType === "staff_manager" || 
      userType === "staff_assistant_manager" || 
      userType === "6"
    ) {
      return <StaffPage />;
    } else {
      // Default to a message for unknown user types
      return (
        <div className="p-8">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
            <h3 className="font-bold">Unknown User Type</h3>
            <p>Your user type ({userType || "not set"}) does not have access to the payroll system.</p>
            <p>Please contact an administrator for assistance.</p>
          </div>
        </div>
      );
    }
  };

  return <DashboardLayout>{renderDashboard()}</DashboardLayout>;
}
