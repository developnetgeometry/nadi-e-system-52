
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUserAccess } from "@/hooks/use-user-access";
import { StaffLeaveManagement } from "@/components/hr/leave/StaffLeaveManagement";
import { AdminLeaveManagement } from "@/components/hr/leave/AdminLeaveManagement";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useUserGroup } from "@/hooks/use-user-group";

export default function LeaveManagement() {
  const { userType, accessChecked } = useUserAccess();
  const { groupName } = useUserGroup();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (accessChecked) {
      setIsLoading(false);
    }
  }, [accessChecked]);

  // Update to include tp_site user type and site user group
  const isStaffView = userType === "staff_manager" || 
                     userType === "staff_assistant_manager" ||
                     userType === "tp_site" || 
                     groupName === "site";

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-4">
        {isStaffView ? <StaffLeaveManagement /> : <AdminLeaveManagement />}
      </div>
    </DashboardLayout>
  );
}
