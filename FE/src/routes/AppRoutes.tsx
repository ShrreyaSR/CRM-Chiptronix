import { Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import React from "react";

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
import { TechnicianOrders } from "../components/Technician/Orders";
import { TechnicianAddJobSheet } from "../components/Technician/JobSheetManagement/AddJobSheet";

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

  function TechnicianAddJobSheetWrapper() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const jobSheetId = searchParams.get("edit") || undefined;

    return <TechnicianAddJobSheet onBack={() => navigate("/technician/jobsheet")} jobSheetId={jobSheetId} />;
  }

export default function AppRoutes() {
  return (
    <Routes>
      {/* Super Admin Dashboard */}
      <Route path="/super-admin" element={<SuperAdminLayout />}>
        <Route path="jobsheet" element={<SuperAdminJobSheet />} />
        <Route path="add-jobsheet" element={<SuperAdminAddJobSheetWrapper />} />
        <Route path="technician" element={<SuperAdminTechnician />} />
        <Route path="client" element={<SuperAdminClient />} />
        <Route path="master-data" element={<SuperAdminMasterData />} />
        <Route path="sales-person" element={<SuperAdminSalesPerson />} />
      </Route>

      {/* Admin Dashboard */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="jobsheet" element={<AdminJobSheet />} />
        <Route path="add-jobsheet" element={<AdminAddJobSheet />} />
        <Route path="technician" element={<AdminTechnician />} />
        <Route path="client" element={<AdminClient />} />
        <Route path="master-data" element={<AdminMasterData />} />
        <Route path="sales-person" element={<AdminSalesPerson />} />
      </Route>

      {/* Technician Dashboard */}
      <Route path="/technician" element={<TechnicianLayout />}>
        <Route path="jobsheet" element={<TechnicianJobSheet />} />
        <Route path="orders" element={<TechnicianOrders />} />
        <Route path="add-jobsheet" element={<TechnicianAddJobSheetWrapper />} />
      </Route>

      {/* Client Dashboard */}
      <Route path="/client" element={<ClientLayout />}>
        <Route path="jobsheet" element={<ClientJobSheet />} />
        <Route path="payment" element={<ClientPayment />} />
      </Route>

      {/* Sales Dashboard */}
      <Route path="/sales" element={<SalesLayout />}>
        <Route path="orders" element={<SalesOrders />} />
      </Route>
    </Routes>
  );
}
