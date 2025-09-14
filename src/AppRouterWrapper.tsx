// src/AppRouterWrapper.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

// Import your page components
import LoginPage from "@/pages/auth/LoginPage";
import AdminLayout from "@/components/layout/AdminLayout";
import OverviewPage from "@/pages/dashboard/OverviewPage";
import ProductsPage from "@/pages/dashboard/ProductsPage"; // You will create this
import OrdersPage from "@/pages/dashboard/OrdersPage"; // You will create this
import SettingsPage from "@/pages/dashboard/SettingsPage"; // You will create this

// This component will protect routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for a stored token when the app loads
    const token = localStorage.getItem("authToken");
    if (token) {
      // Here, you would typically make an API call to verify the token's validity
      // For now, we'll assume a token means the user is logged in
      setIsLoggedIn(true);
    } else {
      // If no token, redirect to login unless already there
      if (location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
    }
    setLoading(false);
  }, [location.pathname, navigate]);

  if (loading) {
    // Or a loading spinner
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return isLoggedIn ? children : null; // If not logged in, the useEffect will redirect.
};

export default function AppRouterWrapper() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/overview" element={<OverviewPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
