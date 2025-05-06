
import { LucideIcon } from "lucide-react";
import { Icons } from "@/components/ui/icons";

export interface MenuItem {
  title: string;
  path: string;
  icon?: LucideIcon;
}

export interface MenuGroup {
  label: string;
  route: string;
  items: MenuItem[];
  icon?: LucideIcon;
}

// HR Settings menu items
export const hrSettingsItems: MenuItem[] = [
  {
    title: "HR Settings",
    path: "/dashboard/hr/settings",
    icon: Icons.settings
  }
];

// HR Payroll menu items
export const hrPayrollItems: MenuItem[] = [
  {
    title: "Payroll Dashboard",
    path: "/dashboard/hr/payroll",
    icon: Icons.dollarSign
  }
];

// Add other menu items here as needed
export const homeItems: MenuItem[] = [
  {
    title: "Home",
    path: "/",
    icon: Icons.home
  }
];

export const settingsItems: MenuItem[] = [
  {
    title: "Settings",
    path: "/settings",
    icon: Icons.settings
  }
];

export const profileItems: MenuItem[] = [
  {
    title: "Profile",
    path: "/profile",
    icon: Icons.user
  }
];

// Add the missing menu items
export const menuItems: MenuItem[] = [
  {
    title: "Admin Console",
    path: "/admin",
    icon: Icons.settings
  }
];

export const hrMenuItems: MenuItem[] = [
  {
    title: "HR Dashboard",
    path: "/dashboard/hr",
    icon: Icons.users
  }
];

export const posMenuItems: MenuItem[] = [
  {
    title: "POS Dashboard",
    path: "/dashboard/pos",
    icon: Icons.dollarSign
  }
];

export const claimItems: MenuItem[] = [
  {
    title: "Claims",
    path: "/dashboard/claim",
    icon: Icons.fileText
  }
];

export const assetItems: MenuItem[] = [
  {
    title: "Asset Management",
    path: "/dashboard/asset",
    icon: Icons.package
  }
];

export const financeItems: MenuItem[] = [
  {
    title: "Finance",
    path: "/dashboard/finance",
    icon: Icons.dollarSign
  }
];

export const programmesItems: MenuItem[] = [
  {
    title: "Programmes",
    path: "/dashboard/programmes",
    icon: Icons.calendar
  }
];

export const reportItems: MenuItem[] = [
  {
    title: "Reports",
    path: "/dashboard/reports",
    icon: Icons.fileText
  }
];

export const workflowItems: MenuItem[] = [
  {
    title: "Workflow",
    path: "/dashboard/workflow",
    icon: Icons.layers
  }
];

export const memberManagementItems: MenuItem[] = [
  {
    title: "Member Management",
    path: "/dashboard/members",
    icon: Icons.users
  }
];

export const serviceModuleItems: MenuItem[] = [
  {
    title: "Services",
    path: "/dashboard/services",
    icon: Icons.activity
  }
];

export const communityItems: MenuItem[] = [
  {
    title: "Community",
    path: "/dashboard/community",
    icon: Icons.users
  }
];

export const financialItems: MenuItem[] = [
  {
    title: "Financial",
    path: "/dashboard/financial",
    icon: Icons.dollarSign
  }
];

export const complianceItems: MenuItem[] = [
  {
    title: "Compliance",
    path: "/dashboard/compliance",
    icon: Icons.shieldAlert
  }
];

export const siteManagementItems: MenuItem[] = [
  {
    title: "Site Management",
    path: "/dashboard/site",
    icon: Icons.building
  }
];

export const inventoryItems: MenuItem[] = [
  {
    title: "Inventory",
    path: "/dashboard/inventory",
    icon: Icons.package
  }
];

export const dashboardItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: Icons.pieChart
  }
];

export const nadiDashboardItems: MenuItem[] = [
  {
    title: "Nadi Dashboard",
    path: "/nadi-dashboard",
    icon: Icons.pieChart
  }
];

export const iotDashboardItems: MenuItem[] = [
  {
    title: "IoT Dashboard",
    path: "/iot-dashboard",
    icon: Icons.activity
  }
];

export const announcementsItems: MenuItem[] = [
  {
    title: "Announcements",
    path: "/dashboard/announcements",
    icon: Icons.bell
  }
];

export const takwimItems: MenuItem[] = [
  {
    title: "Takwim",
    path: "/dashboard/takwim",
    icon: Icons.calendar
  }
];
