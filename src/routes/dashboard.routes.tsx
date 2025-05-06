
import { lazy, Suspense } from "react";
import UnderDevelopment from "@/pages/UnderDevelopment";
import { Settings as SettingsIcon } from "lucide-react";

const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Settings = lazy(() => import("@/pages/dashboard/Settings"));
const HRDashboard = lazy(() => import("@/pages/dashboard/hr/HRDashboard"));
const HRSettings = lazy(() => import("@/pages/dashboard/hr/HRSettings"));
const Employees = lazy(() => import("@/pages/dashboard/hr/Employees"));
const Leave = lazy(() => import("@/pages/dashboard/hr/Leave"));
const SiteStaff = lazy(() => import("@/pages/dashboard/hr/SiteStaff"));
const Attendance = lazy(() => import("@/pages/dashboard/hr/Attendance"));
const Payroll = lazy(() => import("@/pages/dashboard/hr/Payroll"));
const Organizations = lazy(() => import("@/pages/dashboard/Organizations"));
const OrganizationDetails = lazy(() => import("@/pages/dashboard/OrganizationDetails"));
const Users = lazy(() => import("@/pages/dashboard/Users"));
const UserGroups = lazy(() => import("@/pages/dashboard/UserGroups"));
const AccessControl = lazy(() => import("@/pages/dashboard/AccessControl"));
const Roles = lazy(() => import("@/pages/dashboard/Roles"));
const RoleConfig = lazy(() => import("@/pages/dashboard/RoleConfig"));
const Permissions = lazy(() => import("@/pages/dashboard/Permissions"));
const MenuVisibility = lazy(() => import("@/pages/dashboard/MenuVisibility"));
const LookupSettings = lazy(() => import("@/pages/dashboard/LookupSettings"));
const StateHolidays = lazy(() => import("@/pages/dashboard/StateHolidays"));
const Activity = lazy(() => import("@/pages/dashboard/Activity"));
const Announcements = lazy(() => import("@/pages/dashboard/Announcements"));
const NotificationManagement = lazy(
  () => import("@/pages/dashboard/NotificationManagement")
);
const Notifications = lazy(() => import("@/pages/dashboard/Notifications"));
const NotificationUsage = lazy(() => import("@/pages/dashboard/NotificationUsage"));
const Profile = lazy(() => import("@/pages/dashboard/profile/UserProfile"));
const SiteManagement = lazy(() => import("@/pages/dashboard/site/SiteManagement"));
const Site = lazy(() => import("@/pages/dashboard/site/Site"));
const NADIClosure = lazy(() => import("@/pages/dashboard/site/NADIClosure"));

// Define the dashboard routes
export const dashboardRoutes = [
  {
    path: "/admin/dashboard",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "/admin/settings",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Settings />
      </Suspense>
    ),
  },
  {
    path: "/hr",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <HRDashboard />
      </Suspense>
    ),
  },
  {
    path: "/hr/settings",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <HRSettings />
      </Suspense>
    ),
  },
  {
    path: "/hr/employees",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Employees />
      </Suspense>
    ),
  },
  {
    path: "/hr/leave",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Leave />
      </Suspense>
    ),
  },
  {
    path: "/hr/site-staff",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <SiteStaff />
      </Suspense>
    ),
  },
  {
    path: "/hr/attendance",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Attendance />
      </Suspense>
    ),
  },
  {
    path: "/hr/payroll",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Payroll />
      </Suspense>
    ),
  },
  {
    path: "/hr/staff-training",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <UnderDevelopment />
      </Suspense>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Users />
      </Suspense>
    ),
  },
  {
    path: "/admin/user-groups",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <UserGroups />
      </Suspense>
    ),
  },
  {
    path: "/admin/roles",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Roles />
      </Suspense>
    ),
  },
  {
    path: "/admin/roles/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <RoleConfig />
      </Suspense>
    ),
  },
  {
    path: "/admin/menu-visibility",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <MenuVisibility />
      </Suspense>
    ),
  },
  {
    path: "/admin/permissions",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Permissions />
      </Suspense>
    ),
  },
  {
    path: "/admin/activity",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Activity />
      </Suspense>
    ),
  },
  {
    path: "/admin/access-control",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AccessControl />
      </Suspense>
    ),
  },
  {
    path: "/admin/lookup-settings",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LookupSettings />
      </Suspense>
    ),
  },
  {
    path: "/admin/state-holidays",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <StateHolidays />
      </Suspense>
    ),
  },
  {
    path: "/admin/announcements",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Announcements />
      </Suspense>
    ),
  },
  {
    path: "/admin/notification-management",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <NotificationManagement />
      </Suspense>
    ),
  },
  {
    path: "/admin/notification-usage",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <NotificationUsage />
      </Suspense>
    ),
  },
  {
    path: "/admin/notifications",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Notifications />
      </Suspense>
    ),
  },
  {
    path: "/admin/organizations",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Organizations />
      </Suspense>
    ),
  },
  {
    path: "/admin/profile",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Profile />
      </Suspense>
    ),
  },
  {
    path: "/site-management",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <SiteManagement />
      </Suspense>
    ),
  },
  {
    path: "/site",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Site />
      </Suspense>
    ),
  },
  {
    path: "/site/closure",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <NADIClosure />
      </Suspense>
    ),
  },
];
