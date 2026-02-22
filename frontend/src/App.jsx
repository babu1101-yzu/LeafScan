import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'

// Lazy-loaded Pages (isolates module errors per page)
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Diagnosis = lazy(() => import('./pages/Diagnosis'))
const Chatbot = lazy(() => import('./pages/Chatbot'))
const Community = lazy(() => import('./pages/Community'))
const CultivationTips = lazy(() => import('./pages/CultivationTips'))
const Weather = lazy(() => import('./pages/Weather'))
const History = lazy(() => import('./pages/History'))
const Profile = lazy(() => import('./pages/Profile'))
const MarketPrices = lazy(() => import('./pages/MarketPrices'))
const CropCalendar = lazy(() => import('./pages/CropCalendar'))
const FertilizerCalc = lazy(() => import('./pages/FertilizerCalc'))
const CropRecommend = lazy(() => import('./pages/CropRecommend'))

// Layout
import AppLayout from './components/AppLayout'
import LoadingSpinner from './components/LoadingSpinner'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullScreen />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullScreen />
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function AppRoutes() {
  const location = useLocation()
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected Routes — wrapped in AppLayout (sidebar + navbar) */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/community" element={<Community />} />
          <Route path="/tips" element={<CultivationTips />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/market" element={<MarketPrices />} />
          <Route path="/calendar" element={<CropCalendar />} />
          <Route path="/calculator" element={<FertilizerCalc />} />
          <Route path="/crop-recommend" element={<CropRecommend />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
    </Suspense>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
