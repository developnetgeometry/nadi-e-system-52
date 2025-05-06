
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
    icon: "layers",
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

// Create the missing menu items that are being imported in menu-groups.ts
export const hrMenuItems: MenuItem[] = [
  {
    title: "Staff Management",
    path: "/hr/staff",
    icon: "users",
    key: "staff-management",
  },
  {
    title: "Attendance",
    path: "/hr/attendance",
    icon: "clock",
    key: "attendance",
  },
  {
    title: "Payroll",
    path: "/hr/payroll",
    icon: "dollarSign",
    key: "payroll",
  },
  {
    title: "HR Settings",
    path: "/hr/settings",
    icon: "settings",
    key: "hr-settings",
  }
]

export const posMenuItems: MenuItem[] = [
  {
    title: "POS Dashboard",
    path: "/pos/dashboard",
    icon: "home",
    key: "pos-dashboard",
  }
]

export const claimItems: MenuItem[] = [
  {
    title: "Claims Dashboard",
    path: "/claim/dashboard",
    icon: "fileText",
    key: "claim-dashboard",
  }
]

export const assetItems: MenuItem[] = [
  {
    title: "Asset Management",
    path: "/asset/dashboard",
    icon: "package",
    key: "asset-dashboard",
  }
]

export const financeItems: MenuItem[] = [
  {
    title: "Finance Dashboard",
    path: "/finance/dashboard",
    icon: "dollarSign",
    key: "finance-dashboard",
  }
]

export const programmesItems: MenuItem[] = [
  {
    title: "Programs",
    path: "/programmes/list",
    icon: "calendar",
    key: "programs-list",
  }
]

export const reportItems: MenuItem[] = [
  {
    title: "Reports",
    path: "/report/dashboard",
    icon: "pieChart",
    key: "reports-dashboard",
  }
]

export const workflowItems: MenuItem[] = [
  {
    title: "Workflows",
    path: "/workflow/dashboard",
    icon: "layers",
    key: "workflow-dashboard",
  }
]

export const memberManagementItems: MenuItem[] = [
  {
    title: "Member Dashboard",
    path: "/member/dashboard",
    icon: "users",
    key: "member-dashboard",
  }
]

export const serviceModuleItems: MenuItem[] = [
  {
    title: "Services",
    path: "/services/dashboard",
    icon: "briefcase",
    key: "services-dashboard",
  }
]

export const communityItems: MenuItem[] = [
  {
    title: "Community",
    path: "/community/dashboard",
    icon: "users",
    key: "community-dashboard",
  }
]

export const financialItems: MenuItem[] = [
  {
    title: "Financial Dashboard",
    path: "/financial/dashboard",
    icon: "dollarSign",
    key: "financial-dashboard",
  }
]

export const complianceItems: MenuItem[] = [
  {
    title: "Compliance",
    path: "/compliance/dashboard",
    icon: "shieldAlert",
    key: "compliance-dashboard",
  }
]

export const siteManagementItems: MenuItem[] = [
  {
    title: "Site Management",
    path: "/site-management/dashboard",
    icon: "building",
    key: "site-management-dashboard",
  }
]

export const inventoryItems: MenuItem[] = [
  {
    title: "Inventory",
    path: "/inventory/dashboard",
    icon: "package",
    key: "inventory-dashboard",
  }
]

export const dashboardItems: MenuItem[] = [
  {
    title: "Main Dashboard",
    path: "/dashboard",
    icon: "home",
    key: "main-dashboard",
  }
]

export const nadiDashboardItems: MenuItem[] = [
  {
    title: "Nadi Dashboard",
    path: "/nadi-dashboard",
    icon: "home",
    key: "nadi-dashboard",
  }
]

export const iotDashboardItems: MenuItem[] = [
  {
    title: "IoT Dashboard",
    path: "/iot-dashboard",
    icon: "activity",
    key: "iot-dashboard",
  }
]

export const announcementsItems: MenuItem[] = [
  {
    title: "Announcements",
    path: "/announcements/dashboard",
    icon: "bell",
    key: "announcements-dashboard",
  }
]

export const takwimItems: MenuItem[] = [
  {
    title: "Takwim",
    path: "/takwim/dashboard",
    icon: "calendar",
    key: "takwim-dashboard",
  }
]
