
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
  LucideProps,
  Building,
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
  | "chevronsUpDown"
  | "plus"
  | "trash"
  | "pencil"
  | "save"
  | "mail"
  | "phone"
  | "mapPin"
  | "briefcase"
  | "building";

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
} as Record<IconKey, React.ComponentType<LucideProps>>;
