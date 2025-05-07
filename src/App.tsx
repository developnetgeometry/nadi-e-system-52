import React, { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Dashboard from './pages/dashboard'
import { Profile } from './pages/dashboard/Profile'
import { Users } from './pages/dashboard/Users'
import { useUserMetadata } from './hooks/use-user-metadata'
import { useToast } from './hooks/use-toast'
import Employees from './pages/dashboard/hr/Employees'
import SiteStaff from './pages/dashboard/hr/SiteStaff'
import StaffDetails from './pages/dashboard/hr/StaffDetails'
import StaffEdit from './pages/dashboard/hr/StaffEdit'
import StaffManagement from './pages/dashboard/hr/StaffManagement'

function App() {
  const { session } = useAuth()
  const userMetadata = useUserMetadata()
  const { toast } = useToast()
  const [redirectTo, setRedirectTo] = useState<string | null>(null)

  useEffect(() => {
    if (
      session?.user &&
      userMetadata &&
      userMetadata !== 'undefined' &&
      userMetadata !== 'null'
    ) {
      try {
        const metadata = JSON.parse(userMetadata)
        if (metadata && metadata.redirectTo) {
          setRedirectTo(metadata.redirectTo)
        }
      } catch (error) {
        console.error('Error parsing user metadata:', error)
        toast({
          title: 'Error',
          description: 'Failed to parse user metadata.',
          variant: 'destructive',
        })
      }
    }
  }, [session?.user, userMetadata, toast])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            session ? (
              redirectTo ? (
                <Navigate to={redirectTo} replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={session ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={
            session ? <Navigate to="/dashboard" replace /> : <Register />
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            session ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            session ? <Profile /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/dashboard/users"
          element={session ? <Users /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/dashboard/hr/employees"
          element={session ? <Employees /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/dashboard/hr/site-staff"
          element={session ? <SiteStaff /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/dashboard/hr/staff/:staffId"
          element={session ? <StaffDetails /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/dashboard/hr/staff/edit/:staffId"
          element={session ? <StaffEdit /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/dashboard/hr/staff-management"
          element={session ? <StaffManagement /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

