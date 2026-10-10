import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Portal from "./pages/Portal";
import Dashboard from "./pages/Dashboard";
import Rentals from "./pages/Rentals";
import History from "./pages/History";
import Invoice from "./pages/Invoice";
import Customers from "./pages/Customers";
import Inventory from "./pages/Inventory";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      {/* Public pages: no login needed */}
      <Route path="/login" element={<Login />} />
      <Route path="/portal" element={<Portal />} />

      {/* Admin pages: one protected layout wraps them all */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/history" element={<History />} />
        <Route path="/invoice/:id" element={<Invoice />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/inventory" element={<Inventory />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
