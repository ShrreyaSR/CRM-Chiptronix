import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Badge } from "../../ui/badge";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar as CalendarIcon, Calculator, DollarSign, FileText, TrendingUp, User, Filter, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "../../ui/utils";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { crmApi } from "../../../api";
import { TechnicianDto, JobSheetDto } from "../../../dtos";
import { toast } from "sonner";

type FilterType = 'thisWeek' | 'thisMonth' | 'customRange';

export function TechnicianSalaryCalculator() {
    const [technicians, setTechnicians] = useState<TechnicianDto[]>([]);
    const [jobSheets, setJobSheets] = useState<JobSheetDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>("");
    const [filterType, setFilterType] = useState<FilterType>('thisMonth');
    const [percentage, setPercentage] = useState<string>("");
    const [customStartDate, setCustomStartDate] = useState<Date>();
    const [customEndDate, setCustomEndDate] = useState<Date>();

    // Fetch technicians on mount
    useEffect(() => {
        const fetchTechnicians = async () => {
            try {
                const response = await crmApi.technician.getAll();
                setTechnicians(response.data.data || []);
            } catch (error) {
                toast.error("Failed to load technicians");
                console.error(error);
            }
        };
        fetchTechnicians();
    }, []);

    // Fetch job sheets when filters change
    useEffect(() => {
        const fetchJobSheets = async () => {
            if (!selectedTechnicianId) {
                setJobSheets([]);
                return;
            }

            setLoading(true);
            try {
                const { start, end } = getDateRange();
                const technicianId = parseInt(selectedTechnicianId);

                // Fetch jobs with multiple statuses
                // Include both variants: "Repair Declined" includes "Repair Declined - Delivered"
                // "Not Repairable" includes "Not Repairable - Delivered"
                // "Delivered" includes all delivered types
                const statuses = [
                    "Completed", 
                    "Delivered", 
                    "Not Repairable", 
                    "Not Repairable - Delivered",
                    "Repair Declined", 
                    "Repair Declined - Delivered",
                    "Paid"
                ];
                const jobSheetPromises = statuses.map(status =>
                    crmApi.jobSheet.getAll({
                        status: status,
                        completedFromDate: format(start, "yyyy-MM-dd"),
                        completedToDate: format(end, "yyyy-MM-dd"),
                        limit: -1, // Get all results
                    })
                );

                const responses = await Promise.all(jobSheetPromises);
                const allJobSheets = responses.flatMap(response => response.data.items || []);

                // Filter by selected technician (assignedTo)
                // Compare as numbers to ensure proper matching
                const filtered = allJobSheets.filter((job: JobSheetDto) => {
                    const assignedToId = job.assignedTo?.id;
                    return assignedToId !== undefined && Number(assignedToId) === technicianId;
                });

                // Deduplicate by job ID to avoid counting the same job multiple times if it appears in multiple status responses
                const uniqueJobSheets = Array.from(
                    new Map(filtered.map((job: JobSheetDto) => [job.id, job])).values()
                );

                setJobSheets(uniqueJobSheets);
            } catch (error) {
                toast.error("Failed to load job sheets");
                console.error(error);
                setJobSheets([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobSheets();
    }, [selectedTechnicianId, filterType, customStartDate, customEndDate]);

    // Get date range based on filter type
    const getDateRange = (): { start: Date; end: Date } => {
        const now = new Date();

        switch (filterType) {
            case 'thisWeek':
                return {
                    start: startOfWeek(now, { weekStartsOn: 1 }),
                    end: endOfWeek(now, { weekStartsOn: 1 })
                };
            case 'thisMonth':
                return {
                    start: startOfMonth(now),
                    end: endOfMonth(now)
                };
            case 'customRange':
                return {
                    start: customStartDate || now,
                    end: customEndDate || now
                };
            default:
                return { start: now, end: now };
        }
    };

    // Calculate totals
    const totalAmountCollected = jobSheets.reduce((sum, job) => {
        return sum + (Number(job.totalAmount) || 0);
    }, 0);

    const percentageValue = parseFloat(percentage) || 0;
    const calculatedSalary = (totalAmountCollected * percentageValue) / 100;

    const handleReset = () => {
        setSelectedTechnicianId("");
        setFilterType('thisMonth');
        setPercentage("");
        setCustomStartDate(undefined);
        setCustomEndDate(undefined);
    };

    const { start: rangeStart, end: rangeEnd } = getDateRange();
    const selectedTechnician = technicians.find(t => t.id.toString() === selectedTechnicianId);

    return (
        <div className="space-y-6">

            {/* Filters Card */}
            <Card className="border-gray-200/50 shadow-lg bg-white/80 backdrop-blur-xl">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex items-center justify-between">
                        {/* Left side: Title + Icon */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-blue-700" />
                            <CardTitle>Filters</CardTitle>
                        </div>

                        {/* Right side: Reset Button */}
                        <Button
                            onClick={handleReset}
                            variant="outline"
                            className="border-gray-200 hover:bg-gray-50"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reset
                        </Button>
                    </div>

                    <CardDescription className="mt-2">
                        Select technician, time period, and salary percentage
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Technician Selection */}
                        <div className="space-y-2">
                            <Label htmlFor="technician" className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-500" />
                                Select Technician
                            </Label>
                            <Select value={selectedTechnicianId} onValueChange={setSelectedTechnicianId}>
                                <SelectTrigger id="technician" className="bg-white border-gray-200">
                                    <SelectValue placeholder="Choose technician" />
                                </SelectTrigger>
                                <SelectContent>
                                    {technicians.map((tech) => (
                                        <SelectItem key={tech.id} value={tech.id.toString()}>
                                            {tech.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Time Period Filter */}
                        <div className="space-y-2">
                            <Label htmlFor="filterType" className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-gray-500" />
                                Time Period
                            </Label>
                            <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
                                <SelectTrigger id="filterType" className="bg-white border-gray-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="thisWeek">This Week</SelectItem>
                                    <SelectItem value="thisMonth">This Month</SelectItem>
                                    <SelectItem value="customRange">Custom Range</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Percentage Input */}
                        <div className="space-y-2">
                            <Label htmlFor="percentage" className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-gray-500" />
                                Salary Percentage (%)
                            </Label>
                            <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={percentage}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (value === "") {
                                        setPercentage("");
                                        return;
                                    }

                                    const num =value;
                                    if (Number(num) >= 0 && Number(num) <= 100) {
                                        setPercentage(num);
                                    }
                                }}
                            />

                        </div>

                        {/* Date Range Display/Selector */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-gray-500" />
                                Date Range
                            </Label>
                            {filterType === 'customRange' ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left bg-white border-gray-200",
                                                !customStartDate && "text-gray-500"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {customStartDate && customEndDate ? (
                                                <>
                                                    {format(customStartDate, "dd MMM")} - {format(customEndDate, "dd MMM, yyyy")}
                                                </>
                                            ) : (
                                                <span>Pick dates</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <div className="p-4 flex gap-4">
                                            <div>
                                                <Label className="text-xs mb-2 block">Start Date</Label>
                                                <Calendar
                                                    mode="single"
                                                    selected={customStartDate}
                                                    onSelect={setCustomStartDate}
                                                    initialFocus
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs mb-2 block">End Date</Label>
                                                <Calendar
                                                    mode="single"
                                                    selected={customEndDate}
                                                    onSelect={setCustomEndDate}
                                                    disabled={(date) => customStartDate ? date < customStartDate : false}
                                                />
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <div className="flex items-center h-10 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                                    {format(rangeStart, "dd MMM")} - {format(rangeEnd, "dd MMM, yyyy")}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            {selectedTechnicianId && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Jobs Card */}
                    <Card className="border-gray-200/50 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50/50 backdrop-blur-xl">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Jobs Completed</p>
                                    <p className="text-gray-900">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : jobSheets.length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Amount Card */}
                    <Card className="border-gray-200/50 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50/50 backdrop-blur-xl">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Amount Collected</p>
                                    <p className="text-gray-900">
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `₹${totalAmountCollected.toLocaleString('en-IN')}`}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Calculated Salary Card */}
                    <Card className="border-gray-200/50 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50/50 backdrop-blur-xl">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Calculated Salary {percentage && `(${percentage}%)`}
                                    </p>
                                    <p className="text-gray-900">₹{calculatedSalary.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-700 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Job Sheets Table */}
            {selectedTechnicianId && (
                <Card className="border-gray-200/50 shadow-lg bg-white/80 backdrop-blur-xl">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle>Completed Job Sheets</CardTitle>
                        <CardDescription>
                            All completed jobs by {selectedTechnician?.name || "technician"} in the selected period
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-16 text-center">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                                <p className="text-sm text-gray-500">Loading job sheets...</p>
                            </div>
                        ) : jobSheets.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50/50">
                                            <TableHead>Job ID</TableHead>
                                            <TableHead>Client</TableHead>
                                            <TableHead>Device</TableHead>
                                            <TableHead>Date Received</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Total Amount</TableHead>
                                            <TableHead>Amount Paid</TableHead>
                                            <TableHead className="text-right">
                                                {percentage && `Earnings (${percentage}%)`}
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {jobSheets.map((job) => {
                                            const amountPaid = Number(job.totalAmount) || 0;
                                            const earnings = (amountPaid * percentageValue) / 100;

                                            return (
                                                <TableRow key={job.id} className="hover:bg-blue-50/30">
                                                    <TableCell>
                                                        <span className="text-blue-600">#{job.id}</span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p>{job.client?.name || "--"}</p>
                                                            <p className="text-xs text-gray-500">{job.client?.phone || ""}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p>{job.brand?.brand} {job.brand?.model}</p>
                                                            <p className="text-xs text-gray-500">{job.serialNumber}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {job.completedOn
                                                            ? format(parseISO(job.completedOn), "dd MMM yyyy")
                                                            : job.createdOn
                                                                ? format(parseISO(job.createdOn), "dd MMM yyyy")
                                                                : "--"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "px-2 py-1 text-xs",
                                                                job.status === "Completed" && "bg-green-100 text-green-700 border-green-200",
                                                                job.status === "Delivered" && "bg-blue-100 text-blue-700 border-blue-200",
                                                                (job.status === "Not Repairable" || job.status === "Not Repairable - Delivered") && "bg-red-100 text-red-700 border-red-200",
                                                                (job.status === "Repair Declined" || job.status === "Repair Declined - Delivered") && "bg-orange-100 text-orange-700 border-orange-200",
                                                                job.status === "Paid" && "bg-purple-100 text-purple-700 border-purple-200"
                                                            )}
                                                        >
                                                            {job.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {job.totalAmount ? `₹${Number(job.totalAmount).toLocaleString('en-IN')}` : "--"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-green-600">
                                                            ₹{amountPaid.toLocaleString('en-IN')}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {percentage && (
                                                            <span className="text-purple-600">
                                                                ₹{earnings.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="p-16 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-gray-900 mb-2">No Completed Jobs Found</h3>
                                <p className="text-sm text-gray-500">
                                    {selectedTechnician?.name || "Technician"} has no completed jobs in the selected time period.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {!selectedTechnicianId && (
                <Card className="border-gray-200/50 shadow-lg bg-white/80 backdrop-blur-xl">
                    <CardContent className="p-16 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 mb-6">
                            <Calculator className="w-10 h-10 text-blue-600" />
                        </div>
                        <h3 className="text-gray-900 mb-2">Select a Technician</h3>
                        <p className="text-sm text-gray-500 max-w-md mx-auto">
                            Choose a technician from the dropdown above to view their completed jobs and calculate their salary based on a percentage of the amount collected.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
