import { createBrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/dashboard";
import { GeneralSettings } from "@/pages/dashboard/settings/GeneralSettings";
import { ProfileSettings } from "@/pages/dashboard/settings/ProfileSettings";
import { NotificationSettings } from "@/pages/dashboard/settings/NotificationSettings";
import { routes as authRoutes } from "./module-routes/module.auth.routes";
import { routes as settingsRoutes } from "./module-routes/module.settings.routes";
import { assetRoutes } from "./module-routes/module.asset.routes";
import { vendorRoutes } from "./module-routes/module.vendor.routes";
import { programmeRoutes, ProgrammeRoutes } from "./module-routes/module.program.routes";
import RegistrationPage from "@/pages/dashboard/members/Registration";
import { SiteRoutes } from "./module-routes/module.site.routes";
import { TrainingRoutes } from "./module-routes/module.training.routes";
import EventRegistrationPage from "@/pages/EventRegistrationPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/settings",
    element: <GeneralSettings />,
  },
  {
    path: "/settings/general",
    element: <GeneralSettings />,
  },
  {
    path: "/settings/profile",
    element: <ProfileSettings />,
  },
  {
    path: "/settings/notifications",
    element: <NotificationSettings />,
  },
  {
    path: "/member/registration",
    element: <RegistrationPage />,
  },
  ...authRoutes,
  ...settingsRoutes,
  ...assetRoutes,
  ...vendorRoutes,
  ...programmeRoutes,
  {
    path: "/programmes/*",
    element: <ProgrammeRoutes />,
  },
  ...SiteRoutes,
  ...TrainingRoutes,
  {
    path: "/event-registration/:eventId",
    element: <EventRegistrationPage />,
  },
]);

export default router;
