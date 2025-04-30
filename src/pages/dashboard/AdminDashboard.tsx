
import { DynamicDashboard } from "@/components/dashboard/DynamicDashboard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <DynamicDashboard />
    </DashboardLayout>
  );
};

export default AdminDashboard;
