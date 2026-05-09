import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import AppLayout from './components/AppLayout'

import LandingPage    from './pages/LandingPage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import DashboardPage  from './pages/DashboardPage'
import MyUrlsPage     from './pages/MyUrlsPage'
import AnalyticsPage  from './pages/AnalyticsPage'
import DevelopersPage from './pages/DevelopersPage'
import SettingsPage   from './pages/SettingsPage'

import ApiDocPage     from './pages/ApiDocPage'
import SupportPage    from './pages/SupportPage'
import ContactPage    from './pages/ContactPage'
import AboutPage      from './pages/AboutPage'
import BlogPage       from './pages/BlogPage'
import { Toaster }   from 'react-hot-toast'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          {/* Public Pages */}
          <Route path="/"            element={<LandingPage />} />
          <Route path="/api-docs"    element={<ApiDocPage />} />
          <Route path="/support"     element={<SupportPage />} />
          <Route path="/contact"     element={<ContactPage />} />
          <Route path="/about"       element={<AboutPage />} />
          <Route path="/blog"        element={<BlogPage />} />

          {/* Auth Pages */}
          <Route path="/login"       element={<LoginPage />} />
          <Route path="/register"    element={<RegisterPage />} />

          {/* Protected App Pages */}
          <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            <Route path="/dashboard"  element={<DashboardPage />} />
            <Route path="/my-urls"    element={<MyUrlsPage />} />
            <Route path="/analytics"  element={<AnalyticsPage />} />
            <Route path="/developers" element={<DevelopersPage />} />
            <Route path="/settings"   element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
