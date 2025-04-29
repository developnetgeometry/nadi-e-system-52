
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DynamicDashboard } from "@/components/dashboard/DynamicDashboard";
import { DashboardAnnouncements } from "@/components/dashboard/DashboardAnnouncements";
import { AnnouncementSimpleView } from "@/components/announcements/AnnouncementSimpleView";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error/ErrorFallback";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {/* Original Announcement component */}
        {/* <DashboardAnnouncements /> */}
        
        {/* Simple Announcement View */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Announcements</h2>
          <AnnouncementSimpleView />
        </div>
        
        <DynamicDashboard />
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default Dashboard;
