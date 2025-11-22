import MainLayout from "../components/Mainlayout";
import { Routes, Route } from "react-router-dom";
import{ JobSheet} from "../components/JobSheet";
import {Technician }from "../components/Technician";
import {Client} from "../components/Client";
import {MasterData} from "../components/MasterData";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<JobSheet clients={[]} employees={[]} trays={[]} modelsBrands={[]} complaintTypes={[]} />} />
        <Route path="jobsheet" element={<JobSheet clients={[]} employees={[]} trays={[]} modelsBrands={[]} complaintTypes={[]} />} />
        <Route path="employee" element={<Technician />} />
        <Route path="client" element={<Client />} />
        <Route path="master-data" element={<MasterData />} />
      </Route>
    </Routes>
  );
}
