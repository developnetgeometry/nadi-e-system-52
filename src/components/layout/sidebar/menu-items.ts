import { Icons } from "@/components/ui/icons"

export type MenuItem = {
  title: string
  path?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  key: string
  permission?: string
  items?: MenuItem[]
}

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: "home",
    key: "dashboard",
  },
  {
    title: "Sites",
    path: "/dashboard/sites",
    icon: "store",
    key: "sites",
    permission: "view_sites",
  },
  {
    title: "Assets",
    path: "/dashboard/assets",
    icon: "packageIcon",
    key: "assets",
    permission: "view_assets",
  },
  {
    title: "Users",
    path: "/dashboard/users",
    icon: "users",
    key: "users",
    permission: "view_users",
  },
  {
    title: "Roles & Permissions",
    path: "/dashboard/roles",
    icon: "settings",
    key: "roles",
    permission: "view_roles",
  },
  {
    title: "Audit Trail",
    path: "/dashboard/audit-trail",
    icon: "activity",
    key: "audit-trail",
    permission: "view_audit_trail",
  },
  {
    title: "Utilities",
    path: "/dashboard/utilities",
    icon: "folder",
    key: "utilities",
    permission: "view_utilities",
  },
  {
    title: "Profile",
    path: "/dashboard/profile",
    icon: "user",
    key: "profile",
  },
  {
    title: "Settings",
    path: "/dashboard/settings",
    icon: "settings",
    key: "settings",
    permission: "view_settings",
  },
  {
    title: "Holidays",
    path: "/dashboard/holidays",
    icon: "calendar",
    key: "holidays",
  },
  {
    title: "Human Resources",
    key: "hr",
    icon: "users",
    items: [
      {
        title: "Staff Management",
        path: "/dashboard/hr/staff",
        key: "staff-management",
        permission: "view_staff",
      },
      {
        title: "Attendance",
        path: "/dashboard/hr/attendance",
        key: "attendance",
        permission: "view_attendance",
      },
      {
        title: "Payroll",
        path: "/dashboard/hr/payroll",
        key: "payroll",
        permission: "view_payroll",
      },
      {
        title: "HR Settings",
        path: "/dashboard/hr/settings",
        key: "hr-settings",
        permission: "manage_settings",
      },
    ],
  },
]

export const siteMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: "home",
    key: "dashboard",
  },
  {
    title: "Profile",
    path: "/dashboard/profile",
    icon: "user",
    key: "profile",
  },
  {
    title: "Settings",
    path: "/dashboard/settings",
    icon: "settings",
    key: "settings",
    permission: "view_settings",
  },
]
