
import { ReactNode } from "react";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import UserManagement from "@/pages/dashboard/UserManagement";
import RolesPermissions from "@/pages/dashboard/RolesPermissions";
import UserGroups from "@/pages/dashboard/UserGroups";
import ActivityLog from "@/pages/dashboard/ActivityLog";
import Organizations from "@/pages/dashboard/Organizations";
import MenuVisibility from "@/pages/dashboard/MenuVisibility";
import StateHolidays from "@/pages/dashboard/StateHolidays";
import Settings from "@/pages/dashboard/Settings";
import Announcements from "@/pages/dashboard/Announcements";
import NotificationManagement from "@/pages/dashboard/NotificationManagement";
import Notifications from "@/pages/dashboard/Notifications";

export interface DashboardRoutes {
  path: string;
  element: ReactNode;
}

export const dashboardRoutes: DashboardRoutes[] = [
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/users",
    element: <UserManagement />,
  },
  {
    path: "/admin/user-groups",
    element: <UserGroups />,
  },
  {
    path: "/admin/roles",
    element: <RolesPermissions />,
  },
  {
    path: "/admin/activity",
    element: <ActivityLog />,
  },
  {
    path: "/admin/organizations",
    element: <Organizations />,
  },
  {
    path: "/admin/menu-visibility",
    element: <MenuVisibility />,
  },
  {
    path: "/admin/state-holidays",
    element: <StateHolidays />,
  },
  {
    path: "/admin/settings",
    element: <Settings />,
  },
  {
    path: "/admin/announcements",
    element: <Announcements />,
  },
  {
    path: "/admin/notifications",
    element: <Notifications />,
  },
  {
    path: "/admin/notification-management",
    element: <NotificationManagement />,
  },
];
