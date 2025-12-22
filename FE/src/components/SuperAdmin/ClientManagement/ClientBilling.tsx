import React from "react";
import { useState, useMemo, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Badge } from "../../ui/badge";
import { Calendar as CalendarIcon, IndianRupee, CreditCard, AlertCircle, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { toast } from "sonner";
import { cn } from "../../ui/utils";
import { crmApi } from "../../../api";
import { ClientDto, JobSheetDto } from "../../../dtos";

type DateFilterType = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';

export function ClientBilling() {
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [jobSheets, setJobSheets] = useState<JobSheetDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [dateFilterType, setDateFilterType] = useState<DateFilterType>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [discount, setDiscount] = useState<number>(0);

  // Fetch clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Fetch job sheets when client or date filter changes
  useEffect(() => {
    if (selectedClientId) {
      fetchJobSheets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClientId, dateFilterType, dateRange.from, dateRange.to]);

  const fetchClients = async () => {
    try {
      const response = await crmApi.client.getAll({});
      setClients(response.data.data || []);
    } catch (error) {
      console.error("Failed to load clients:", error);
      toast.error("Failed to load clients");
    }
  };

  const fetchJobSheets = async () => {
    if (!selectedClientId) return;

    setLoading(true);
    try {
      let fromDate = "";
      let toDate = "";

      // Calculate date range based on filter type
      if (dateFilterType !== 'all') {
        const today = new Date();

        switch (dateFilterType) {
          case 'today':
            fromDate = format(today, 'yyyy-MM-dd');
            toDate = format(today, 'yyyy-MM-dd');
            break;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            fromDate = format(weekAgo, 'yyyy-MM-dd');
            toDate = format(today, 'yyyy-MM-dd');
            break;
          case 'month':
            fromDate = format(startOfMonth(today), 'yyyy-MM-dd');
            toDate = format(endOfMonth(today), 'yyyy-MM-dd');
            break;
          case 'year':
            fromDate = format(startOfYear(today), 'yyyy-MM-dd');
            toDate = format(endOfYear(today), 'yyyy-MM-dd');
            break;
          case 'custom':
            if (dateRange.from && dateRange.to) {
              fromDate = format(dateRange.from, 'yyyy-MM-dd');
              toDate = format(dateRange.to, 'yyyy-MM-dd');
            }
            break;
        }
      }

      const params = {
        client: selectedClientId,
        fromDate,
        toDate,
        limit: -1, // Get all job sheets
      };

      const response = await crmApi.jobSheet.getAll(params);
      setJobSheets(response.data.items || []);
    } catch (error) {
      console.error("Failed to load job sheets:", error);
      toast.error("Failed to load job sheets");
    } finally {
      setLoading(false);
    }
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  // Format amount to Indian currency
  const formatAmount = (amount: number | undefined): string => {
    if (!amount) return "₹0";
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Helper functions for status checking
  const isDeliveredStatus = (status: string): boolean => {
    return status === 'Delivered' || status === 'Not Repairable - Delivered' || status === 'Repair Declined - Delivered';
  };

  const isNotRepairableStatus = (status: string): boolean => {
    return status === 'Not Repairable' || status === 'Not Repairable - Delivered';
  };

  const isRepairDeclinedStatus = (status: string): boolean => {
    return status === 'Repair Declined' || status === 'Repair Declined - Delivered';
  };

  // Filter job sheets by status (All delivered types, Not Repairable variants, Repair Declined variants, and Paid)
  const deliveredJobSheets = useMemo(() => {
    return jobSheets.filter(
      js => isDeliveredStatus(js.status) || isNotRepairableStatus(js.status) || isRepairDeclinedStatus(js.status) || js.status === 'Paid'
    );
  }, [jobSheets]);

  // Calculate amounts by category
  const categoryAmounts = useMemo(() => {
    // Delivered = only normal "Delivered" status (fully completed)
    const delivered = jobSheets.filter(js => js.status === 'Delivered');
    // Not Repairable = both "Not Repairable" and "Not Repairable - Delivered"
    const notRepairable = jobSheets.filter(js => isNotRepairableStatus(js.status));
    // Repair Declined = both "Repair Declined" and "Repair Declined - Delivered"
    const repairDeclined = jobSheets.filter(js => isRepairDeclinedStatus(js.status));
    const paid = jobSheets.filter(js => js.status === 'Paid');

    return {
      delivered: {
        count: delivered.length,
        total: delivered.reduce((sum, js) => sum + (Number(js.totalAmount) || Number(js.estimateAmount) || 0), 0),
        paid: delivered.reduce((sum, js) => sum + (Number(js.amountPaid) || 0), 0),
      },
      notRepairable: {
        count: notRepairable.length,
        total: notRepairable.reduce((sum, js) => sum + (Number(js.totalAmount) || Number(js.estimateAmount) || 0), 0),
        paid: notRepairable.reduce((sum, js) => sum + (Number(js.amountPaid) || 0), 0),
      },
      repairDeclined: {
        count: repairDeclined.length,
        total: repairDeclined.reduce((sum, js) => sum + (Number(js.totalAmount) || Number(js.estimateAmount) || 0), 0),
        paid: repairDeclined.reduce((sum, js) => sum + (Number(js.amountPaid) || 0), 0),
      },
      paid: {
        count: paid.length,
        total: paid.reduce((sum, js) => sum + (Number(js.totalAmount) || Number(js.estimateAmount) || 0), 0),
        paid: paid.reduce((sum, js) => sum + (Number(js.amountPaid) || 0), 0),
      },
    };
  }, [jobSheets]);

  // Calculate total amounts (using totalAmount if available, otherwise estimateAmount)
  const totalAmount = deliveredJobSheets.reduce((sum, js) => sum + (Number(js.totalAmount) || Number(js.estimateAmount) || 0), 0);
  const totalPaid = deliveredJobSheets.reduce((sum, js) => sum + (Number(js.amountPaid) || 0), 0);
  const totalBalance = totalAmount - totalPaid;

  // Calculate discount
  const discountAmount = (totalAmount * discount) / 100;
  const finalAmount = totalAmount - discountAmount;
  const finalBalance = finalAmount - totalPaid;

  // Mark selected job sheets as paid
  const handleMarkAsPaid = async () => {
    // Only mark non-paid job sheets as paid
    const jobSheetsToMark = deliveredJobSheets.filter(js => js.status !== 'Paid');
    
    if (jobSheetsToMark.length === 0) {
      toast.error("No job sheets to mark as paid");
      return;
    }

    try {
      // Calculate per-job-sheet amount after discount
      const jobSheetAmounts = jobSheetsToMark.map(js => {
        const jobAmount = Number(js.totalAmount) || Number(js.estimateAmount) || 0;
        // Apply discount proportionally
        const discountMultiplier = discount > 0 ? (1 - discount / 100) : 1;
        const finalJobAmount = jobAmount * discountMultiplier;
        return { id: Number(js.id), amountPaid: finalJobAmount };
      });

      // Update each job sheet to "Paid" status with the calculated amountPaid
      const updatePromises = jobSheetAmounts.map(({ id, amountPaid }) =>
        crmApi.jobSheet.update(id, { 
          status: "Paid",
          amountPaid: amountPaid
        })
      );

      await Promise.all(updatePromises);
      toast.success(`${jobSheetsToMark.length} job sheet(s) marked as paid`);

      // Refresh the job sheets list
      fetchJobSheets();
    } catch (error) {
      console.error("Failed to mark job sheets as paid:", error);
      toast.error("Failed to mark job sheets as paid");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-gray-900">Client Billing & Financial Management</h2>
          <p className="text-gray-600 mt-1">Track payments and manage client billing</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900">Filter Options</CardTitle>
          <CardDescription>Select a client and date range to view billing details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Client Selection */}
            <div className="space-y-2">
              <Label>Select Client</Label>
              <Select
                value={selectedClientId?.toString() || ""}
                onValueChange={(value) => setSelectedClientId(value ? parseInt(value) : null)}
              >
                <SelectTrigger className="rounded-xl bg-white/50 border-gray-200/50">
                  <SelectValue placeholder="Choose a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name} ({client.clientType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter Type */}
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select
                value={dateFilterType}
                onValueChange={(value: DateFilterType) => setDateFilterType(value)}
              >
                <SelectTrigger className="rounded-xl bg-white/50 border-gray-200/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date Range */}
            {dateFilterType === 'custom' && (
              <div className="space-y-2">
                <Label>Custom Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left rounded-xl bg-white/50 border-gray-200/50",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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
                              setDateRange(prev => ({ ...prev, from: today }));
                            }}
                          >
                            Today
                          </Button>
                        </div>
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
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
                              setDateRange(prev => ({ ...prev, to: today }));
                            }}
                          >
                            Today
                          </Button>
                        </div>
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                          disabled={(date) => dateRange.from ? date < dateRange.from : false}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Discount */}
            <div className="space-y-2">
              <Label>Discount (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Enter discount %"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="rounded-xl bg-white/50 border-gray-200/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Show content only if client is selected */}
      {selectedClientId && (
        <>
          {loading ? (
            <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 rounded-2xl shadow-lg">
              <CardContent className="text-center py-12">
                <p className="text-gray-600">Loading job sheets...</p>
              </CardContent>
            </Card>
          ) : (
            <>

              <div className="flex justify-between">

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative group hover:shadow-xl transition-all min-w-[300px] flex-shrink-0">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                  <CardHeader className="pb-2 relative z-10">
                    <CardDescription className="text-blue-100 text-xs">Total Amount</CardDescription>
                    <CardTitle className="text-white text-2xl">{formatAmount(totalAmount)}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 pb-3">
                    {discount > 0 && (
                      <div className="text-xs text-blue-100">
                        After {discount}%: {formatAmount(finalAmount)}
                      </div>
                    )}
                    {!discount && (
                      <div className="flex items-center gap-1.5 text-blue-100">
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span className="text-xs">Charged</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white overflow-hidden relative group hover:shadow-xl transition-all min-w-[300px] flex-shrink-0">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                  <CardHeader className="pb-2 relative z-10">
                    <CardDescription className="text-emerald-100 text-xs">Amount Paid</CardDescription>
                    <CardTitle className="text-white text-2xl">{formatAmount(totalPaid)}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 pb-3">
                    <div className="flex items-center gap-1.5 text-emerald-100">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span className="text-xs">Received</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white overflow-hidden relative group hover:shadow-xl transition-all min-w-[300px] flex-shrink-0">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                  <CardHeader className="pb-2 relative z-10">
                    <CardDescription className="text-amber-100 text-xs">Balance Due</CardDescription>
                    <CardTitle className="text-white text-2xl">
                      {discount > 0 ? formatAmount(finalBalance) : formatAmount(totalBalance)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 pb-3">
                    <div className="flex items-center gap-1.5 text-amber-100">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span className="text-xs">Pending</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white overflow-hidden relative group hover:shadow-xl transition-all min-w-[300px] flex-shrink-0">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                  <CardHeader className="pb-2 relative z-10">
                    <CardDescription className="text-purple-100 text-xs">Total Jobs</CardDescription>
                    <CardTitle className="text-white text-2xl">{deliveredJobSheets.length}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 pb-3">
                    <div className="flex items-center gap-1.5 text-purple-100">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="text-xs">Job Sheets</span>
                    </div>
                  </CardContent>
                </Card>
              </div>


              {/* Category-wise Amount Breakdown */}
              <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 rounded-2xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-gray-900">Category-wise Breakdown</CardTitle>
                  <CardDescription>Amount breakdown by job status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Delivered */}
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-600 text-white">Delivered</Badge>
                        <span className="text-sm text-gray-600">({categoryAmounts.delivered.count} jobs)</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total:</span>
                          <span className="text-gray-900">{formatAmount(categoryAmounts.delivered.total)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Paid:</span>
                          <span className="text-green-700">{formatAmount(categoryAmounts.delivered.paid)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Balance:</span>
                          <span className="text-orange-700">{formatAmount(categoryAmounts.delivered.total - categoryAmounts.delivered.paid)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Not Repairable */}
                    <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-red-600 text-white">Not Repairable</Badge>
                        <span className="text-sm text-gray-600">({categoryAmounts.notRepairable.count} jobs)</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total:</span>
                          <span className="text-gray-900">{formatAmount(categoryAmounts.notRepairable.total)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Paid:</span>
                          <span className="text-green-700">{formatAmount(categoryAmounts.notRepairable.paid)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Balance:</span>
                          <span className="text-orange-700">{formatAmount(categoryAmounts.notRepairable.total - categoryAmounts.notRepairable.paid)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Repair Declined */}
                    <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-amber-600 text-white">Repair Declined</Badge>
                        <span className="text-sm text-gray-600">({categoryAmounts.repairDeclined.count} jobs)</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total:</span>
                          <span className="text-gray-900">{formatAmount(categoryAmounts.repairDeclined.total)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Paid:</span>
                          <span className="text-green-700">{formatAmount(categoryAmounts.repairDeclined.paid)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Balance:</span>
                          <span className="text-orange-700">{formatAmount(categoryAmounts.repairDeclined.total - categoryAmounts.repairDeclined.paid)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Paid */}
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-purple-500 text-white">Paid</Badge>
                        <span className="text-sm text-gray-600">({categoryAmounts.paid.count} jobs)</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total:</span>
                          <span className="text-gray-900">{formatAmount(categoryAmounts.paid.total)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Paid:</span>
                          <span className="text-green-700">{formatAmount(categoryAmounts.paid.paid)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Balance:</span>
                          <span className="text-orange-700">{formatAmount(categoryAmounts.paid.total - categoryAmounts.paid.paid)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Sheets Table */}
              <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 rounded-2xl shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-gray-900">Job Sheets</CardTitle>
                      <CardDescription className="pt-1 text-sm">
                        Showing {deliveredJobSheets.length} job sheet(s) for {selectedClient?.name}
                      </CardDescription>
                    </div>
                    {deliveredJobSheets.filter(js => js.status !== 'Paid').length > 0 && (
                      <Button
                        onClick={handleMarkAsPaid}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Mark All as Paid
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {deliveredJobSheets.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No job sheets found for the selected filters</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-50 hover:to-indigo-50">
                            <TableHead className="text-gray-900">Job ID</TableHead>
                            <TableHead className="text-gray-900">Date</TableHead>
                            <TableHead className="text-gray-900">Service Type</TableHead>
                            <TableHead className="text-gray-900">Brand</TableHead>
                            <TableHead className="text-gray-900">Model</TableHead>
                            <TableHead className="text-gray-900">Status</TableHead>
                            <TableHead className="text-right text-gray-900">Total Amount</TableHead>
                            <TableHead className="text-right text-gray-900">Paid</TableHead>
                            <TableHead className="text-right text-gray-900">Balance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {deliveredJobSheets.map((jobSheet) => {
                            const total = Number(jobSheet.totalAmount) || Number(jobSheet.estimateAmount) || 0;
                            const paid = Number(jobSheet.amountPaid) || 0;
                            const balance = total - paid;

                            return (
                              <TableRow key={jobSheet.id} className="hover:bg-blue-50/50 transition-colors">
                                <TableCell>
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {jobSheet.id}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-gray-600">
                                  {format(new Date(jobSheet.createdOn), "dd MMM yyyy")}
                                </TableCell>
                                <TableCell className="text-gray-900">{jobSheet.serviceType}</TableCell>
                                <TableCell className="text-gray-600">{jobSheet.brand.brand}</TableCell>
                                <TableCell className="text-gray-600">{jobSheet.brand.model}</TableCell>
                                <TableCell>
                                  <Badge
                                    className={cn(
                                      "text-white",
                                    jobSheet.status === "Delivered" && "bg-green-600",
                                    isNotRepairableStatus(jobSheet.status) && "bg-red-600",
                                    isRepairDeclinedStatus(jobSheet.status) && "bg-amber-600",
                                    jobSheet.status === "Paid" && "bg-purple-500"
                                    )}
                                  >
                                    {jobSheet.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right text-gray-900">
                                  {formatAmount(total)}
                                </TableCell>
                                <TableCell className="text-right text-green-700">
                                  {formatAmount(paid)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <span className={cn(
                                    balance > 0 ? "text-orange-700" : "text-green-700"
                                  )}>
                                    {formatAmount(balance)}
                                  </span>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}

      {/* No client selected message */}
      {!selectedClientId && (
        <Card className="bg-white/80 backdrop-blur-xl border-gray-200/50 rounded-2xl shadow-lg">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-gray-900 mb-2">No Client Selected</h3>
            <p className="text-gray-600">Please select a client from the dropdown above to view billing details</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
