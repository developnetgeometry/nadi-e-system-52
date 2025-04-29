
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { ThemeProvider } from "./components/ui/theme-provider";
import { useAuth } from './hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import routes
import { dashboardRoutes } from './routes/dashboard.routes';
import { authRoutes } from './routes/auth.routes';
import { moduleRoutes } from './routes/module.routes';
import { memberRoutes } from './routes/member.routes';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Create an AppContent component that will use hooks inside Router context
const AppContent = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  
  // Handle navigation from logout or other auth events
  const handleLogout = async () => {
    const redirectPath = await logout();
    navigate(redirectPath);
  };
  
  return (
    <Routes>
      {dashboardRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={route.element}
        />
      ))}
      {authRoutes.map((route, index) => (
        <Route
          key={`auth-${index}`}
          path={route.path}
          element={route.element}
        />
      ))}
      {moduleRoutes.map((route, index) => (
        <Route
          key={`module-${index}`}
          path={route.path}
          element={route.element}
        />
      ))}
      {memberRoutes.map((route, index) => (
        <Route
          key={`member-${index}`}
          path={route.path}
          element={route.element}
        />
      ))}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
