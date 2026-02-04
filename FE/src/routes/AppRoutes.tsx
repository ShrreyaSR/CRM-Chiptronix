import { Routes, Route, useNavigate, useSearchParams, Navigate } from "react-router-dom";
import React from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { LoginPage } from "../components/LoginPage";
import { useAuth } from "../contexts/AuthContext";

// Layout Components
import SuperAdminLayout from "../components/Layouts/SuperAdminLayout";
import AdminLayout from "../components/Layouts/AdminLayout";
import TechnicianLayout from "../components/Layouts/TechnicianLayout";
import ClientLayout from "../components/Layouts/ClientLayout";
import SalesLayout from "../components/Layouts/SalesLayout";

// SuperAdmin Components
import { SuperAdminJobSheet } from "../components/SuperAdmin/JobSheetManagement/JobSheet";
import { SuperAdminAddJobSheet } from "../components/SuperAdmin/JobSheetManagement/AddJobSheet";
import { SuperAdminTechnician } from "../components/SuperAdmin/TechnicianManagement/TechnicianManagement";
import { SuperAdminClient } from "../components/SuperAdmin/ClientManagement/ClientManagement";
import { SuperAdminMasterData } from "../components/SuperAdmin/MasterData/MasterData";
import { SuperAdminSalesPerson } from "../components/SuperAdmin/SalesPersonManagement/SalesPersonManagement";

// Admin Components
import { AdminJobSheet } from "../components/Admin/JobSheet";
import { AdminAddJobSheet } from "../components/Admin/AddJobSheet";
import { AdminTechnician } from "../components/Admin/Technician";
import { AdminClient } from "../components/Admin/Client";
import { AdminMasterData } from "../components/Admin/MasterData";
import { AdminSalesPerson } from "../components/Admin/SalesPerson";

// Technician Components
import { TechnicianJobSheet } from "../components/Technician/JobSheetManagement/JobSheet";
import { TechnicianAllJobSheet } from "../components/Technician/JobSheetManagement/AllJobSheet";
import { TechnicianOrders } from "../components/Technician/Orders";

// Client Components
import { ClientJobSheet } from "../components/Client/JobSheet";
import { ClientPayment } from "../components/Client/Payment";

// Sales Components
import { SalesOrders } from "../components/Sales/Orders";

  function SuperAdminAddJobSheetWrapper() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const jobSheetId = searchParams.get("edit") || undefined;

    return <SuperAdminAddJobSheet onBack={() => navigate("/super-admin/jobsheet")} jobSheetId={jobSheetId} />;
  }


export default function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/super-admin" replace /> : <LoginPage />
        }
      />

      {/* Super Admin Dashboard */}
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute requiredRole="super-admin">
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<SuperAdminJobSheet />} />
        <Route path="jobsheet" element={<SuperAdminJobSheet />} />
        <Route path="add-jobsheet" element={<SuperAdminAddJobSheetWrapper />} />
        <Route path="technician" element={<SuperAdminTechnician />} />
        <Route path="client" element={<SuperAdminClient />} />
        <Route path="master-data" element={<SuperAdminMasterData />} />
        <Route path="sales-person" element={<SuperAdminSalesPerson />} />
      </Route>

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<AdminJobSheet />} />
        <Route path="jobsheet" element={<AdminJobSheet />} />
        <Route path="add-jobsheet" element={<AdminAddJobSheet />} />
        <Route path="technician" element={<AdminTechnician />} />
        <Route path="client" element={<AdminClient />} />
        <Route path="master-data" element={<AdminMasterData />} />
        <Route path="sales-person" element={<AdminSalesPerson />} />
      </Route>

      {/* Technician Dashboard */}
      <Route
        path="/technician"
        element={
          <ProtectedRoute requiredRole="technician">
            <TechnicianLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<TechnicianJobSheet />} />
        <Route path="jobsheet" element={<TechnicianJobSheet />} />
        <Route path="all-jobsheets" element={<TechnicianAllJobSheet />} />
        <Route path="orders" element={<TechnicianOrders />} />
      
      </Route>

      {/* Client/Dealer Dashboard */}
      <Route
        path="/client"
        element={
          <ProtectedRoute requiredRole="dealer">
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<ClientJobSheet />} />
        <Route path="jobsheet" element={<ClientJobSheet />} />
        <Route path="payment" element={<ClientPayment />} />
      </Route>

      {/* Sales Dashboard */}
      <Route
        path="/sales"
        element={
          <ProtectedRoute requiredRole="sales">
            <SalesLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<SalesOrders />} />
        <Route path="orders" element={<SalesOrders />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
