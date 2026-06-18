import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import useStore from '@/stores/useStore';
import authService from '@/services/auth';
import { Toaster } from '@/components/ui/sonner';
import { auth } from '@/lib/firebase';

// Lazy load pages
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const Products = lazy(() => import('@/pages/store/Products'));
const ProductDetail = lazy(() => import('@/pages/store/ProductDetail'));
const Cart = lazy(() => import('@/pages/store/Cart'));
const Checkout = lazy(() => import('@/pages/store/Checkout'));
const PaymentSuccess = lazy(() => import('@/pages/store/PaymentSuccess'));
const Dashboard = lazy(() => import('@/pages/user/Dashboard'));
const Orders = lazy(() => import('@/pages/user/Orders'));
const Settings = lazy(() => import('@/pages/user/Settings'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Support = lazy(() => import('@/pages/Support'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Auth route wrapper
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useStore();
  return isLoggedIn ? <Navigate to="/" replace /> : <>{children}</>;
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useStore();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
}

// Admin route wrapper
function AdminRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Firebase not initialized warning
function FirebaseError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-red-500 text-2xl">⚠️</span>
        </div>
        <h1 className="text-xl font-bold">Firebase Belum Terkonfigurasi</h1>
        <p className="text-muted-foreground text-sm">
          Tambahkan environment variables Firebase di Vercel Dashboard:
        </p>
        <div className="bg-muted rounded-lg p-3 text-left text-xs font-mono space-y-1">
          <p>VITE_FIREBASE_API_KEY=...</p>
          <p>VITE_FIREBASE_AUTH_DOMAIN=...</p>
          <p>VITE_FIREBASE_PROJECT_ID=...</p>
        </div>
      </div>
    </div>
  );
}

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useStore();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = authService.onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  return <>{children}</>;
}

export default function App() {
  const [firebaseReady] = useState(true);

  if (!firebaseReady) {
    return <FirebaseError />;
  }

  return (
    <AuthInitializer>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Auth Routes - No Layout */}
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthRoute>
                <ForgotPassword />
              </AuthRoute>
            }
          />

          {/* User Routes - With UserLayout */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/support" element={<Support />} />

            {/* Protected User Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin Routes - With AdminLayout */}
          <Route
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/finance" element={<AdminDashboard />} />
            <Route path="/admin/vouchers" element={<AdminDashboard />} />
            <Route path="/admin/support" element={<AdminDashboard />} />
            <Route path="/admin/licenses" element={<AdminDashboard />} />
            <Route path="/admin/reviews" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" richColors />
    </AuthInitializer>
  );
}
