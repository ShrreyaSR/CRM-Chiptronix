import React from "react";
import { useState, useEffect, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
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
  Package,
  IndianRupeeIcon,
  Layers,
} from "lucide-react";
import { Calendar } from "../ui/calendar";
import { crmApi } from "../../api";
import {
  JobSheetDto,
  ClientDto,
  jobSheetResDto,
  SalesPersonDto,
  VendorDto,
} from "../../dtos";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { toast } from "sonner";

export function TechnicianOrders() {
  const navigate = useNavigate();
  const [jobSheets, setJobSheets] = useState<JobSheetDto[]>([]);
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

  const [jobSheetRes, setJobSheetsRes] = useState<jobSheetResDto>({
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  useEffect(() => {
    fetchData();
    fetchOrderData();
  }, []);

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

  const fetchData = async () => {
    try {
      const [clientRes] = await Promise.all([
        crmApi.client.getAll({}),
      ]);
      setClients(clientRes.data.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const getSpareStatusColor = (status: string) => {
    switch (status) {
      case "Requested":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Approved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Purchase Initiated":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Purchased":
        return "bg-green-100 text-green-800 border-green-200";
      case "Delivered to Technician":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpareStatus, setFilterSpareStatus] = useState<string>("all");
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
  const itemsPerPage = 10;
  const params = {
    search: searchTerm || "",
    client: filterClient !== "all" ? filterClient : "",
    fromDate: dateRange.from
      ? dateRange.from.toISOString().split("T")[0]
      : "",
    toDate: dateRange.to ? dateRange.to.toISOString().split("T")[0] : "",
    sortField,
    sortOrder: sortDirection,
    page: currentPage,
    limit: itemsPerPage,
    hasSpares: true, // Only show job sheets with spares
    spareStatus: filterSpareStatus !== "all" ? filterSpareStatus : "",
  };

  useEffect(() => {
    fetchJobSheets();
  }, [
    searchTerm,
    filterSpareStatus,
    filterClient,
    JSON.stringify(dateRange),
    sortField,
    sortDirection,
    currentPage,
  ]);


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
    // Convert client to number if needed
    const fixedParams = {
      ...params,
      client:
        typeof params.client === "string" && params.client !== ""
          ? Number(params.client)
          : undefined,
    };

    const res = await crmApi.jobSheet.getAll(fixedParams);

    // Filter out job sheets without spares as fallback
    const jobsWithSpares = res.data.items.filter((job) => job.spares);
    
    setJobSheets(jobsWithSpares);
    setJobSheetsRes({
      ...res.data,
      items: jobsWithSpares,
      total: jobsWithSpares.length,
    });
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



  // Reset to first page when filters change
  const resetPagination = () => setCurrentPage(1);




  return (
    <div className="space-y-6">
      {/* Job Sheet Table */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-white to-blue-50/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Spare Orders
              </CardTitle>
              <CardDescription className="mt-1">
                Manage and track all spare parts orders
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2 px-6 pb-6">
          {/* Search Bar */}
{/* Wrapper */}
<div className="mb-6 space-y-3">

  {/* 🔹 Row 1: Search + Filter */}
  <div className="flex flex-col lg:flex-row gap-4">

    {/* Search */}
    <div className="flex-1 relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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

    {/* Filter */}
    <div className="w-full lg:w-[320px]">
      <Select
        value={filterSpareStatus}
        onValueChange={(value) => {
          setFilterSpareStatus(value);
          resetPagination();
        }}
      >
        <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-gray-50/50">
          <Filter className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Filter by Spare Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Requested">Requested</SelectItem>
          <SelectItem value="Approved">Approved</SelectItem>
          <SelectItem value="Purchase Initiated">Purchase Initiated</SelectItem>
          <SelectItem value="Purchased">Purchased</SelectItem>
          <SelectItem value="Delivered to Technician">
            Delivered to Technician
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

  </div>

  {/* 🔹 Row 2: Active Filters (always below) */}
  {(filterSpareStatus !== "all" ||
    filterClient !== "all" ||
    dateRange.from) && (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-600">Active Filters:</span>

      {filterSpareStatus !== "all" && (
        <Badge variant="secondary" className="rounded-full">
          Status: {filterSpareStatus}
          <button
            onClick={() => {
              setFilterSpareStatus("all");
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
          setFilterSpareStatus("all");
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
                    <TableHead className="text-gray-700 min-w-[110px] whitespace-nowrap">
                      Job Number
                    </TableHead>
                    <TableHead className="text-gray-700 min-w-[200px] whitespace-nowrap">
                      Product
                    </TableHead>
                    <TableHead className="text-gray-700 min-w-[250px]">
                      Description
                    </TableHead>
                    <TableHead className="text-gray-700 min-w-[120px] whitespace-nowrap">
                      Amount
                    </TableHead>
                    <TableHead className="text-gray-700 min-w-[120px] whitespace-nowrap">
                      Bill Number
                    </TableHead>
                    <TableHead className="text-gray-700 min-w-[180px] whitespace-nowrap">
                      Status
                    </TableHead>
                    <TableHead className="text-gray-700 min-w-[150px] whitespace-nowrap">
                      Sales Person
                    </TableHead>
                    <TableHead className="text-gray-700 min-w-[150px] whitespace-nowrap">
                      Vendor
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobSheets.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-12 text-gray-500"
                      >
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    jobSheets.filter(job => job.spares).map((job) => (
                      <TableRow
                        key={job.id}
                        className="hover:bg-blue-50/30 transition-colors"
                      >
                        <TableCell className="text-blue-600 whitespace-nowrap font-semibold">
                          #{job.id}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-gray-900 font-medium">
                            {job.spares?.product || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <div
                            className="text-gray-700 line-clamp-2"
                            title={job.spares?.description || ""}
                          >
                            {job.spares?.description || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-gray-900 font-medium">
                            {job.spares?.amount ? `₹${job.spares.amount}` : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-gray-700">
                            {job.spares?.billNumber || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge
                            className={`${getSpareStatusColor(
                              job.spares?.status || ""
                            )} border rounded-lg px-3 py-1`}
                          >
                            {job.spares?.status || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-gray-900">
                            {job.spares?.salesPerson?.name || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-gray-900">
                            {job.spares?.vendor?.name || "N/A"}
                          </div>
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
                          className={`rounded-lg w-9 ${currentPage === pageNumber
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
                  className="bg-gray-100 text-gray-700 border-gray-200 border rounded-l px-3 py-1 text-sm"
                >
                  Job #{selectedJobSheet.id}
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
                      {selectedJobSheet.problemsIdentified}
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
                    navigate(`/technician/add-jobsheet?edit=${selectedJobSheet?.id}`);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex-1 sm:flex-none"
                >
                  <Edit className="w-2 h-2 mr-2" />
                  Edit Job Sheet
                </Button>

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
    </div>
  );
}

// Add handler function before the return statement




