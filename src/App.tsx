import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import Landing from "@/pages/Landing";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import MemberLogin from "@/pages/auth/MemberLogin";
import { dashboardRoutes, DashboardRoutes } from "@/routes/dashboard.routes";
import { memberRoutes } from "@/routes/module.member.routes";
import { moduleRoutes } from "@/routes/module.routes";
import UIComponents from "@/pages/UIComponents";
import OrganizationDetails from "@/pages/dashboard/OrganizationDetails";
import NotFound from "@/pages/NotFound";
import UnderDevelopment from "@/pages/UnderDevelopment";
import NoAccess from "@/pages/NoAccess";

// Import example pages
import HomeExample from "@/pages/examples/HomeExample";
import DetailExample from "@/pages/examples/DetailExample";
import SettingsExample from "@/pages/examples/SettingsExample";
import Announcements from "@/pages/dashboard/Announcements";
import AnnouncementSettings from "@/pages/dashboard/AnnouncementSettings";
import CreateAnnouncement from "@/pages/demo/CreateAnnouncement";
import Takwim from "@/pages/dashboard/Takwim";
import Notifications from "@/pages/dashboard/Notifications";

// Import HR pages
import Employees from "@/pages/dashboard/hr/Employees";
import SiteStaff from "@/pages/dashboard/hr/SiteStaff";
import StaffDetail from "@/pages/dashboard/hr/StaffDetail";
import StaffEdit from "@/pages/dashboard/hr/StaffEdit";

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/member-login" element={<MemberLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/ui-components" element={<UIComponents />} />

              <Route path="/examples/home" element={<HomeExample />} />
              <Route path="/examples/detail" element={<DetailExample />} />
              <Route path="/examples/settings" element={<SettingsExample />} />

              {/* HR Routes */}
              <Route path="/dashboard/hr/employees" element={<Employees />} />
              <Route path="/dashboard/hr/site-staff" element={<SiteStaff />} />
              <Route path="/dashboard/hr/staff/:id" element={<StaffDetail />} />
              <Route
                path="/dashboard/hr/staff/:id/edit"
                element={<StaffEdit />}
              />

              {/* Dashboard Routes */}
              {dashboardRoutes.map((route, index) => (
                <Route
                  key={`dashboard-${index}`}
                  path={route.path}
                  element={route.element}
                />
              ))}

              {/* Member Routes */}
              {memberRoutes.map((route, index) => (
                <Route
                  key={`member-${index}`}
                  path={route.path}
                  element={route.element}
                />
              ))}

              {/* Module Routes */}
              {moduleRoutes.map((route, index) => (
                <Route
                  key={`module-${index}`}
                  path={route.path}
                  element={route.element}
                />
              ))}

              <Route
                path="/admin/organizations/:id"
                element={<OrganizationDetails />}
              />

              <Route path="/under-development" element={<UnderDevelopment />} />

              <Route path="/no-access" element={<NoAccess />} />

              {/* Dashboard routes */}
              {dashboardRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      {route.element}
                    </Suspense>
                  }
                />
              ))}

              <Route path="/demo/announcements" element={<Announcements />} />
              <Route
                path="/demo/announcements/create"
                element={<CreateAnnouncement />}
              />
              <Route
                path="/demo/announcement-settings"
                element={<AnnouncementSettings />}
              />

              {/* Module routes */}
              {Array.isArray(moduleRoutes) &&
                moduleRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        {route.element}
                      </Suspense>
                    }
                  />
                ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
