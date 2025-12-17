import React from "react";
import { useState } from "react";
import { Laptop, Archive, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { SalesPerson } from "./SalesPersonDetails";

export function SuperAdminSalesPerson() {
  const [activeTab, setActiveTab] = useState("sales_details");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Sales Person Management</h2>
        <p className="text-gray-600 mt-1">
          Manage your sales team members and their information
        </p>
      </div>
      <SalesPerson />

      {/* <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-xl border border-gray-200/50 p-1 rounded-xl h-auto">
          <TabsTrigger
            value="sales_details"
            className={activeTab == "sales_details" ? "rounded-lg bg-gradient-to-r from-sales-500 to-sales-600 text-white" : ""}
          >
            <Archive className="w-4 h-4 mr-2" />
            Sales Person Details
          </TabsTrigger>

          <TabsTrigger
            value="sales_management"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-sales-500 data-[state=active]:to-sales-600 data-[state=active]:text-white"
          >
            <Laptop className="w-4 h-4 mr-2" />
            Sales Person Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales_details" className="space-y-6">
          
        </TabsContent> 
      </Tabs>*/}
    </div>
  );
}

