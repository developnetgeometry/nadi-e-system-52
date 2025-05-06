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
