import { useState, useRef, useEffect, SetStateAction } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import {
  Plus,
  Search,
  FileText,
  User,
  Laptop,
  DollarSign,
  Filter,
  Eye,
  Edit,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Printer,
  Barcode,
  Package,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Calendar } from "./ui/calendar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { JobSheetBill } from "./JobSheetBill";
import { SerialNumberBarcode } from "./SerialNumberBarcode";
import { crmApi } from "../api/crmApi";
import {
  JobSheetDto,
  ClientDto,
  TrayDto,
  BrandDto,
  ComplaintDto,
  TechnicianDto,
  jobSheetResDto,
} from "../dtos";

export function JobSheet() {
  const [jobSheets, setJobSheets] = useState<JobSheetDto[]>([]);
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [technicians, setTechnician] = useState<TechnicianDto[]>([]);
  const [complaints, setComplaints] = useState<ComplaintDto[]>([]);
  const [trays, setTrays] = useState<TrayDto[]>([]);
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobSheet, setSelectedJobSheet] = useState<JobSheetDto>();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [jobSheetRes, setJobSheetsRes] = useState<jobSheetResDto>({
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        jobRes,
        clientRes,
        technicianRes,
        modelRes,
        trayRes,
        complaintRes,
      ] = await Promise.all([
        crmApi.jobSheet.getAll({}),
        crmApi.client.getAll({}),
        crmApi.technician.getAll({}),
        crmApi.model.getAllModels({}),
        crmApi.tray.getAll({}),
        crmApi.complaint.getAll(),
      ]);
      setJobSheets(jobRes.data.items || []);
      setClients(clientRes.data.data || []);
      setTechnician(technicianRes.data.data);
      setComplaints(complaintRes.data.data);
      // setTrays(trayRes.data);
      //setBrands(modelRes.data);
      setJobSheetsRes(jobRes.data);
    } catch (err) {
      console.error("Error loading dto:", err);
    } finally {
      setLoading(false);
    }
  };

  // Build dynamic brand-to-models mapping from modelsBrands dto
  const brandModelsMap: Record<string, string[]> = {};
  brands.forEach((mb) => {
    if (!brandModelsMap[mb.brand]) {
      brandModelsMap[mb.brand] = [];
    }
    if (!brandModelsMap[mb.brand].includes(mb.model)) {
      brandModelsMap[mb.brand].push(mb.model);
    }
  });

  // Get unique brands
  const availableBrands = Object.keys(brandModelsMap).sort();

  // Dropdown options - using dto from props
  const clientNames = clients.map((c) => c.name);
  const techniciansList = technicians.map((e) => e.name);
  const allTrays = trays.map((t) => t.trayNumber);
  const complaintsList = complaints.map((ct) => ct.description);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterClient, setFilterClient] = useState<string>("all");
  const [filterTechnician, setFilterTechnician] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formDto, setFormDto] = useState<Omit<JobSheetDto, "id">>({
    client: clients[0],
    deviceType: "UPS",
    brand: brands[0],
    serviceType: "Chip level",
    color: "",
    serialNumber: "",
    complaint: complaints[0],
    problemsIdentified: "",
    tray: trays[0],
    receivedFrom: "",
    assignedTo: technicians[0],
    receivedBy: technicians[0],
    estimateAmount: 0,
    estimateTime: 0,
    advancePayment: 0,
    description: "",
    picture: "",
    status: "Pending",
    createdOn: new Date().toString(),
  });

  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // Sorting state
  const [sortField, setSortField] = useState<keyof JobSheetDto | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Bill printing
  const [selectedJobForBill, setSelectedJobForBill] =
    useState<JobSheetDto | null>(null);
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [showBarcodePreview, setShowBarcodePreview] = useState(false);

  // States for "Add New" popovers
  const [newClient, setNewClient] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newComplaint, setNewComplaint] = useState("");
  const [showClientPopover, setShowClientPopover] = useState(false);
  const [showBrandPopover, setShowBrandPopover] = useState(false);
  const [showModelPopover, setShowModelPopover] = useState(false);
  const [showComplaintPopover, setShowComplaintPopover] = useState(false);

  // Helper function to format currency in INR
  const formatINR = (amount: string | number): string => {
    const num =
      typeof amount === "string"
        ? parseFloat(amount.replace(/[^0-9.-]+/g, ""))
        : amount;
    if (isNaN(num)) return "₹0";
    return `₹${num.toLocaleString("en-IN")}`;
  };

  // Helper function to generate serial number
  const generateSerialNumber = (brand: string): string => {
    const prefix = brand.substring(0, 2).toUpperCase();
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0");
    return `${prefix}${timestamp}${random}`;
  };

  // Get available (free) trays
  const getAvailableTrays = (): string[] => {
    const occupiedTrays = jobSheets
      .filter((job) => job.status !== "Delivered")
      .map((job) => job.tray);

    //return allTrays.filter((tray) => !occupiedTrays.includes(tray));
    return allTrays;
  };

  // Update available models when brand changes
  const handleBrandChange = (brand: string) => {
    const serialNumber = generateSerialNumber(brand);
    setFormDto({ ...formDto, brand: brands[0], serialNumber }); // Clear model and generate serial when brand changes
    setAvailableModels(brandModelsMap[brand] || []);
  };

  const handleCreateJobSheet = () => {
    if (
      !formDto.client ||
      !formDto.serviceType ||
      !formDto.complaint?.description
    ) {
      alert(
        "Please fill in all required fields (Client, Service Type, Complaints)"
      );
      return;
    }

    // Format all amounts to INR
    const estimateAmount = formDto.estimateAmount
      ? formatINR(formDto.estimateAmount)
      : "₹0";
    const advancePayment = formDto.advancePayment
      ? formatINR(formDto.advancePayment)
      : "₹0";
    const amountPaid = formDto.advancePayment
      ? formatINR(formDto.advancePayment)
      : "₹0";

    const newJobSheet: JobSheetDto = {
      id: `JS${String(jobSheets.length + 1).padStart(3, "0")}`,
      client: formDto.client || "",
      //contactNumber: formDto.client.phone || "",
      serviceType: formDto.serviceType || "",
      // brand: formDto.brand || ,
      //model: formDto.brand?.model || "",
      color: formDto.color || "",
      serialNumber:
        formDto.serialNumber ||
        generateSerialNumber(formDto.brand?.brand || "CHI"),
      complaint: formDto.complaint || "",
      problemsIdentified: formDto.problemsIdentified || "",
      // accessories: formDto.accessories || "",
      //tray: formDto.tray || "",
      receivedFrom: formDto.receivedFrom || "",
      // receivedBy: formDto.receivedBy || technicians.find(),
      estimateAmount: 12,
      estimateTime: formDto.estimateTime || 12,
      advancePayment: 12,
      description: formDto.description || "",
      picture: formDto.picture || "",
      //amountPaid,
      status: (formDto.status as JobSheetDto["status"]) || "Pending",
      createdOn: formDto.createdOn || new Date().toISOString().split("T")[0],
      deviceType: "UPS",
      brand: formDto.brand,
      tray: formDto.tray,
      assignedTo: formDto.assignedTo,
      receivedBy: formDto.receivedBy,
    };

    setJobSheets([newJobSheet, ...jobSheets]);
    setFormDto({ ...formDto, status: "Pending" });
    setUploadedFileName("");
    setAvailableModels([]);
    setIsDialogOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      // In a real app, you would upload the file to a server
      setFormDto({ ...formDto, picture: file.name });
    }
  };

  const addNewClient = () => {
    // Clients are managed in the Client Management section
    setShowClientPopover(false);
    alert(
      "Please add new clients from the Client Management section in the sidebar."
    );
  };

  const addNewBrand = () => {
    // Brands/Models are managed in the Models & Brands section
    setShowBrandPopover(false);
    alert(
      "Please add new brands and models from the Models & Brands section in the sidebar."
    );
  };

  const addNewModel = () => {
    // Models are managed in the Models & Brands section
    setShowModelPopover(false);
    alert(
      "Please add new models from the Models & Brands section in the sidebar."
    );
  };

  const addNewComplaint = () => {
    // Complaint types are managed in the Master Dto section
    setShowComplaintPopover(false);
    alert(
      "Please add new complaint types from the Master Dto section in the sidebar."
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "In Progress":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Delivered":
        return "bg-teal-100 text-teal-700 border-teal-200";
      case "Waiting for Spares":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "Waiting for Customer Reply":
        return "bg-violet-100 text-violet-700 border-violet-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Sorting function
  const handleSort = (field: keyof JobSheetDto) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof JobSheetDto) => {
    if (sortField !== field)
      return (
        <ArrowUpDown className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50" />
      );
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  // Advanced filtering and sorting
  const filteredAndSortedJobSheets = jobSheets
    .filter((job) => {
      // Search filter
      const matchesSearch =
        job.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.brand.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.complaint.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        filterStatus === "all" || job.status === filterStatus;

      // Client filter
      const matchesClient =
        filterClient === "all" || job.client.name === filterClient;

      // Technician filter
      const matchesTechnician =
        filterTechnician === "all" || job.receivedBy.name === filterTechnician;

      // Date range filter
      let matchesDateRange = true;
      if (dateRange.from && dateRange.to) {
        const jobDate = new Date(job.createdOn);
        matchesDateRange = jobDate >= dateRange.from && jobDate <= dateRange.to;
      } else if (dateRange.from) {
        const jobDate = new Date(job.createdOn);
        matchesDateRange = jobDate >= dateRange.from;
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesClient &&
        matchesTechnician &&
        matchesDateRange
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === undefined || bValue === undefined) return 0;

      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedJobSheets.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobSheets = filteredAndSortedJobSheets.slice(
    startIndex,
    endIndex
  );

  // Reset to first page when filters change
  const resetPagination = () => setCurrentPage(1);

  // Print bill function
  const handlePrintBill = (job: JobSheetDto) => {
    setSelectedJobForBill(job);
    setShowBillPreview(true);
  };

  const handlePrintBarcode = (job: JobSheetDto) => {
    setSelectedJobForBill(job);
    setShowBarcodePreview(true);
  };

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const stats = {
    total: jobSheets.length,
    pending: jobSheets.filter((j) => j.status === "Pending").length,
    inProgress: jobSheets.filter((j) => j.status === "In Progress").length,
    completed: jobSheets.filter((j) => j.status === "Completed").length,
    delivered: jobSheets.filter((j) => j.status === "Delivered").length,
    waitingSpares: jobSheets.filter((j) => j.status === "Waiting for Spares")
      .length,
    waitingCustomer: jobSheets.filter(
      (j) => j.status === "Waiting for Customer Reply"
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Modern Stats Cards */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4 ">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative group hover:shadow-xl transition-all min-w-[170px] flex-shrink-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-blue-100 text-xs">
                Total Jobs
              </CardDescription>
              <CardTitle className="text-white text-2xl">
                {stats.total}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-3">
              <div className="flex items-center gap-1.5 text-blue-100">
                <FileText className="w-3.5 h-3.5" />
                <span className="text-xs">All sheets</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden relative group hover:shadow-xl transition-all min-w-[180px] flex-shrink-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-amber-100 text-xs">
                Pending
              </CardDescription>
              <CardTitle className="text-white text-2xl">
                {stats.pending}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-3">
              <div className="flex items-center gap-1.5 text-amber-100">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-xs">New jobs</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white overflow-hidden relative group hover:shadow-xl transition-all min-w-[170px] flex-shrink-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-purple-100 text-xs">
                In Progress
              </CardDescription>
              <CardTitle className="text-white text-2xl">
                {stats.inProgress}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-3">
              <div className="flex items-center gap-1.5 text-purple-100">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs">Repairing</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white overflow-hidden relative group hover:shadow-xl transition-all min-w-[170px] flex-shrink-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-emerald-100 text-xs">
                Completed
              </CardDescription>
              <CardTitle className="text-white text-2xl">
                {stats.completed}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-3">
              <div className="flex items-center gap-1.5 text-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-xs">Ready</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-white overflow-hidden relative group hover:shadow-xl transition-all min-w-[170px] flex-shrink-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-teal-100 text-xs">
                Delivered
              </CardDescription>
              <CardTitle className="text-white text-2xl">
                {stats.delivered}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-3">
              <div className="flex items-center gap-1.5 text-teal-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-xs">Closed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white overflow-hidden relative group hover:shadow-xl transition-all min-w-[170px] flex-shrink-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-rose-100 text-xs">
                Waiting Spares
              </CardDescription>
              <CardTitle className="text-white text-2xl">
                {stats.waitingSpares}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-3">
              <div className="flex items-center gap-1.5 text-rose-100">
                <Package className="w-3.5 h-3.5" />
                <span className="text-xs">Parts needed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white overflow-hidden relative group hover:shadow-xl transition-all min-w-[170px] flex-shrink-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-violet-100 text-xs">
                Waiting Customer
              </CardDescription>
              <CardTitle className="text-white text-2xl">
                {stats.waitingCustomer}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 pb-3">
              <div className="flex items-center gap-1.5 text-violet-100">
                <User className="w-3.5 h-3.5" />
                <span className="text-xs">On hold</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Job Sheet Table */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-white to-blue-50/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Job Sheets
              </CardTitle>
              <CardDescription className="mt-1">
                Manage and track all repair job sheets
              </CardDescription>
            </div>

            
          </div>
        </CardHeader>
        <CardContent className="pt-2 px-6 pb-6">
          {/* Search Bar */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by client, job ID, brand, or complaints..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  resetPagination();
                }}
                className="pl-11 h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 bg-gray-50/50"
              />
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Range Filter */}
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 rounded-xl border-gray-200 bg-gray-50/50 justify-start"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {dateRange.from.toLocaleDateString("en-IN")} -{" "}
                          {dateRange.to.toLocaleDateString("en-IN")}
                        </>
                      ) : (
                        dateRange.from.toLocaleDateString("en-IN")
                      )
                    ) : (
                      <span>Date Range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-2 scale-90 origin-top-left" // 🔥 smaller popover
                  side="bottom"
                  align="start"
                  avoidCollisions={false}
                  sideOffset={4}
                >
                  <div className="p-2 space-y-3 text-sm">
                    {" "}
                    {/* 🔥 reduced padding + smaller text */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Select Date Range</Label>

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs" // 🔥 smaller button
                          onClick={() => {
                            const today = new Date();
                            setDateRange({ from: today, to: today });
                            resetPagination();
                          }}
                        >
                          Today
                        </Button>
                      </div>

                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(range: any) => {
                          setDateRange(range);
                          resetPagination();
                        }}
                        numberOfMonths={1}
                        className="scale-50" // 🔥 smaller calendar grid
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 h-8 px-2 text-xs" // 🔥 small buttons
                        onClick={() => {
                          setDateRange({ from: undefined, to: undefined });
                          resetPagination();
                          setShowDatePicker(false);
                        }}
                      >
                        Clear
                      </Button>

                      <Button
                        className="flex-1 h-8 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                        onClick={() => setShowDatePicker(false)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Client Filter */}
              <Select
                value={filterClient}
                onValueChange={(value: SetStateAction<string>) => {
                  setFilterClient(value);
                  resetPagination();
                }}
              >
                <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-gray-50/50">
                  <User className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {clientNames.map((client) => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Technician Filter */}
              <Select
                value={filterTechnician}
                onValueChange={(value: SetStateAction<string>) => {
                  setFilterTechnician(value);
                  resetPagination();
                }}
              >
                <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-gray-50/50">
                  <User className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by Technician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technicians</SelectItem>
                  {techniciansList.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={filterStatus}
                onValueChange={(value: SetStateAction<string>) => {
                  setFilterStatus(value);
                  resetPagination();
                }}
              >
                <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-gray-50/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Waiting for Spares">
                    Waiting for Spares
                  </SelectItem>
                  <SelectItem value="Waiting for Customer Reply">
                    Waiting for Customer Reply
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Display */}
            {(filterStatus !== "all" ||
              filterClient !== "all" ||
              filterTechnician !== "all" ||
              dateRange.from) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Active Filters:</span>
                {filterStatus !== "all" && (
                  <Badge variant="secondary" className="rounded-full">
                    Status: {filterStatus}
                    <button
                      onClick={() => {
                        setFilterStatus("all");
                        resetPagination();
                      }}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filterClient !== "all" && (
                  <Badge variant="secondary" className="rounded-full">
                    Client: {filterClient}
                    <button
                      onClick={() => {
                        setFilterClient("all");
                        resetPagination();
                      }}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filterTechnician !== "all" && (
                  <Badge variant="secondary" className="rounded-full">
                    Technician: {filterTechnician}
                    <button
                      onClick={() => {
                        setFilterTechnician("all");
                        resetPagination();
                      }}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {dateRange.from && (
                  <Badge variant="secondary" className="rounded-full">
                    Date Range
                    <button
                      onClick={() => {
                        setDateRange({ from: undefined, to: undefined });
                        resetPagination();
                      }}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterStatus("all");
                    setFilterClient("all");
                    setFilterTechnician("all");
                    setDateRange({ from: undefined, to: undefined });
                    resetPagination();
                  }}
                  className="text-blue-600 hover:text-blue-700 h-7"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
            <div className="overflow-x-auto overflow-y-auto max-h-[600px] relative custom-scrollbar">
              <Table className="w-full">
                <TableHeader className="bg-gradient-to-r from-gray-50 to-blue-50/30 sticky top-0 z-10 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gray-200">
                  <TableRow className="hover:bg-transparent">
                    <TableHead
                      className="text-gray-700 cursor-pointer group min-w-[110px] whitespace-nowrap"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        Job Number
                        {getSortIcon("id")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-gray-700 cursor-pointer group min-w-[150px] whitespace-nowrap"
                      onClick={() => handleSort("client")}
                    >
                      <div className="flex items-center">
                        Client
                        {getSortIcon("client")}
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-700 min-w-[180px] whitespace-nowrap">
                      Device
                    </TableHead>
                    <TableHead
                      className="text-gray-700 cursor-pointer group min-w-[140px] whitespace-nowrap"
                      onClick={() => handleSort("serialNumber")}
                    >
                      <div className="flex items-center">
                        Serial Number
                        {getSortIcon("serialNumber")}
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-700 min-w-[250px]">
                      Complaints
                    </TableHead>
                    <TableHead
                      className="text-gray-700 cursor-pointer group min-w-[120px] whitespace-nowrap"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center">
                        Status
                        {getSortIcon("status")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-gray-700 cursor-pointer group min-w-[120px] whitespace-nowrap"
                      onClick={() => handleSort("createdOn")}
                    >
                      <div className="flex items-center">
                        Created On
                        {getSortIcon("createdOn")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-gray-700 cursor-pointer group min-w-[140px] whitespace-nowrap"
                      onClick={() => handleSort("receivedBy")}
                    >
                      <div className="flex items-center">
                        Assigned To
                        {getSortIcon("receivedBy")}
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-700 min-w-[80px] whitespace-nowrap">
                      Tray
                    </TableHead>
                    <TableHead className="text-gray-700 min-w-[120px] whitespace-nowrap">
                      Estimate
                    </TableHead>
                    <TableHead className="text-gray-700 text-right min-w-[150px] whitespace-nowrap">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedJobSheets.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className="text-center py-12 text-gray-500"
                      >
                        No job sheets found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedJobSheets.map((job) => (
                      <TableRow
                        key={job.id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <TableCell className="text-blue-600 whitespace-nowrap">
                          {job.id}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-gray-900">{job.client.name}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div>
                            <div className="text-gray-900">
                              {job.brand.brand} {job.brand.model}
                            </div>
                            <div className="text-xs text-gray-500">
                              {job.color}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-xs text-gray-700 font-mono">
                            {job.serialNumber}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <div
                            className="text-gray-700 line-clamp-2"
                            title={job.complaint.description}
                          >
                            {job.complaint.description}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge
                            className={`${getStatusColor(
                              job.status
                            )} border rounded-lg px-3 py-1`}
                          >
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-sm text-gray-700">
                            {job.createdOn}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-gray-900">
                            {job.receivedBy.name || "Not assigned"}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 whitespace-nowrap">
                          {job.tray.trayNumber}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div>
                            <div className="text-gray-900">
                              {job.estimateAmount}
                            </div>
                            <div className="text-xs text-gray-500">
                              {job.estimateTime}h
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 hover:bg-blue-100 hover:text-blue-700 rounded-lg"
                            onClick={() => {
                              setSelectedJobSheet(job);
                              setIsViewDialogOpen(true);
                            }}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 mr-1.5" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Scroll hint */}
            <div className="bg-gradient-to-t from-blue-50/50 to-transparent py-2.5 px-4 flex items-center justify-center gap-2 text-xs text-gray-400 border-t border-gray-100">
              <svg
                className="w-3.5 h-3.5 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <span className="hidden sm:inline">Scroll to see more</span>
            </div>
          </div>

          {/* Pagination */}
          {filteredAndSortedJobSheets.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredAndSortedJobSheets.length)} of{" "}
                {filteredAndSortedJobSheets.length} results
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={
                          currentPage === pageNumber ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`rounded-lg w-9 ${
                          currentPage === pageNumber
                            ? "bg-blue-600 hover:bg-blue-700"
                            : ""
                        }`}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-500 max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Job Sheet Details - {selectedJobSheet?.id}
            </DialogTitle>
            <DialogDescription>
              Complete information about this job sheet
            </DialogDescription>
          </DialogHeader>

          {selectedJobSheet && (
            <div className="space-y-6 py-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between pb-4 border-b">
                <Badge
                  className={`${getStatusColor(
                    selectedJobSheet.status
                  )} border rounded-xl px-4 py-2 text-base`}
                >
                  {selectedJobSheet.status}
                </Badge>
                <div className="text-sm text-gray-500">
                  Created on: {selectedJobSheet.createdOn}
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-blue-700 pb-2 border-b border-blue-200">
                  <User className="w-5 h-5" />
                  <h3 className="font-semibold">Client Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600 text-xs">Client Name</Label>
                    <p className="text-gray-900 mt-1">
                      {selectedJobSheet.client.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Contact Number
                    </Label>
                    <p className="text-gray-900 mt-1">
                      {selectedJobSheet.client.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Received From
                    </Label>
                    <p className="text-gray-900 mt-1">
                      {selectedJobSheet.receivedFrom}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Received By (Technician)
                    </Label>
                    <p className="text-gray-900 mt-1">
                      {selectedJobSheet.receivedBy.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Device Information */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-purple-700 pb-2 border-b border-purple-200">
                  <Laptop className="w-5 h-5" />
                  <h3 className="font-semibold">Device Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-600 text-xs">Brand</Label>
                    <p className="text-gray-900 mt-1">
                      {selectedJobSheet.brand.brand}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">Model</Label>
                    <p className="text-gray-900 mt-1">
                      {selectedJobSheet.brand.model}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">Color</Label>
                    <p className="text-gray-900 mt-1">
                      {selectedJobSheet.color}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-600 text-xs">
                      Serial Number
                    </Label>
                    <p className="text-gray-900 mt-1 font-mono">
                      {selectedJobSheet.serialNumber}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Service Type
                    </Label>
                    <p className="text-gray-900 mt-1">
                      {selectedJobSheet.serviceType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Issues and Problems */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-orange-700 pb-2 border-b border-orange-200">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="font-semibold">Issues & Problems</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600 text-xs">Complaints</Label>
                    <p className="text-gray-900 mt-1">
                      {selectedJobSheet.complaint.description}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Problems Identified
                    </Label>
                    <p className="text-gray-900 mt-1">
                      {selectedJobSheet.problemsIdentified}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Additional Description
                    </Label>
                    <p className="text-gray-900 mt-1">
                      {selectedJobSheet.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financial & Logistics */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-green-700 pb-2 border-b border-green-200">
                  <DollarSign className="w-5 h-5" />
                  <h3 className="font-semibold">Financial & Logistics</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Estimate Amount
                    </Label>
                    <p className="text-gray-900 mt-1 text-lg font-semibold">
                      {selectedJobSheet.estimateAmount}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Estimate Time
                    </Label>
                    <p className="text-gray-900 mt-1">
                      {selectedJobSheet.estimateTime} hours
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Advance Payment
                    </Label>
                    <p className="text-gray-900 mt-1 text-lg font-semibold text-green-600">
                      {selectedJobSheet.advancePayment}
                    </p>
                  </div>
                  {/* <div>
                    <Label className="text-gray-600 text-xs">Amount Paid</Label>
                    <p className="text-gray-900 mt-1 text-lg font-semibold">{selectedJobSheet.}</p>
                  </div> */}
                  <div className="md:col-span-2">
                    <Label className="text-gray-600 text-xs">Tray Number</Label>
                    <p className="text-gray-900 mt-1">
                      {selectedJobSheet.tray.trayNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex-1 sm:flex-none"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Job Sheet
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex-1 sm:flex-none">
                      <Printer className="w-4 h-4 mr-2" />
                      Print Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem
                      onClick={() => {
                        setIsViewDialogOpen(false);
                        handlePrintBill(selectedJobSheet);
                      }}
                      className="cursor-pointer"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Print Laptop Sticker
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setIsViewDialogOpen(false);
                        handlePrintBarcode(selectedJobSheet);
                      }}
                      className="cursor-pointer"
                    >
                      <Barcode className="w-4 h-4 mr-2" />
                      Print Serial Number
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to delete job ${selectedJobSheet.id}?`
                      )
                    ) {
                      setJobSheets(
                        jobSheets.filter((j) => j.id !== selectedJobSheet.id)
                      );
                      setIsViewDialogOpen(false);
                    }
                  }}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 flex-1 sm:flex-none"
                >
                  <X className="w-4 h-4 mr-2" />
                  Delete
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                  className="flex-1 sm:flex-none ml-auto"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bill Preview Dialog */}
      {/* <Dialog open={showBillPreview} onOpenChange={setShowBillPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Print Job Sticker</DialogTitle>
            <DialogDescription>
              Preview and print the sticker to attach to the laptop (technician
              copy - no pricing)
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6 bg-gray-50 rounded-lg">
            {selectedJobForBill && (
              <JobSheetBill job={selectedJobForBill} isPreview={true} />
            )}
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowBillPreview(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePrint}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Print Sticker
            </Button>
          </div>
        </DialogContent>
      </Dialog> */}

      {/* Barcode Preview Dialog */}
      {/* <Dialog open={showBarcodePreview} onOpenChange={setShowBarcodePreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Print Serial Number Barcode</DialogTitle>
            <DialogDescription>
              Preview and print the serial number barcode sticker
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6 bg-gray-50 rounded-lg">
            {selectedJobForBill && (
              <SerialNumberBarcode
                serialNumber={selectedJobForBill.serialNumber}
                jobId={selectedJobForBill.id}
                isPreview={true}
              />
            )}
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowBarcodePreview(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePrint}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Barcode className="w-4 h-4 mr-2" />
              Print Barcode
            </Button>
          </div>
        </DialogContent>
      </Dialog> */}

      {/* Hidden Print Area - Only visible when printing */}
      {/* {selectedJobForBill && (
        <>
          <div className="print-only fixed top-0 left-0 w-full h-full bg-white hidden print:flex items-center justify-center">
            <JobSheetBill job={selectedJobForBill} isPreview={false} />
          </div>
          <div className="print-only fixed top-0 left-0 w-full h-full bg-white hidden print:flex items-center justify-center">
            <SerialNumberBarcode
              serialNumber={selectedJobForBill.serialNumber}
              jobId={selectedJobForBill.id}
              isPreview={false}
            />
          </div>
        </>
      )} */}
    </div>
  );
}




            // <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            //   <DialogTrigger asChild>
            //     <div>
            //       <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all rounded-xl">
            //         <Plus className="w-4 h-4 mr-2" />
            //         Create Job Sheet
            //       </Button>
            //     </div>
            //   </DialogTrigger>
            //   <DialogContent className="max-w-4xl max-h-[90vh] rounded-2xl border-0 shadow-2xl">
            //     <DialogHeader>
            //       <DialogTitle className="text-gray-900 text-xl">
            //         Create New Job Sheet
            //       </DialogTitle>
            //       <DialogDescription>
            //         Fill in the details to create a new repair job sheet
            //       </DialogDescription>
            //     </DialogHeader>
            //     <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
            //       <div className="grid gap-6 py-4">
            //         {/* Client & Service Information */}
            //         <div className="space-y-4">
            //           <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            //             <User className="w-4 h-4 text-blue-600" />
            //             <h3 className="text-gray-800">
            //               Client & Service Information
            //             </h3>
            //           </div>
            //           <div className="grid grid-cols-2 gap-4">
            //             <div className="space-y-2">
            //               <Label htmlFor="client" className="text-gray-700">
            //                 Client *
            //               </Label>
            //               <div className="flex gap-2">
            //                 <Select
            //                   value={formDto.client}
            //                   onValueChange={(value: any) => {
            //                     const selectedClient = clients.find(
            //                       (c) => c.name === value
            //                     );
            //                     setFormDto({
            //                       ...formDto,
            //                       client: value,
            //                     });
            //                   }}
            //                 >
            //                   <SelectTrigger
            //                     id="client"
            //                     className="rounded-xl border-gray-200 flex-1"
            //                   >
            //                     <SelectValue placeholder="Select client" />
            //                   </SelectTrigger>
            //                   <SelectContent>
            //                     {clientNames.map((client) => (
            //                       <SelectItem key={client} value={client}>
            //                         {client}
            //                       </SelectItem>
            //                     ))}
            //                   </SelectContent>
            //                 </Select>
            //                 <Popover
            //                   open={showClientPopover}
            //                   onOpenChange={setShowClientPopover}
            //                 >
            //                   <PopoverTrigger asChild>
            //                     <Button
            //                       variant="outline"
            //                       size="icon"
            //                       className="rounded-xl"
            //                     >
            //                       <Plus className="w-4 h-4" />
            //                     </Button>
            //                   </PopoverTrigger>
            //                   <PopoverContent className="w-80">
            //                     <div className="space-y-3">
            //                       <h4 className="font-medium text-sm">
            //                         Add New Client
            //                       </h4>
            //                       <Input
            //                         placeholder="Client name"
            //                         value={newClient}
            //                         onChange={(e) =>
            //                           setNewClient(e.target.value)
            //                         }
            //                         onKeyPress={(e) =>
            //                           e.key === "Enter" && addNewClient()
            //                         }
            //                       />
            //                       <Button
            //                         onClick={addNewClient}
            //                         className="w-full"
            //                       >
            //                         Add Client
            //                       </Button>
            //                     </div>
            //                   </PopoverContent>
            //                 </Popover>
            //               </div>
            //             </div>
            //             <div className="space-y-2">
            //               <Label
            //                 htmlFor="serviceType"
            //                 className="text-gray-700"
            //               >
            //                 Service Type *
            //               </Label>
            //               <Select
            //                 value={formDto.serviceType}
            //                 onValueChange={(value: any) =>
            //                   setFormDto({ ...formDto, serviceType: value })
            //                 }
            //               >
            //                 <SelectTrigger
            //                   id="serviceType"
            //                   className="rounded-xl border-gray-200"
            //                 >
            //                   <SelectValue placeholder="Select service type" />
            //                 </SelectTrigger>
            //                 <SelectContent>
            //                   <SelectItem value="Repair">Repair</SelectItem>
            //                   <SelectItem value="Maintenance">
            //                     Maintenance
            //                   </SelectItem>
            //                   <SelectItem value="Upgrade">Upgrade</SelectItem>
            //                   <SelectItem value="Installation">
            //                     Installation
            //                   </SelectItem>
            //                   <SelectItem value="Diagnosis">
            //                     Diagnosis
            //                   </SelectItem>
            //                 </SelectContent>
            //               </Select>
            //             </div>
            //           </div>
            //           <div className="grid grid-cols-2 gap-4">
            //             <div className="space-y-2">
            //               <Label
            //                 htmlFor="contactNumber"
            //                 className="text-gray-700"
            //               >
            //                 Contact Number
            //               </Label>
            //               <Input
            //                 id="contactNumber"
            //                 placeholder="e.g., +91 98765 43210"
            //                 value={formDto.client?.phone || ""}
            //                 onChange={(e) =>
            //                   setFormDto({
            //                     ...formDto,
            //                     // client: e.target.value,
            //                   })
            //                 }
            //                 className="rounded-xl border-gray-200"
            //               />
            //             </div>
            //             <div className="space-y-2">
            //               <Label
            //                 htmlFor="accessories"
            //                 className="text-gray-700"
            //               >
            //                 Accessories Received
            //               </Label>
            //             </div>
            //           </div>
            //         </div>

            //         {/* Device Information */}
            //         <div className="space-y-4">
            //           <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            //             <Laptop className="w-4 h-4 text-blue-600" />
            //             <h3 className="text-gray-800">Device Information</h3>
            //           </div>
            //           <div className="grid grid-cols-2 gap-4">
            //             <div className="space-y-2">
            //               <Label htmlFor="brand" className="text-gray-700">
            //                 Brand
            //               </Label>
            //               <div className="flex gap-2">
            //                 <Select
            //                   value={formDto.brand}
            //                   onValueChange={handleBrandChange}
            //                 >
            //                   <SelectTrigger
            //                     id="brand"
            //                     className="rounded-xl border-gray-200 flex-1"
            //                   >
            //                     <SelectValue placeholder="Select brand" />
            //                   </SelectTrigger>
            //                   <SelectContent>
            //                     {availableBrands.map((brand) => (
            //                       <SelectItem key={brand} value={brand}>
            //                         {brand}
            //                       </SelectItem>
            //                     ))}
            //                   </SelectContent>
            //                 </Select>
            //                 <Popover
            //                   open={showBrandPopover}
            //                   onOpenChange={setShowBrandPopover}
            //                 >
            //                   <PopoverTrigger asChild>
            //                     <Button
            //                       variant="outline"
            //                       size="icon"
            //                       className="rounded-xl"
            //                     >
            //                       <Plus className="w-4 h-4" />
            //                     </Button>
            //                   </PopoverTrigger>
            //                   <PopoverContent className="w-80">
            //                     <div className="space-y-3">
            //                       <h4 className="font-medium text-sm">
            //                         Add New Brand
            //                       </h4>
            //                       <Input
            //                         placeholder="Brand name"
            //                         value={newBrand}
            //                         onChange={(e) =>
            //                           setNewBrand(e.target.value)
            //                         }
            //                         onKeyPress={(e) =>
            //                           e.key === "Enter" && addNewBrand()
            //                         }
            //                       />
            //                       <Button
            //                         onClick={addNewBrand}
            //                         className="w-full"
            //                       >
            //                         Add Brand
            //                       </Button>
            //                     </div>
            //                   </PopoverContent>
            //                 </Popover>
            //               </div>
            //             </div>
            //             <div className="space-y-2">
            //               <Label htmlFor="model" className="text-gray-700">
            //                 Model
            //               </Label>
            //               <div className="flex gap-2">
            //                 <Select
            //                   value={formDto.brand.model}
            //                   onValueChange={(value: any) =>
            //                     setFormDto({ ...formDto, brand: value })
            //                   }
            //                   disabled={!formDto.brand}
            //                 >
            //                   <SelectTrigger
            //                     id="model"
            //                     className="rounded-xl border-gray-200 flex-1"
            //                   >
            //                     <SelectValue
            //                       placeholder={
            //                         formDto.brand
            //                           ? "Select model"
            //                           : "Select brand first"
            //                       }
            //                     />
            //                   </SelectTrigger>
            //                   <SelectContent>
            //                     {availableModels.length > 0 ? (
            //                       availableModels.map((model) => (
            //                         <SelectItem key={model} value={model}>
            //                           {model}
            //                         </SelectItem>
            //                       ))
            //                     ) : (
            //                       <SelectItem value="no-models" disabled>
            //                         No models available
            //                       </SelectItem>
            //                     )}
            //                   </SelectContent>
            //                 </Select>
            //                 <Popover
            //                   open={showModelPopover}
            //                   onOpenChange={setShowModelPopover}
            //                 >
            //                   <PopoverTrigger asChild>
            //                     <Button
            //                       variant="outline"
            //                       size="icon"
            //                       className="rounded-xl"
            //                       disabled={!formDto.brand}
            //                     >
            //                       <Plus className="w-4 h-4" />
            //                     </Button>
            //                   </PopoverTrigger>
            //                   <PopoverContent className="w-80">
            //                     <div className="space-y-3">
            //                       <h4 className="font-medium text-sm">
            //                         Add New Model for {formDto.brand.brand}
            //                       </h4>
            //                       <Input
            //                         placeholder="Model name"
            //                         value={newModel}
            //                         onChange={(e) =>
            //                           setNewModel(e.target.value)
            //                         }
            //                         onKeyPress={(e) =>
            //                           e.key === "Enter" && addNewModel()
            //                         }
            //                       />
            //                       <Button
            //                         onClick={addNewModel}
            //                         className="w-full"
            //                       >
            //                         Add Model
            //                       </Button>
            //                     </div>
            //                   </PopoverContent>
            //                 </Popover>
            //               </div>
            //             </div>
            //           </div>
            //           <div className="grid grid-cols-2 gap-4">
            //             <div className="space-y-2">
            //               <Label htmlFor="color" className="text-gray-700">
            //                 Color
            //               </Label>
            //               <Input
            //                 id="color"
            //                 placeholder="e.g., Silver, Black"
            //                 value={formDto.color || ""}
            //                 onChange={(e) =>
            //                   setFormDto({ ...formDto, color: e.target.value })
            //                 }
            //                 className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
            //               />
            //             </div>
            //             <div className="space-y-2">
            //               <Label
            //                 htmlFor="serialNumber"
            //                 className="text-gray-700"
            //               >
            //                 Serial Number (Auto-generated)
            //               </Label>
            //               <Input
            //                 id="serialNumber"
            //                 placeholder="Auto-generated on brand selection"
            //                 value={formDto.serialNumber || ""}
            //                 readOnly
            //                 className="rounded-xl border-gray-200 bg-gray-50 cursor-not-allowed"
            //               />
            //               <p className="text-xs text-gray-500">
            //                 Serial number is automatically generated when you
            //                 select a brand
            //               </p>
            //             </div>
            //           </div>
            //         </div>

            //         {/* Issue Details */}
            //         <div className="space-y-4">
            //           <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            //             <FileText className="w-4 h-4 text-blue-600" />
            //             <h3 className="text-gray-800">Issue Details</h3>
            //           </div>
            //           <div className="space-y-2">
            //             <Label htmlFor="complaints" className="text-gray-700">
            //               Complaints *
            //             </Label>
            //             <div className="flex gap-2">
            //               <Select
            //                 value={formDto.complaint}
            //                 onValueChange={(value: any) =>
            //                   setFormDto({ ...formDto, complaint: value })
            //                 }
            //               >
            //                 <SelectTrigger
            //                   id="complaints"
            //                   className="rounded-xl border-gray-200 flex-1"
            //                 >
            //                   <SelectValue placeholder="Select complaint" />
            //                 </SelectTrigger>
            //                 <SelectContent>
            //                   {complaintsList.map((complaint) => (
            //                     <SelectItem key={complaint} value={complaint}>
            //                       {complaint}
            //                     </SelectItem>
            //                   ))}
            //                 </SelectContent>
            //               </Select>
            //               <Popover
            //                 open={showComplaintPopover}
            //                 onOpenChange={setShowComplaintPopover}
            //               >
            //                 <PopoverTrigger asChild>
            //                   <Button
            //                     variant="outline"
            //                     size="icon"
            //                     className="rounded-xl"
            //                   >
            //                     <Plus className="w-4 h-4" />
            //                   </Button>
            //                 </PopoverTrigger>
            //                 <PopoverContent className="w-80">
            //                   <div className="space-y-3">
            //                     <h4 className="font-medium text-sm">
            //                       Add New Complaint
            //                     </h4>
            //                     <Input
            //                       placeholder="Complaint description"
            //                       value={newComplaint}
            //                       onChange={(e) =>
            //                         setNewComplaint(e.target.value)
            //                       }
            //                       onKeyPress={(e) =>
            //                         e.key === "Enter" && addNewComplaint()
            //                       }
            //                     />
            //                     <Button
            //                       onClick={addNewComplaint}
            //                       className="w-full"
            //                     >
            //                       Add Complaint
            //                     </Button>
            //                   </div>
            //                 </PopoverContent>
            //               </Popover>
            //             </div>
            //           </div>
            //           <div className="space-y-2">
            //             <Label
            //               htmlFor="problemsIdentified"
            //               className="text-gray-700"
            //             >
            //               Problems Identified
            //             </Label>
            //             <Textarea
            //               id="problemsIdentified"
            //               placeholder="Detailed problems identified during diagnosis..."
            //               rows={3}
            //               value={formDto.problemsIdentified || ""}
            //               onChange={(e) =>
            //                 setFormDto({
            //                   ...formDto,
            //                   problemsIdentified: e.target.value,
            //                 })
            //               }
            //               className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
            //             />
            //           </div>
            //           <div className="space-y-2">
            //             <Label htmlFor="description" className="text-gray-700">
            //               Description
            //             </Label>
            //             <Textarea
            //               id="description"
            //               placeholder="Additional notes and description..."
            //               rows={3}
            //               value={formDto.description || ""}
            //               onChange={(e) =>
            //                 setFormDto({
            //                   ...formDto,
            //                   description: e.target.value,
            //                 })
            //               }
            //               className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
            //             />
            //           </div>
            //         </div>

            //         {/* Reception Details */}
            //         <div className="space-y-4">
            //           <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            //             <User className="w-4 h-4 text-blue-600" />
            //             <h3 className="text-gray-800">Reception Details</h3>
            //           </div>
            //           <div className="grid grid-cols-3 gap-4">
            //             <div className="space-y-2">
            //               <Label htmlFor="trayNumber" className="text-gray-700">
            //                 Tray Number
            //               </Label>
            //               <Select
            //                 value={formDto.tray}
            //                 onValueChange={(value: any) =>
            //                   setFormDto({ ...formDto, tray: value })
            //                 }
            //               >
            //                 <SelectTrigger
            //                   id="trayNumber"
            //                   className="rounded-xl border-gray-200"
            //                 >
            //                   <SelectValue placeholder="Select available tray" />
            //                 </SelectTrigger>
            //                 <SelectContent>
            //                   {getAvailableTrays().length > 0 ? (
            //                     getAvailableTrays().map((tray) => (
            //                       <SelectItem key={tray} value={tray}>
            //                         {tray}{" "}
            //                         <span className="text-green-600">
            //                           (Available)
            //                         </span>
            //                       </SelectItem>
            //                     ))
            //                   ) : (
            //                     <SelectItem value="no-trays" disabled>
            //                       No trays available
            //                     </SelectItem>
            //                   )}
            //                 </SelectContent>
            //               </Select>
            //               <p className="text-xs text-gray-500">
            //                 {getAvailableTrays().length} of {allTrays.length}{" "}
            //                 trays available
            //               </p>
            //             </div>
            //             <div className="space-y-2">
            //               <Label
            //                 htmlFor="receivedFrom"
            //                 className="text-gray-700"
            //               >
            //                 Received From
            //               </Label>
            //               <Input
            //                 id="receivedFrom"
            //                 placeholder="Client staff name"
            //                 value={formDto.receivedFrom || ""}
            //                 onChange={(e) =>
            //                   setFormDto({
            //                     ...formDto,
            //                     receivedFrom: e.target.value,
            //                   })
            //                 }
            //                 className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
            //               />
            //             </div>
            //             <div className="space-y-2">
            //               <Label htmlFor="receivedBy" className="text-gray-700">
            //                 Received By
            //               </Label>
            //               <Select
            //                 value={formDto.receivedBy}
            //                 onValueChange={(value: any) =>
            //                   setFormDto({ ...formDto, receivedBy: value })
            //                 }
            //               >
            //                 <SelectTrigger
            //                   id="receivedBy"
            //                   className="rounded-xl border-gray-200"
            //                 >
            //                   <SelectValue placeholder="Select technician" />
            //                 </SelectTrigger>
            //                 <SelectContent>
            //                   {techniciansList.map((tech) => (
            //                     <SelectItem key={tech} value={tech}>
            //                       {tech}
            //                     </SelectItem>
            //                   ))}
            //                 </SelectContent>
            //               </Select>
            //             </div>
            //           </div>
            //         </div>

            //         {/* Pricing & Timeline */}
            //         <div className="space-y-4">
            //           <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            //             <DollarSign className="w-4 h-4 text-blue-600" />
            //             <h3 className="text-gray-800">Pricing & Timeline</h3>
            //           </div>
            //           <div className="grid grid-cols-2 gap-4">
            //             <div className="space-y-2">
            //               <Label
            //                 htmlFor="estimateAmount"
            //                 className="text-gray-700"
            //               >
            //                 Estimate Amount (₹)
            //               </Label>
            //               <Input
            //                 id="estimateAmount"
            //                 type="number"
            //                 placeholder="5000"
            //                 value={formDto.estimateAmount || ""}
            //                 onChange={(e) =>
            //                   setFormDto({
            //                     ...formDto,
            //                     estimateAmount: Number(e.target.value),
            //                   })
            //                 }
            //                 className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
            //               />
            //             </div>
            //             <div className="space-y-2">
            //               <Label
            //                 htmlFor="estimateTime"
            //                 className="text-gray-700"
            //               >
            //                 Estimate Time (Hours)
            //               </Label>
            //               <Input
            //                 id="estimateTime"
            //                 type="number"
            //                 placeholder="24"
            //                 value={formDto.estimateTime || ""}
            //                 onChange={(e) =>
            //                   setFormDto({
            //                     ...formDto,
            //                     estimateTime: Number(e.target.value),
            //                   })
            //                 }
            //                 className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
            //               />
            //             </div>
            //           </div>
            //           <div className="grid grid-cols-2 gap-4">
            //             <div className="space-y-2">
            //               <Label
            //                 htmlFor="advancePayment"
            //                 className="text-gray-700"
            //               >
            //                 Advance Payment (₹)
            //               </Label>
            //               <Input
            //                 id="advancePayment"
            //                 type="number"
            //                 placeholder="2000"
            //                 value={formDto.advancePayment || ""}
            //                 onChange={(e) =>
            //                   setFormDto({
            //                     ...formDto,
            //                     advancePayment: Number(e.target.value),
            //                   })
            //                 }
            //                 className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
            //               />
            //             </div>
            //           </div>
            //         </div>

            //         {/* Picture Upload */}
            //         <div className="space-y-4">
            //           <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            //             <Upload className="w-4 h-4 text-blue-600" />
            //             <h3 className="text-gray-800">Picture Upload</h3>
            //           </div>
            //           <div className="space-y-2">
            //             <Label htmlFor="picture" className="text-gray-700">
            //               Device Picture
            //             </Label>
            //             <div className="flex items-center gap-3">
            //               <Input
            //                 id="picture"
            //                 type="file"
            //                 accept="image/*"
            //                 onChange={handleFileUpload}
            //                 className="hidden"
            //               />
            //               <Button
            //                 type="button"
            //                 variant="outline"
            //                 onClick={() =>
            //                   document.getElementById("picture")?.click()
            //                 }
            //                 className="rounded-xl"
            //               >
            //                 <Upload className="w-4 h-4 mr-2" />
            //                 Choose File
            //               </Button>
            //               {uploadedFileName && (
            //                 <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
            //                   <span className="text-sm text-blue-700">
            //                     {uploadedFileName}
            //                   </span>
            //                   <button
            //                     type="button"
            //                     onClick={() => {
            //                       setUploadedFileName("");
            //                       setFormDto({ ...formDto, picture: "" });
            //                     }}
            //                     className="text-blue-600 hover:text-blue-800"
            //                   >
            //                     <X className="w-4 h-4" />
            //                   </button>
            //                 </div>
            //               )}
            //             </div>
            //           </div>
            //         </div>
            //       </div>
            //     </ScrollArea>
            //     <div className="flex gap-3 pt-4 border-t">
            //       <Button
            //         variant="outline"
            //         onClick={() => {
            //           setIsDialogOpen(false);
            //           setFormDto({
            //             ...formDto,
            //             status: "Pending",
            //           });
            //           setUploadedFileName("");
            //         }}
            //         className="flex-1 rounded-xl"
            //       >
            //         Cancel
            //       </Button>
            //       <Button
            //         onClick={handleCreateJobSheet}
            //         className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl"
            //       >
            //         Create Job Sheet
            //       </Button>
            //     </div>
            //   </DialogContent>
            // </Dialog>