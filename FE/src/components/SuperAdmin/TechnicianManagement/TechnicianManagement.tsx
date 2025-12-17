import React from "react";
import { useState } from "react";
import { Laptop, Archive, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Technician } from "./TechnicianDetails";
import { TechnicianSalaryCalculator } from "./TechnicianSalaryCalculator";
export function SuperAdminTechnician() {
  const [activeTab, setActiveTab] = useState("tech_details");

  return (
    <div className="space-y-6">
        <div>
          <h2 className="text-gray-900">Technicians Management</h2>
          <p className="text-gray-600 mt-1">
            Manage your technicians and their information
          </p>
        </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-xl border border-gray-200/50 p-1 rounded-xl h-auto">
          <TabsTrigger
            value="tech_details"
            className={ activeTab == "tech_details" ? "rounded-lg bg-gradient-to-r from-teal-600 to-emerald-700 text-white" : ""}
          >
            <Archive className="w-4 h-4 mr-2" />
            Technician Details
          </TabsTrigger>

          <TabsTrigger
            value="tech_salary_calculator"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white"
          >
            <Laptop className="w-4 h-4 mr-2" />
            Technician Salary Calculator
          </TabsTrigger>
          
        </TabsList>

        <TabsContent value="tech_details" className="space-y-6">
          <Technician />
        </TabsContent>
        <TabsContent value="tech_salary_calculator" className="space-y-6">
          <TechnicianSalaryCalculator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
