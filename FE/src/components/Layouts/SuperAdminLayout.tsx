import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../ui/utils";
import {
  Cpu,
  LogOut,
  ClipboardList,
  UserCog,
  Users,
  Layers,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../ui/tooltip";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";

export default function SuperAdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "jobsheet", label: "Job Sheet", icon: ClipboardList, path: "/super-admin/jobsheet" },
    { id: "add-jobsheet", label: "Add Job Sheet", icon: Layers, path: "/super-admin/add-jobsheet" },
    { id: "technician", label: "Technicians", icon: UserCog, path: "/super-admin/technician" },
    { id: "client", label: "Clients", icon: Users, path: "/super-admin/client" },
    { id: "master-data", label: "Master Data", icon: Layers, path: "/super-admin/master-data" },
    { id: "sales-person", label: "Sales Person", icon: UserCog, path: "/super-admin/sales-person" },
  ];

  const onLogout = () => {
    console.log("Logging out...");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 flex">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
        className={cn(
          "bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl flex flex-col transition-all duration-300 relative",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600"></div>

        {/* Logo Section */}
        <div className="p-3 flex items-center justify-between border-b border-gray-200/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
                <Cpu className="w-14 h-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-200">
                <h2 className="text-gray-900 whitespace-nowrap font-bold">Chiptronix</h2>
                <p className="text-xs text-gray-500 whitespace-nowrap">Super Admin</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <TooltipProvider delayDuration={0}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              const buttonClasses = cn(
                "flex items-center gap-3 rounded-xl transition-all relative group",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700"
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <div>
                        <button
                          onClick={() => navigate(item.path)}
                          className={`w-full justify-center p-3 ${buttonClasses}`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-gray-900 text-white border-none shadow-xl">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full px-4 py-3 ${buttonClasses}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </TooltipProvider>
        </nav>

        {/* User Section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200/50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/50 mb-3">
              <Avatar className="w-10 h-10 border-2 border-blue-200">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">SA</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">Super Admin</p>
                <p className="text-xs text-gray-500 truncate">superadmin@chiptronix.com</p>
              </div>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="p-4 border-t border-gray-200/50">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full border-red-200 bg-red-50/50 hover:bg-red-100 hover:border-red-300 text-red-700 transition-all rounded-xl"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {!isCollapsed && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Page Content */}
      <main className="flex-1 overflow-auto flex flex-col p-8">
        <Outlet />
      </main>
    </div>
  );
}
