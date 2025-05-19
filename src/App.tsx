import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAppSettings } from "@/hooks/use-app-settings";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error/ErrorFallback";

// Auth Pages
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"));

// Dashboard Pages
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Profile = lazy(() => import("@/pages/dashboard/Profile"));
const Settings = lazy(() => import("@/pages/dashboard/Settings"));
const Users = lazy(() => import("@/pages/dashboard/Users"));
const Announcements = lazy(() => import("@/pages/dashboard/Announcements"));
const ProgrammesDashboard = lazy(() => import("@/pages/dashboard/programmes/ProgrammesDashboard"));
const ProgrammeRegistration = lazy(() => import("@/pages/dashboard/programmes/ProgrammeRegistration"));

// Error Pages
const NotFound = lazy(() => import("@/pages/error/NotFound"));
const Unauthorized = lazy(() => import("@/pages/error/Unauthorized"));

// Demo Pages
const DemoComponents = lazy(() => import("@/pages/demo/DemoComponents"));
const DemoForms = lazy(() => import("@/pages/demo/DemoForms"));
const DemoTables = lazy(() => import("@/pages/demo/DemoTables"));
const DemoCharts = lazy(() => import("@/pages/demo/DemoCharts"));
const DemoMaps = lazy(() => import("@/pages/demo/DemoMaps"));
const DemoCalendar = lazy(() => import("@/pages/demo/DemoCalendar"));
const DemoKanban = lazy(() => import("@/pages/demo/DemoKanban"));
const DemoEditor = lazy(() => import("@/pages/demo/DemoEditor"));
const DemoUpload = lazy(() => import("@/pages/demo/DemoUpload"));
const DemoNotifications = lazy(() => import("@/pages/demo/DemoNotifications"));
const DemoAnnouncementSettings = lazy(() => import("@/pages/demo/DemoAnnouncementSettings"));

// Site Management
const SiteManagementDashboard = lazy(() => import("@/pages/dashboard/main-dashboard/SiteManagementDashboard"));

function App() {
  const { isInitialized, isAuthenticated } = useAuth();
  const { fetchSettings } = useAppSettings();

  useEffect(() => {
    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated, fetchSettings]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <SidebarProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/announcements/list" element={<Announcements />} />
                <Route path="/programmes" element={<ProgrammesDashboard />} />
                <Route path="/programmes/register" element={<ProgrammeRegistration />} />
                <Route path="/site-management" element={<SiteManagementDashboard />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/users" element={<Users />} />
              </Route>

              {/* Demo Routes */}
              <Route path="/demo/components" element={<DemoComponents />} />
              <Route path="/demo/forms" element={<DemoForms />} />
              <Route path="/demo/tables" element={<DemoTables />} />
              <Route path="/demo/charts" element={<DemoCharts />} />
              <Route path="/demo/maps" element={<DemoMaps />} />
              <Route path="/demo/calendar" element={<DemoCalendar />} />
              <Route path="/demo/kanban" element={<DemoKanban />} />
              <Route path="/demo/editor" element={<DemoEditor />} />
              <Route path="/demo/upload" element={<DemoUpload />} />
              <Route path="/demo/notifications" element={<DemoNotifications />} />
              <Route path="/demo/announcement-settings" element={<DemoAnnouncementSettings />} />

              {/* Error Routes */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/404" element={<NotFound />} />

              {/* Redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </SidebarProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
