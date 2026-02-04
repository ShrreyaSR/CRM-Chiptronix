import React from "react";
import { useState, useEffect, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Badge } from "../../ui/badge";
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
  IndianRupeeIcon,
  Layers,
} from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";
import { Calendar } from "../../ui/calendar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import { Separator } from "../../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { JobSheetBill } from "../../JobSheetBill";
import { SerialNumberBarcode } from "../../SerialNumberBarcode";
import { crmApi } from "../../../api";
import { useAuth } from "../../../contexts/AuthContext";
import {
  JobSheetDto,
  ClientDto,
  TrayDto,
  BrandDto,
  ComplaintDto,
  TechnicianDto,
  jobSheetResDto,
  SalesPersonDto,
  VendorDto,
} from "../../../dtos";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog";
import { toast } from "sonner";

export function TechnicianJobSheet() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const technicianId = user?.id;
  const [jobSheets, setJobSheets] = useState<JobSheetDto[]>([]);
  const [statsJobSheets, setStatsJobSheets] = useState<JobSheetDto[]>([]);
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [selectedJobSheet, setSelectedJobSheet] = useState<JobSheetDto>();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [salesPersons, setSalesPersons] = useState<SalesPersonDto[]>([]);
  const [vendors, setVendors] = useState<VendorDto[]>([]);
  
  // Order/Spare form data
  const [orderFormData, setOrderFormData] = useState({
    product: "",
    description: "",
    amount: "",
    billNumber: "",
    status: "Requested" as "Requested" | "Approved" | "Purchase Initiated" | "Purchased" | "Delivered to Technician",
    salesPersonId: "",
    vendorId: "",
  });

  // Status update dialog state (same pattern as SuperAdmin)
  const [statusUpdateDialog, setStatusUpdateDialog] = useState<{
    open: boolean;
    jobId: number | null;
    newStatus: string | null;
  }>({ open: false, jobId: null, newStatus: null });

  const [statusFormData, setStatusFormData] = useState({
    totalAmount: "",
    fixSummary: "",
    amountPaid: "",
  });

  const [jobSheetRes, setJobSheetsRes] = useState<jobSheetResDto>({
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  useEffect(() => {
    fetchStatsData();
    fetchOrderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [technicianId]);

  const fetchOrderData = async () => {
    try {
      const [salesPersonsRes, vendorsRes] = await Promise.all([
        crmApi.salesPerson.getAll({}),
        crmApi.vendor.getAll({}),
      ]);
      setSalesPersons(salesPersonsRes.data.data || []);
      setVendors(vendorsRes.data.data || []);
    } catch (error) {
      console.error("Failed to load order data:", error);
    }
  };

  const fetchStatsData = async () => {
    try {
      if (!technicianId) return;
      // Fetch unfiltered data for stats (only assignedTo filter)
      const [statsRes, clientRes] = await Promise.all([
        crmApi.jobSheet.getAll({ assignedTo: technicianId, limit: -1 }),
        crmApi.client.getAll({}),
      ]);
      setStatsJobSheets(statsRes.data.items || []);
      setClients(clientRes.data.data || []);
    } catch (err) {
      console.error("Error loading stats data:", err);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterClient, setFilterClient] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState<keyof JobSheetDto | "">("");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
      const params = {
      search: searchTerm || "",
      status: filterStatus !== "all" ? filterStatus : "",
      client: filterClient !== "all" ? filterClient : "",
      // always scoped to logged-in technician
      assignedTo: technicianId ? technicianId.toString() : "",
      fromDate: dateRange.from
        ? dateRange.from.toISOString().split("T")[0]
        : "",
      toDate: dateRange.to ? dateRange.to.toISOString().split("T")[0] : "",
      sortField,
      sortOrder: sortDirection,
      page: currentPage,
      limit: itemsPerPage,
    };

  useEffect(() => {
    fetchJobSheets();
  }, [
    searchTerm,
    filterStatus,
    filterClient,
    // scoped by logged-in technician, so no technician filter dependency
    JSON.stringify(dateRange),
    sortField,
    sortDirection,
    currentPage,
  ]);

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
      case "Not Repairable":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Repair Declined":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Paid":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Sorting function
  const handleSort = (field: keyof JobSheetDto) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortField(field);
      setSortDirection("ASC");
    }
  };

  const getSortIcon = (field: keyof JobSheetDto) => {
    if (sortField !== field)
      return (
        <ArrowUpDown className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50" />
      );
    return sortDirection === "ASC" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  const fetchJobSheets = async () => {
    if (!technicianId) return;
    // Convert client and assignedTo to numbers if needed, ensuring proper types for JobSheetQueryParams
    const fixedParams = {
      ...params,
      client:
        typeof params.client === "string"
          ? params.client === ""
            ? undefined
            : Number(params.client)
          : params.client,
      assignedTo: technicianId,
    };

    const res = await crmApi.jobSheet.getAll(fixedParams);

    setJobSheets(res.data.items);
    setJobSheetsRes(res.data);
  };

  // Handle create spare order
  const handleCreateOrder = async () => {
    if (!selectedJobSheet?.id) return;

    if (!orderFormData.product || !orderFormData.description || !orderFormData.salesPersonId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const updateData: any = {
        status: "Waiting for Spares" as const,
        spares: {
          product: orderFormData.product,
          description: orderFormData.description,
          amount: orderFormData.amount || undefined,
          billNumber: orderFormData.billNumber || undefined,
          status: orderFormData.status,
          salesPerson: parseInt(orderFormData.salesPersonId),
          vendor: parseInt(orderFormData.vendorId),
        },
      };

      await crmApi.jobSheet.update(Number(selectedJobSheet.id), updateData);
      toast.success("Spare order created successfully");
      
      // Reset form and close dialog
      setOrderFormData({
        product: "",
        description: "",
        amount: "",
        billNumber: "",
        status: "Requested",
        salesPersonId: "",
        vendorId: "",
      });
      setIsOrderDialogOpen(false);
      
      // Refresh job sheets and update selected job sheet
      await fetchJobSheets();
      await fetchStatsData();
      
      // Fetch updated job sheet data
      try {
        const response = await crmApi.jobSheet.getById(Number(selectedJobSheet.id));
        setSelectedJobSheet(response.data.data!);
      } catch (error) {
        console.error("Failed to refresh job sheet:", error);
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error("Failed to create spare order");
    }
  };

  // Helper to check delivered-like and paid statuses
  const isDeliveredLikeStatus = (status: string): boolean => {
    return (
      status === "Delivered" ||
      status === "Not Repairable - Delivered" ||
      status === "Repair Declined - Delivered"
    );
  };

  // Core status update function (without dialogs)
  const updateJobSheetStatus = async (
    jobId: number,
    newStatus: string,
    totalAmount?: number,
    fixSummary?: string,
    amountPaid?: number
  ) => {
    try {
      const updateData: any = {
        status: newStatus as
          | "Pending"
          | "In Progress"
          | "Completed"
          | "Waiting for Spares"
          | "Waiting for Customer Reply"
          | "Not Repairable"
          | "Repair Declined",
      };

      if (totalAmount !== undefined) {
        updateData.totalAmount = totalAmount;
      }
      if (fixSummary !== undefined) {
        updateData.fixSummary = fixSummary;
      }
      if (amountPaid !== undefined) {
        updateData.amountPaid = amountPaid;
      }

      await crmApi.jobSheet.update(jobId, updateData);
      toast.success("Status updated successfully");
      fetchJobSheets();
      fetchStatsData();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  // Handler to trigger status changes with dialogs (mirrors SuperAdmin behavior)
  const handleStatusUpdate = (jobId: number, newStatus: string) => {
    if (isDeliveredLikeStatus(newStatus) || newStatus === "Paid") {
      toast.error("You cannot move a job to a delivered or paid status.");
      return;
    }

    if (newStatus === "Completed" || newStatus === "Not Repairable" || newStatus === "Repair Declined") {
      // Open dialog for total amount and summary
      setStatusUpdateDialog({ open: true, jobId, newStatus });
      setStatusFormData({ totalAmount: "", fixSummary: "", amountPaid: "" });
    } else if (newStatus === "Waiting for Spares") {
      // For Waiting for Spares, open the spare order dialog
      const currentJob = jobSheets.find(j => Number(j.id) === jobId);
      if (currentJob) {
        setSelectedJobSheet(currentJob);
      }
      setIsOrderDialogOpen(true);
    } else {
      // For other statuses, update directly
      updateJobSheetStatus(jobId, newStatus);
    }
  };

  // Submit handler for status dialog (same fields as SuperAdmin)
  const handleStatusDialogSubmit = async () => {
    if (!statusUpdateDialog.jobId || !statusUpdateDialog.newStatus) return;

    const { jobId, newStatus } = statusUpdateDialog;

    if (newStatus === "Completed" || newStatus === "Not Repairable" || newStatus === "Repair Declined") {
      const totalAmount = statusFormData.totalAmount ? parseFloat(statusFormData.totalAmount) : undefined;
      const fixSummary = statusFormData.fixSummary.trim() || undefined;

      if (!totalAmount) {
        toast.error("Please enter total amount");
        return;
      }

      await updateJobSheetStatus(jobId, newStatus, totalAmount, fixSummary);
    } else if (newStatus === "Paid") {
      const amountPaid = statusFormData.amountPaid ? parseFloat(statusFormData.amountPaid) : undefined;

      if (!amountPaid) {
        toast.error("Please enter amount paid");
        return;
      }

      await updateJobSheetStatus(jobId, newStatus, undefined, undefined, amountPaid);
    }

    // Close dialog and reset form
    setStatusUpdateDialog({ open: false, jobId: null, newStatus: null });
    setStatusFormData({ totalAmount: "", fixSummary: "", amountPaid: "" });
  };

  // Reset to first page when filters change
  const resetPagination = () => setCurrentPage(1);

  // Helper function to get available status options based on current status
  const getAvailableStatusOptions = (currentStatus: string): string[] => {
    const allStatuses = [
      "Pending",
      "In Progress",
      "Completed",
      "Waiting for Spares",
      "Waiting for Customer Reply",
      "Not Repairable",
      "Repair Declined",
    ];

    // Locked statuses that cannot be changed (final states)
    const lockedStatuses = [
      "Paid",
      "Delivered",
      "Not Repairable - Delivered",
      "Repair Declined - Delivered",
    ];

    // If current status is a locked/final status -> No status change (return only current status)
    if (lockedStatuses.includes(currentStatus) || isDeliveredLikeStatus(currentStatus)) {
      return [currentStatus];
    }

    // If current status is "Pending" -> Show all statuses
    if (currentStatus === "Pending") {
      return allStatuses;
    }

    // If current status is "In Progress" -> Remove "Pending"
    if (currentStatus === "In Progress") {
      return allStatuses.filter((status) => status !== "Pending");
    }

    // If current status is "Completed", "Not Repairable", or "Repair Declined" -> No status change (return only current status)
    if (
      currentStatus === "Completed" ||
      currentStatus === "Not Repairable" ||
      currentStatus === "Repair Declined"
    ) {
      return [currentStatus];
    }

    // If current status is "Waiting for Spares" or "Waiting for Customer Reply" -> Remove "Pending" and "In Progress"
    if (
      currentStatus === "Waiting for Spares" ||
      currentStatus === "Waiting for Customer Reply"
    ) {
      return allStatuses.filter(
        (status) => status !== "Pending" && status !== "In Progress"
      );
    }

    // Default: return all statuses
    return allStatuses;
  };

  const stats = {
    total: statsJobSheets.length,
    pending: statsJobSheets.filter((j) => j.status === "Pending").length,
    inProgress: statsJobSheets.filter((j) => j.status === "In Progress").length,
    completed: statsJobSheets.filter((j) => j.status === "Completed").length,
    delivered: statsJobSheets.filter((j) =>
      isDeliveredLikeStatus(j.status)
    ).length,
    waitingSpares: statsJobSheets.filter((j) => j.status === "Waiting for Spares")
      .length,
    waitingCustomer: statsJobSheets.filter(
      (j) => j.status === "Waiting for Customer Reply"
    ).length,
  };



  function DeleteDialog({ open, onClose, onConfirm }: any) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the job sheet.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-500 text-white">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


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
                    className="h-9 rounded-xl border-gray-200 bg-gray-50/50 justify-start"
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
                  className="w-auto p-0"
                  side="bottom"
                  align="start"
                >
                  <div className="p-4 flex gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs">From Date</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => {
                            const today = new Date();
                            setDateRange({ from: today, to: dateRange.to });
                            resetPagination();
                          }}
                        >
                          Today
                        </Button>
                      </div>
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => {
                          setDateRange(prev => ({ ...prev, from: date }));
                          resetPagination();
                        }}
                        initialFocus
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs">To Date</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => {
                            const today = new Date();
                            setDateRange({ from: dateRange.from, to: today });
                            resetPagination();
                          }}
                        >
                          Today
                        </Button>
                      </div>
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => {
                          setDateRange(prev => ({ ...prev, to: date }));
                          resetPagination();
                        }}
                        disabled={(date) => dateRange.from ? date < dateRange.from : false}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 p-2 border-t">
                    <Button
                      variant="outline"
                      className="flex-1 h-8 px-2 text-xs"
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
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
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
                  <SelectItem value="Not Repairable">Not Repairable</SelectItem>
                  <SelectItem value="Repair Declined">Repair Declined</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Display */}
            {(filterStatus !== "all" ||
              filterClient !== "all" ||
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
                      className="text-gray-700 cursor-pointer group w-[120px] max-w-[120px] whitespace-nowrap overflow-hidden"
                      onClick={() => handleSort("id")}
                      style={{ width: '50px', maxWidth: '150px' }}
                    >
                      <div className="flex items-center truncate">
                        Job
                        {getSortIcon("id")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-gray-700 cursor-pointer group w-[100px] max-w-[100px] whitespace-nowrap overflow-hidden"
                      onClick={() => handleSort("client")}
                      style={{ width: '100px', maxWidth: '120px' }}
                    >
                      <div className="flex items-center truncate">
                        Client
                        {getSortIcon("client")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-gray-700 w-[200px] max-w-[200px] whitespace-nowrap overflow-hidden"
                      style={{ width: '100px', maxWidth: '100px' }}
                    >
                      <div className="flex items-center truncate">
                        Device

                      </div>

                    </TableHead>
                    <TableHead
                      className="text-gray-700 w-[300px] max-w-[300px] overflow-hidden"
                      style={{ width: '370px', maxWidth: '370px' }}
                    >
                      <div className="flex items-center truncate">
                        Complaints

                      </div>
                    </TableHead>
                    <TableHead
                      className="text-gray-700 cursor-pointer group w-[180px] max-w-[180px] whitespace-nowrap overflow-hidden"
                      onClick={() => handleSort("status")}
                      style={{ width: '120px', maxWidth: '180px' }}
                    >
                      <div className="flex items-center truncate">
                        Status
                        {getSortIcon("status")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-gray-700 cursor-pointer group w-[130px] max-w-[130px] whitespace-nowrap overflow-hidden"
                      onClick={() => handleSort("createdOn")}
                      style={{ width: '80px', maxWidth: '100px' }}
                    >
                      <div className="flex items-center truncate">
                        Created On
                        {getSortIcon("createdOn")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-gray-700 w-[100px] max-w-[100px] whitespace-nowrap overflow-hidden"
                      style={{ width: '30px', maxWidth: '50px' }}
                    >
                      Tray
                    </TableHead>

                    <TableHead
                      className="text-gray-700 text-right w-[150px] max-w-[150px] whitespace-nowrap overflow-hidden"
                      style={{ width: '120px', maxWidth: '150px' }}
                    >
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobSheetRes.total === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={11}
                        className="text-center py-12 text-gray-500"
                      >
                        No job sheets found
                      </TableCell>
                    </TableRow>
                  ) : (
                    jobSheets.map((job) => (
                      <TableRow
                        key={job.id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <TableCell
                          className="text-blue-600 whitespace-nowrap overflow-hidden"
                          style={{ width: '120px', maxWidth: '120px', minWidth: '120px' }}
                        >
                          <div className="truncate" title={String(job.id)}>
                            #{job.id}
                          </div>
                        </TableCell>
                        <TableCell
                          className="whitespace-nowrap overflow-hidden"
                          style={{ width: '150px', maxWidth: '150px', minWidth: '150px' }}
                        >
                          <div className="text-gray-900 truncate min-w-0" title={job.client.name}>
                            {job.client.name}
                          </div>
                        </TableCell>
                        <TableCell
                          className="whitespace-nowrap overflow-hidden"
                          style={{ width: '100px', maxWidth: '100px', minWidth: '100px' }}
                        >
                          <div className="min-w-0">
                            <div className="text-gray-900 truncate min-w-0" title={`${job.brand.brand} ${job.brand.model}`}>
                              {job.brand.brand} {job.brand.model}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          className="overflow-hidden"
                          style={{ width: '150px', maxWidth: '150px', minWidth: '150px' }}
                        >
                          <div
                            className="text-gray-700 line-clamp-2 min-w-0"
                            title={
                              Array.isArray(job.complaints)
                                ? job.complaints.map(c => c.description).join(", ")
                                : ""
                            }
                          >
                            {Array.isArray(job.complaints)
                              ? job.complaints.map(c => c.description).join(", ")
                              : ""}
                          </div>
                        </TableCell>
                        <TableCell
                          className="whitespace-nowrap overflow-hidden"
                          style={{ width: '180px', maxWidth: '180px', minWidth: '180px' }}
                        >
                          <div className="flex justify-end">
                            {(() => {
                              const availableStatuses = getAvailableStatusOptions(job.status);
                              const isDisabled = availableStatuses.length === 1;

                              return (
                                <Select
                                  value={job.status}
                                  onValueChange={(value) => handleStatusUpdate(Number(job.id), value)}
                                  disabled={isDisabled}
                                >
                                  <SelectTrigger className={`w-[160px] h-8 border-0 bg-transparent p-0 rounded-lg [&>svg]:hidden ${isDisabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-50'}`}>
                                    <Badge
                                      className={`${getStatusColor(
                                        job.status
                                      )} border rounded-lg px-3 py-1 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} w-full justify-center`}
                                    >
                                      {job.status}
                                    </Badge>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableStatuses.map((status) => (
                                      <SelectItem key={status} value={status}>
                                        {status}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              );
                            })()}
                          </div>
                        </TableCell>
                        
                        <TableCell className="whitespace-nowrap">
                          <div className="text-sm text-gray-700">
                            {job.createdOn.split("T")[0]}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 whitespace-nowrap">
                          {job.tray.trayNumber}
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
          {jobSheetRes.total > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {(jobSheetRes.page - 1) * jobSheetRes.limit + 1} to{" "}
                {Math.min(
                  jobSheetRes.limit * jobSheetRes.page,
                  jobSheetRes.total
                )}{" "}
                of {jobSheetRes.total} results
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
                  {Array.from(
                    { length: Math.min(5, jobSheetRes.totalPages) },
                    (_, i) => {
                      let pageNumber;
                      if (jobSheetRes.totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= jobSheetRes.totalPages - 2) {
                        pageNumber = jobSheetRes.totalPages - 4 + i;
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
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(jobSheetRes.totalPages, prev + 1)
                    )
                  }
                  disabled={currentPage === jobSheetRes.totalPages}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl">
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
                  )} border rounded-l px-3 py-1 text-sm`}
                >
                  {selectedJobSheet.status}
                </Badge>
                <div className="text-sm text-gray-500">
                  Created on: {selectedJobSheet.createdOn.split("T")[0]}
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
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.client.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Contact Number
                    </Label>
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.client.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs ">
                      Received From
                    </Label>
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.receivedFrom}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Received By (Technician)
                    </Label>
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.receivedBy.name}
                    </p>
                  </div>
                  
                    <div>
                    <Label className="text-gray-600 text-xs">
                      Assigned to (Technician)
                    </Label>
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.assignedTo?.name || "N/A"}
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
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.brand.brand}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">Model</Label>
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.brand.model}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">Color</Label>
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.color}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Serial Number
                    </Label>
                    <p className="text-gray-900 mt-1 font-mono text-sm font-medium">
                      {selectedJobSheet.serialNumber}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Service Type
                    </Label>
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.serviceType}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Device Type
                    </Label>
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.deviceType}
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
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                    {Array.isArray(selectedJobSheet.complaints)
                      ? selectedJobSheet.complaints.map(c => c.description).join(", ")
                      : ""}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Problems Identified
                    </Label>
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.problemsIdentified}
                    </p>
                  </div>
                  {selectedJobSheet.fixSummary && <div>
                    <Label className="text-gray-600 text-xs">
                      Fix Summary
                    </Label>
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.fixSummary}
                    </p>
                  </div>}
                </div>
              </div>

              {/* Financial & Logistics */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-green-700 pb-2 border-b border-green-200">
                  <IndianRupeeIcon className="w-5 h-5" />
                  <h3 className="font-semibold">Financial & Logistics</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Estimate Amount
                    </Label>
                    <p className="text-gray-900 mt-1 text-lg font-medium">
                      {selectedJobSheet.estimateAmount}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Amount Paid
                    </Label>
                    <p className="text-gray-900 mt-1 text-lg font-medium">
                      {selectedJobSheet.amountPaid}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">Tray Number</Label>
                    <p className="text-gray-900 mt-1 text-lg font-medium">
                      {selectedJobSheet.tray.trayNumber}
                    </p>
                  </div>
                  {selectedJobSheet.totalAmount && <div>
                    <Label className="text-gray-600 text-xs">Total Amount</Label>
                    <p className="text-gray-900 mt-1 text-lg font-medium">
                      {selectedJobSheet.totalAmount}
                    </p>
                  </div>}
                </div>
              </div>

              {/* Spares */}
              {selectedJobSheet.spares &&
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-purple-700 pb-2 border-b border-purple-200">
                  <Layers className="w-5 h-5" />
                  <h3 className="font-semibold">Spare Parts</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Product
                    </Label>
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.spares?.product}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">
                      Amount
                    </Label>
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.spares?.amount || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">Bill Number</Label>
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.spares?.billNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">Sales Person</Label>
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.spares?.salesPerson.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-xs">Vendor</Label>
                    <p className="text-gray-900 mt-1 text-sm font-medium">
                      {selectedJobSheet.spares?.vendor?.name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-8 pt-4 border-t">
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    setIsOrderDialogOpen(true);
                  }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex-1 sm:flex-none"
                  disabled={!!selectedJobSheet?.spares}
                >
                  <Package className="w-4 h-4 mr-2" />
                  {selectedJobSheet?.spares ? "Order Already Added" : "Add Spare Order"}
                </Button>

              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Spare Order Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-3xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Package className="w-6 h-6 text-green-600" />
              Create Spare Parts Order
            </DialogTitle>
            <DialogDescription>
              Add spare parts order for Job Sheet #{selectedJobSheet?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <Label htmlFor="product">Product *</Label>
                <Input
                  id="product"
                  value={orderFormData.product}
                  onChange={(e) => setOrderFormData({ ...orderFormData, product: e.target.value })}
                  placeholder="Enter product name"
                  className="rounded-xl border-gray-200 mt-1"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={orderFormData.description}
                  onChange={(e) => setOrderFormData({ ...orderFormData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={3}
                  className="rounded-xl border-gray-200 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="salesPerson">Sales Person *</Label>
                <Select
                  value={orderFormData.salesPersonId}
                  onValueChange={(value) => setOrderFormData({ ...orderFormData, salesPersonId: value })}
                >
                  <SelectTrigger className="rounded-xl border-gray-200 mt-1">
                    <SelectValue placeholder="Select sales person" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesPersons.map((sp) => (
                      <SelectItem key={sp.id} value={sp.id.toString()}>
                        {sp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vendor">Vendor</Label>
                <Select
                  value={orderFormData.vendorId}
                  onValueChange={(value) => setOrderFormData({ ...orderFormData, vendorId: value })}
                >
                  <SelectTrigger className="rounded-xl border-gray-200 mt-1">
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((v) => (
                      <SelectItem key={v.id} value={v.id.toString()}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={orderFormData.amount}
                  onChange={(e) => setOrderFormData({ ...orderFormData, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="rounded-xl border-gray-200 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="billNumber">Bill Number</Label>
                <Input
                  id="billNumber"
                  value={orderFormData.billNumber}
                  onChange={(e) => setOrderFormData({ ...orderFormData, billNumber: e.target.value })}
                  placeholder="Enter bill number"
                  className="rounded-xl border-gray-200 mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOrderDialogOpen(false);
                  setOrderFormData({
                    product: "",
                    description: "",
                    amount: "",
                    billNumber: "",
                    status: "Requested",
                    salesPersonId: "",
                    vendorId: "",
                  });
                }}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateOrder}
                disabled={!orderFormData.product || !orderFormData.description || !orderFormData.salesPersonId}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl"
              >
                Create Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog (same UX as SuperAdmin) */}
      <Dialog
        open={statusUpdateDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setStatusUpdateDialog({ open: false, jobId: null, newStatus: null });
            setStatusFormData({ totalAmount: "", fixSummary: "", amountPaid: "" });
          }
        }}
      >
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {statusUpdateDialog.newStatus === "Paid"
                ? "Enter Payment Information"
                : `Update Status to ${statusUpdateDialog.newStatus}`}
            </DialogTitle>
            <DialogDescription>
              {statusUpdateDialog.newStatus === "Paid"
                ? "Enter the amount paid for this job sheet"
                : "Enter total amount and fix summary for this job sheet"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-4">
            {statusUpdateDialog.newStatus === "Paid" ? (
              <div className="space-y-2">
                <Label htmlFor="amountPaid" className="text-gray-700">
                  Amount Paid (₹) *
                </Label>
                <Input
                  id="amountPaid"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter amount paid"
                  value={statusFormData.amountPaid}
                  onChange={(e) =>
                    setStatusFormData({ ...statusFormData, amountPaid: e.target.value })
                  }
                  className="rounded-xl border-gray-200"
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="totalAmount" className="text-gray-700">
                    Total Amount (₹) *
                  </Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter total amount"
                    value={statusFormData.totalAmount}
                    onChange={(e) =>
                      setStatusFormData({ ...statusFormData, totalAmount: e.target.value })
                    }
                    className="rounded-xl border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fixSummary" className="text-gray-700">
                    Fix Summary
                  </Label>
                  <Textarea
                    id="fixSummary"
                    placeholder="Enter fix summary (optional)"
                    rows={4}
                    value={statusFormData.fixSummary}
                    onChange={(e) =>
                      setStatusFormData({ ...statusFormData, fixSummary: e.target.value })
                    }
                    className="rounded-xl border-gray-200 resize-none"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setStatusUpdateDialog({ open: false, jobId: null, newStatus: null });
                setStatusFormData({ totalAmount: "", fixSummary: "", amountPaid: "" });
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusDialogSubmit}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl"
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
