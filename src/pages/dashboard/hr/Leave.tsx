import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useUserAccess } from "@/hooks/use-user-access";
import { StaffLeaveManagement } from "@/components/hr/leave/StaffLeaveManagement";
import { AdminLeaveManagement } from "@/components/hr/leave/AdminLeaveManagement";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function LeaveManagement() {
  const { userType, accessChecked } = useUserAccess();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (accessChecked) {
      setIsLoading(false);
    }
  }, [accessChecked]);

  const isStaffView =
    userType === "staff_manager" || userType === "staff_assistant_manager";

  if (isLoading) {
    return (
      <div>
        <div className="space-y-1">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div>
      {isStaffView ? <StaffLeaveManagement /> : <AdminLeaveManagement />}
    </div>
  );
}
