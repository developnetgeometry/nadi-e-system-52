
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from "./components/ui/theme-provider";
import { useAuth } from './hooks/useAuth';

// Import routes
import { dashboardRoutes } from './routes/dashboard.routes';
import { authRoutes } from './routes/auth.routes';
import { moduleRoutes } from './routes/module.routes';
import { memberRoutes } from './routes/member.routes';

const App = () => {
  const { user, loading } = useAuth();
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Router>
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
      </Router>
    </ThemeProvider>
  );
};

export default App;
