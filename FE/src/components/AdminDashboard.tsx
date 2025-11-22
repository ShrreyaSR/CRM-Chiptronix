import { useState } from "react";
import { JobSheet } from "./JobSheet";
import { Technician } from "./Technician";
import { Client } from "./Client";
import { Complaints } from "./Complaints";
import { MasterData } from "./MasterData";
import { Cpu, LogOut, FileText, Users, Package, BarChart3, Bell, Settings, Search, UserCog, UserCircle, Database, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface AdminDashboardProps {
  onLogout: () => void;
}

type ActiveView = 'jobsheet' | 'customers' | 'inventory' | 'reports' | 'employee' | 'client' | 'master-data' | 'complaints';

// Shared interfaces
export interface ClientData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  clientType: "Customer" | "Dealer";
}

export interface EmployeeData {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  doj: string;
  address: string;
}

export interface TrayData {
  id: number;
  trayNumber: string;
  status: "Free" | "Filled";
}

export interface ModelBrandData {
  id: number;
  brand: string;
  model: string;
  description: string;
}

export interface ComplaintTypeData {
  id: number;
  complaintType: string;
  description: string;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeView, setActiveView] = useState<ActiveView>('jobsheet');
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Shared state for all data
  const [clients, setClients] = useState<ClientData[]>([
    { id: 1, name: "Shrreya Electronics", email: "shrreya@gmail.com", phone: "9876543210", address: "MG Road, Mumbai, Maharashtra", clientType: "Dealer" },
    { id: 2, name: "Rajesh Kumar", email: "rajesh.k@gmail.com", phone: "9876543211", address: "Indiranagar, Bangalore, Karnataka", clientType: "Customer" },
    { id: 3, name: "TechWorld Solutions", email: "contact@techworld.com", phone: "9876543212", address: "Connaught Place, Delhi", clientType: "Dealer" },
    { id: 4, name: "Priya Sharma", email: "priya.s@gmail.com", phone: "9876543213", address: "Koramangala, Bangalore, Karnataka", clientType: "Customer" },
    { id: 5, name: "Digital Hub", email: "info@digitalhub.com", phone: "9876543214", address: "Anna Nagar, Chennai, Tamil Nadu", clientType: "Dealer" },
    { id: 6, name: "Arjun Patel", email: "arjun.p@gmail.com", phone: "9876543215", address: "Satellite, Ahmedabad, Gujarat", clientType: "Customer" },
    { id: 7, name: "ComputerZone", email: "sales@computerzone.com", phone: "9876543216", address: "Banjara Hills, Hyderabad, Telangana", clientType: "Dealer" },
    { id: 8, name: "Meera Singh", email: "meera.singh@gmail.com", phone: "9876543217", address: "Gomti Nagar, Lucknow, Uttar Pradesh", clientType: "Customer" },
    { id: 9, name: "Vikram Desai", email: "vikram.d@gmail.com", phone: "9876543218", address: "Vastrapur, Ahmedabad, Gujarat", clientType: "Customer" },
    { id: 10, name: "InfoTech Distributors", email: "contact@infotech.com", phone: "9876543219", address: "Park Street, Kolkata, West Bengal", clientType: "Dealer" }
  ]);

  const [employees, setEmployees] = useState<EmployeeData[]>([
    { id: 1, name: "Amit Sharma", email: "amit@chiptronix.com", password: "tech123", phone: "9876543220", dob: "1995-03-15", doj: "2023-01-10", address: "Andheri, Mumbai, Maharashtra" },
    { id: 2, name: "Neha Verma", email: "neha@chiptronix.com", password: "neha456", phone: "9876543221", dob: "1998-07-22", doj: "2023-05-15", address: "Whitefield, Bangalore, Karnataka" },
    { id: 3, name: "Rohit Gupta", email: "rohit@chiptronix.com", password: "rohit789", phone: "9876543222", dob: "1996-11-08", doj: "2022-09-01", address: "Sector 62, Noida, Uttar Pradesh" },
    { id: 4, name: "Kavya Iyer", email: "kavya@chiptronix.com", password: "kavya321", phone: "9876543223", dob: "1997-02-19", doj: "2024-03-20", address: "T Nagar, Chennai, Tamil Nadu" },
    { id: 5, name: "Sanjay Kumar", email: "sanjay@chiptronix.com", password: "sanjay654", phone: "9876543224", dob: "1994-09-30", doj: "2021-11-05", address: "Baner, Pune, Maharashtra" }
  ]);

  const [trays, setTrays] = useState<TrayData[]>([
    { id: 1, trayNumber: "T-101", status: "Free" },
    { id: 2, trayNumber: "T-102", status: "Filled" },
    { id: 3, trayNumber: "T-103", status: "Free" },
    { id: 4, trayNumber: "T-201", status: "Filled" },
    { id: 5, trayNumber: "T-202", status: "Filled" },
    { id: 6, trayNumber: "T-203", status: "Free" },
    { id: 7, trayNumber: "T-301", status: "Filled" },
    { id: 8, trayNumber: "T-302", status: "Free" },
    { id: 9, trayNumber: "T-303", status: "Filled" },
    { id: 10, trayNumber: "T-401", status: "Free" },
    { id: 11, trayNumber: "T-402", status: "Filled" },
    { id: 12, trayNumber: "T-403", status: "Free" },
    { id: 13, trayNumber: "T-501", status: "Filled" },
    { id: 14, trayNumber: "T-502", status: "Free" },
    { id: 15, trayNumber: "T-503", status: "Filled" }
  ]);

  const [modelsBrands, setModelsBrands] = useState<ModelBrandData[]>([
    { id: 1, brand: "Dell", model: "Inspiron 15 3000", description: "Budget-friendly laptop for everyday use" },
    { id: 2, brand: "Dell", model: "Vostro 14 5000", description: "Business laptop with enhanced security" },
    { id: 3, brand: "Dell", model: "XPS 13 Plus", description: "Premium ultrabook with cutting-edge design" },
    { id: 4, brand: "HP", model: "Pavilion 15", description: "All-purpose laptop for home and office" },
    { id: 5, brand: "HP", model: "Omen 16", description: "Gaming laptop with high-performance graphics" },
    { id: 6, brand: "HP", model: "EliteBook 840 G9", description: "Professional business laptop" },
    { id: 7, brand: "Lenovo", model: "IdeaPad Slim 3", description: "Lightweight laptop for students" },
    { id: 8, brand: "Lenovo", model: "ThinkPad E14", description: "Durable business laptop with spill-resistant keyboard" },
    { id: 9, brand: "Lenovo", model: "Legion 5 Pro", description: "High-performance gaming laptop" },
    { id: 10, brand: "Asus", model: "VivoBook 15", description: "Stylish laptop with NanoEdge display" },
    { id: 11, brand: "Asus", model: "ROG Strix G15", description: "Gaming laptop with RGB lighting" },
    { id: 12, brand: "Asus", model: "ZenBook 14", description: "Premium ultraportable laptop" },
    { id: 13, brand: "Acer", model: "Aspire 5", description: "Versatile laptop for everyday computing" },
    { id: 14, brand: "Acer", model: "Nitro 5", description: "Affordable gaming laptop" },
    { id: 15, brand: "Acer", model: "Swift 3", description: "Slim and lightweight laptop" },
    { id: 16, brand: "MSI", model: "Modern 14", description: "Sleek laptop for professionals" },
    { id: 17, brand: "MSI", model: "GF63 Thin", description: "Thin gaming laptop with good thermals" },
    { id: 18, brand: "MSI", model: "Prestige 14", description: "Content creator laptop" },
    { id: 19, brand: "Apple", model: "MacBook Air M2", description: "Ultra-thin laptop with Apple Silicon" },
    { id: 20, brand: "Apple", model: "MacBook Pro 14", description: "Professional laptop for creative work" }
  ]);

  const [complaintTypes, setComplaintTypes] = useState<ComplaintTypeData[]>([
    { id: 1, complaintType: "Screen not turning on", description: "Display issues, no backlight, or black screen" },
    { id: 2, complaintType: "Battery not charging", description: "Battery doesn't charge or holds no power" },
    { id: 3, complaintType: "Keyboard issues", description: "Keys not working, stuck keys, or typing errors" },
    { id: 4, complaintType: "Overheating", description: "Laptop gets too hot during use" },
    { id: 5, complaintType: "Hard drive failure", description: "Storage device not detected or corrupted" },
    { id: 6, complaintType: "No power", description: "Laptop won't turn on at all" },
    { id: 7, complaintType: "Slow performance", description: "System lag, freezing, or slow startup" },
    { id: 8, complaintType: "WiFi not working", description: "Cannot connect to wireless networks" },
    { id: 9, complaintType: "Touchpad not working", description: "Trackpad unresponsive or erratic" },
    { id: 10, complaintType: "Liquid damage", description: "Water or liquid spilled on device" },
    { id: 11, complaintType: "Physical damage", description: "Broken casing, cracked screen, or damaged ports" },
    { id: 12, complaintType: "Software issues", description: "OS errors, crashes, or boot problems" },
    { id: 13, complaintType: "Virus/Malware", description: "Infected system requiring cleanup" },
    { id: 14, complaintType: "Data recovery needed", description: "Need to recover lost or deleted files" }
  ]);

  const menuItems = [
    { id: 'jobsheet' as ActiveView, label: 'Job Sheet', icon: FileText },
    { id: 'customers' as ActiveView, label: 'Customers', icon: Users },
    { id: 'inventory' as ActiveView, label: 'Inventory', icon: Package },
    { id: 'reports' as ActiveView, label: 'Reports', icon: BarChart3 },
    { id: 'employee' as ActiveView, label: 'Employee', icon: UserCog },
    { id: 'client' as ActiveView, label: 'Client', icon: UserCircle },
    { id: 'master-data' as ActiveView, label: 'Master Data', icon: Database },
    { id: 'complaints' as ActiveView, label: 'Complaints', icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 flex">
      {/* Modern Sidebar */}
      <aside
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
        className={cn(
          "bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl flex flex-col transition-all duration-300 relative",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Gradient accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600"></div>

        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between border-b border-gray-200/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                <Cpu className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-200">
                <h2 className="text-gray-900 whitespace-nowrap">Chiptronix</h2>
                <p className="text-xs text-gray-500 whitespace-nowrap">Admin Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1.5">
          <TooltipProvider delayDuration={0}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              if (isCollapsed) {
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <div>
                        <button
                          onClick={() => setActiveView(item.id)}
                          className={cn(
                            "w-full flex items-center justify-center p-3 rounded-xl transition-all relative group",
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30"
                              : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700"
                          )}
                        >
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl blur opacity-40"></div>
                          )}
                          <Icon className="w-5 h-5 relative z-10" />
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
                  onClick={() => setActiveView(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700"
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl blur opacity-40"></div>
                  )}
                  <Icon className="w-5 h-5 relative z-10 flex-shrink-0" />
                  <span className="whitespace-nowrap relative z-10">{item.label}</span>
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
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">AD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@chiptronix.com</p>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200/50">
          <TooltipProvider delayDuration={0}>
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button
                      onClick={onLogout}
                      variant="outline"
                      className="w-full border-red-200 bg-red-50/50 hover:bg-red-100 hover:border-red-300 text-red-700 transition-all p-3 rounded-xl"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-900 text-white border-none shadow-xl">
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                onClick={onLogout}
                variant="outline"
                className="w-full border-red-200 bg-red-50/50 hover:bg-red-100 hover:border-red-300 text-red-700 transition-all rounded-xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            )}
          </TooltipProvider>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">

        <div className="flex-1 p-8">
          {activeView === 'jobsheet' && (
            <JobSheet 
              clients={clients}
              employees={employees}
              trays={trays}
              modelsBrands={modelsBrands}
              complaintTypes={complaintTypes}
            />
          )}


          {activeView === 'employee' && (
            <Technician/>
          )}

          {activeView === 'client' && (
            <Client 
            />
          )}

          {activeView === 'master-data' && (
            <MasterData/>
          )}

          {activeView === 'complaints' && <Complaints />}


                    
          {activeView === 'customers' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 mb-6">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-gray-900 mb-2">Customer Management</h2>
              <p className="text-gray-500">This feature is coming soon...</p>
            </div>
          )}
          
          {activeView === 'inventory' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 mb-6">
                <Package className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-gray-900 mb-2">Inventory Management</h2>
              <p className="text-gray-500">This feature is coming soon...</p>
            </div>
          )}
          
          {activeView === 'reports' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-16 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 mb-6">
                <BarChart3 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-gray-900 mb-2">Reports & Analytics</h2>
              <p className="text-gray-500">This feature is coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
