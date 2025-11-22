import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Search,
  Plus,
  Trash2,
  Laptop,
  Archive,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ModelsBrands } from "./ModelsBrands";
import { Complaints } from "./Complaints";
import { Trays } from "./Trays";

export function MasterData() {
  const [activeTab, setActiveTab] = useState("trays");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Master Data Management</h2>
        <p className="text-gray-600 mt-1">
          Manage laptop models, trays, and complaint types
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-xl border border-gray-200/50 p-1 rounded-xl h-auto">
          
          <TabsTrigger
            value="trays"
            className={
              activeTab == "trays"
                ? "rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                : ""
            }
          >
            <Archive className="w-4 h-4 mr-2" />
            Tray Management
          </TabsTrigger>
          <TabsTrigger
            value="models"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white"
          >
            <Laptop className="w-4 h-4 mr-2" />
            Models & Brands
          </TabsTrigger>
          <TabsTrigger
            value="complaints"
            className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Complaint Types
          </TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <ModelsBrands />
        </TabsContent>

        <TabsContent value="trays" className="space-y-6">
          <Trays />
        </TabsContent>

        <TabsContent value="complaints" className="space-y-6">
          <Complaints />
        </TabsContent>
      </Tabs>
    </div>
  );
}
