
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { lazy } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Lazy load components
const ProgrammesDashboard = lazy(() => import("@/pages/dashboard/programmes/ProgrammesDashboard"));
const ProgrammeSettings = lazy(() => import("@/pages/dashboard/programmes/ProgrammeSettings"));
const ProgrammeRegistration = lazy(() => import("@/pages/dashboard/programmes/ProgrammeRegistration"));
const SmartServicesNadi4U = lazy(() => import("@/pages/dashboard/programmes/SmartServicesNadi4U"));
const SmartServicesNadi2U = lazy(() => import("@/pages/dashboard/programmes/SmartServicesNadi2U"));
const OthersProgrammes = lazy(() => import("@/pages/dashboard/programmes/OthersProgrammes"));

export const programmeRoutes = [
    {
        path: "/programmes",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ProgrammesDashboard />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/programmes/settings",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ProgrammeSettings />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/programmes/register",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <ProgrammeRegistration />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/programmes/nadi4u",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <SmartServicesNadi4U />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/programmes/nadi2u",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <SmartServicesNadi2U />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
    {
        path: "/programmes/others",
        element: (
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ProtectedRoute requiredPermission=""> */}
                <OthersProgrammes />
                {/* </ProtectedRoute> */}
            </Suspense>
        ),
    },
];

export const ProgrammeRoutes = () => {
    return (
        <Routes>
            {programmeRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}
        </Routes>
    );
};
