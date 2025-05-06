
import {
  Home,
  User,
  Settings,
  Package,
  Store,
  Activity,
  Users,
  FileText,
  Calendar,
  Clock,
  LogOut,
  Layers,
  DollarSign,
  Bell,
  PieChart,
  ShieldAlert,
  Search,
  HelpCircle,
  Menu,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Plus,
  Trash,
  Pencil,
  Save,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building,
  Folder,
  Upload,
  ChevronLeft,
  Download
} from "lucide-react";

export type IconKey =
  | "home"
  | "user"
  | "users"
  | "settings"
  | "package"
  | "packageIcon"
  | "store"
  | "activity"
  | "fileText"
  | "calendar"
  | "clock"
  | "logOut"
  | "layers"
  | "dollarSign"
  | "bell"
  | "pieChart"
  | "shieldAlert"
  | "search"
  | "helpCircle"
  | "menu"
  | "close"
  | "check"
  | "chevronDown"
  | "chevronRight"
  | "chevronLeft"
  | "chevronsUpDown"
  | "plus"
  | "trash"
  | "pencil"
  | "save"
  | "mail"
  | "phone"
  | "mapPin"
  | "briefcase"
  | "building"
  | "folder"
  | "upload"
  | "download"
  | "spinner";

export const Icons = {
  home: Home,
  user: User,
  users: Users,
  settings: Settings,
  package: Package,
  packageIcon: Package,
  store: Store,
  activity: Activity,
  fileText: FileText,
  calendar: Calendar,
  clock: Clock,
  logOut: LogOut,
  layers: Layers,
  dollarSign: DollarSign,
  bell: Bell,
  pieChart: PieChart,
  shieldAlert: ShieldAlert,
  search: Search,
  helpCircle: HelpCircle,
  menu: Menu,
  close: X,
  check: Check,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronsUpDown: ChevronsUpDown,
  plus: Plus,
  trash: Trash,
  pencil: Pencil,
  save: Save,
  mail: Mail,
  phone: Phone,
  mapPin: MapPin,
  briefcase: Briefcase,
  building: Building,
  folder: Folder,
  upload: Upload,
  download: Download,
  // Add a custom spinner that uses the same interface as Lucide icons
  spinner: (props: any) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="animate-spin"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};
