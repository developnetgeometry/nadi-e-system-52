
import { lazy } from "react";
import Dashboard from "@/pages/dashboard/Dashboard";
import Users from "@/pages/dashboard/Users";
import UserGroups from "@/pages/dashboard/UserGroups";
import Roles from "@/pages/dashboard/RoleConfig";
import Settings from "@/pages/dashboard/Settings";
import MenuVisibility from "@/pages/dashboard/MenuVisibility";
import Permissions from "@/pages/dashboard/Permissions";
import Reports from "@/pages/dashboard/Reports";
import StateHolidays from "@/pages/dashboard/StateHolidays";
import Activity from "@/pages/dashboard/Activity";
import Organizations from "@/pages/dashboard/Organizations";
import Notifications from "@/pages/dashboard/Notifications";
import NotificationManagement from "@/pages/dashboard/NotificationManagement";
import NotificationUsage from "@/pages/dashboard/NotificationUsage";
import Calendar from "@/pages/dashboard/Calendar";
import Profile from "@/pages/dashboard/Profile";
import UsageSessions from "@/pages/dashboard/UsageSessions";
import LookupSettings from "@/pages/dashboard/LookupSettings";
import WorkflowDashboard from "@/pages/dashboard/workflow/WorkflowDashboard";
import WorkflowConfiguration from "@/pages/dashboard/workflow/WorkflowConfiguration";
import FinanceDashboard from "@/pages/dashboard/finance/FinanceDashboard";
import FinanceSettings from "@/pages/dashboard/finance/FinanceSettings";
import NADIClosure from "@/pages/dashboard/site/NADIClosure";
import AccessControl from "@/pages/dashboard/access-control";
import HRDashboard from "@/pages/dashboard/hr/HRDashboard";
import HRSettings from "@/pages/dashboard/hr/HRSettings";
import Employees from "@/pages/dashboard/hr/Employees";
import SiteStaff from "@/pages/dashboard/hr/SiteStaff";
import StaffDetail from "@/pages/dashboard/hr/StaffDetail";
import StaffEdit from "@/pages/dashboard/hr/StaffEdit";
import StaffTraining from "@/pages/dashboard/hr/StaffTraining";
import Attendance from "@/pages/dashboard/hr/Attendance";
import Payroll from "@/pages/dashboard/hr/Payroll";
import LeaveManagement from "@/pages/dashboard/hr/LeaveManagement";

export const dashboardRoutes = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/dashboard/users",
    element: <Users />,
  },
  {
    path: "/dashboard/user-groups",
    element: <UserGroups />,
  },
  {
    path: "/dashboard/roles",
    element: <Roles />,
  },
  {
    path: "/dashboard/permissions",
    element: <Permissions />,
  },
  {
    path: "/dashboard/reports",
    element: <Reports />,
  },
  {
    path: "/dashboard/holidays",
    element: <StateHolidays />,
  },
  {
    path: "/dashboard/activity",
    element: <Activity />,
  },
  {
    path: "/dashboard/organizations",
    element: <Organizations />,
  },
  {
    path: "/dashboard/notifications",
    element: <Notifications />,
  },
  {
    path: "/dashboard/notification-management",
    element: <NotificationManagement />,
  },
  {
    path: "/dashboard/notification-usage",
    element: <NotificationUsage />,
  },
  {
    path: "/dashboard/calendar",
    element: <Calendar />,
  },
  {
    path: "/dashboard/profile",
    element: <Profile />,
  },
  {
    path: "/dashboard/settings",
    element: <Settings />,
  },
  {
    path: "/dashboard/menu-visibility",
    element: <MenuVisibility />,
  },
  {
    path: "/dashboard/usage-sessions",
    element: <UsageSessions />,
  },
  {
    path: "/dashboard/lookup-settings",
    element: <LookupSettings />,
  },
  {
    path: "/dashboard/nadi-closure",
    element: <NADIClosure />,
  },
  {
    path: "/dashboard/access-control",
    element: <AccessControl />,
  },
  // Workflow Routes
  {
    path: "/dashboard/workflow",
    element: <WorkflowDashboard />,
  },
  {
    path: "/dashboard/workflow/configuration",
    element: <WorkflowConfiguration />,
  },
  // Finance Routes
  {
    path: "/dashboard/finance",
    element: <FinanceDashboard />,
  },
  {
    path: "/dashboard/finance/settings",
    element: <FinanceSettings />,
  },
  // HR Routes
  {
    path: "/dashboard/hr",
    element: <HRDashboard />,
  },
  {
    path: "/dashboard/hr/settings",
    element: <HRSettings />,
  },
  {
    path: "/dashboard/hr/employees",
    element: <Employees />,
  },
  {
    path: "/dashboard/hr/site-staff",
    element: <SiteStaff />,
  },
  {
    path: "/dashboard/hr/staff/:id",
    element: <StaffDetail />,
  },
  {
    path: "/dashboard/hr/staff/:id/edit",
    element: <StaffEdit />,
  },
  {
    path: "/dashboard/hr/staff-training",
    element: <StaffTraining />,
  },
  {
    path: "/dashboard/hr/attendance",
    element: <Attendance />,
  },
  {
    path: "/dashboard/hr/payroll",
    element: <Payroll />,
  },
  {
    path: "/dashboard/hr/leave",
    element: <LeaveManagement />,
  },
];
