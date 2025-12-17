import React from "react";
import { useState } from "react";
import { Laptop, Archive, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Client } from "./Client";
import { ClientBilling } from "./ClientBilling";

export function SuperAdminClient() {
  const [activeTab, setActiveTab] = useState("client_details");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Client Management</h2>
        <p className="text-gray-600 mt-1">
          Manage customers and dealer
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-xl border border-gray-200/50 p-1 rounded-xl h-auto">
          <TabsTrigger
            value="client_details"
            className={ activeTab == "client_details" ? "rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white" : ""}
          >
            <Archive className="w-4 h-4 mr-2" />
            Client Details
          </TabsTrigger>

          <TabsTrigger
            value="client_billing"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 data-[state=active]:text-white"
          >
            <Laptop className="w-4 h-4 mr-2" />
            Client Billing
          </TabsTrigger>
          
        </TabsList>

        <TabsContent value="client_details" className="space-y-6">
          <Client />
        </TabsContent>


        <TabsContent value="client_billing" className="space-y-6">
          <ClientBilling />
        </TabsContent>
        {/* <TabsContent value="trays" className="space-y-6"> 
          <Trays />
        </TabsContent>

        <TabsContent value="complaints" className="space-y-6">
          <Complaints />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
