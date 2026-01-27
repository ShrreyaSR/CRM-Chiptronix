import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Plus, User, Laptop, DollarSign, FileText, Upload, X, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";
import { crmApi } from "../../../api";
import { ClientDto, TechnicianDto, BrandDto, ComplaintDto, TrayDto, JobSheetDto, SalesPersonDto, VendorDto } from "../../../dtos";
import { toast } from "sonner";

interface AddJobSheetProps {
  onBack: () => void;
  jobSheetId?: string; // For edit mode
}

export function TechnicianAddJobSheet({ onBack, jobSheetId }: AddJobSheetProps) {
  const isEditMode = !!jobSheetId;
  
  // Debug log
  useEffect(() => {
    console.log("AddJobSheet mounted/updated - isEditMode:", isEditMode, "jobSheetId:", jobSheetId);
  }, [isEditMode, jobSheetId]);

  // Form data state
  const [formData, setFormData] = useState({
    clientId: "",
    serviceType: "" as "Chip level" | "OS installation / upgrades" | "Card level services" | "Warranty claim" | "Return complaint" | "",
    deviceType: "" as "UPS" | "Projector" | "Desktop" | "Laptop" | "",
    brandId: "",
    color: "",
    serialNumber: "",
    complaintIds: [] as string[],
    problemsIdentified: "",
    trayId: "",
    receivedFrom: "",
    receivedById: "",
    assignedToId: "none",
    estimateAmount: "",
    amountPaid: "",
    totalAmount: "",
    picture: "",
    status: "Pending" as "Pending" | "In Progress" | "Completed" | "Delivered" | "Waiting for Spares" | "Waiting for Customer Reply" | "Not Repairable" | "Repair Declined" | "Paid",
    fixSummary: "",
    // Spares fields (only for edit mode)
    spareProduct: "",
    spareDescription: "",
    spareAmount: "",
    spareBillNumber: "",
    spareStatus: "Requested" as "Requested" | "Approved" | "Purchase Initiated" | "Purchased" | "Delivered to Technician",
    spareSalesPersonId: "",
    spareVendorId: "",
  });

  // Data from backend
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [technicians, setTechnicians] = useState<TechnicianDto[]>([]);
  const [brands, setBrands] = useState<BrandDto[]>([]);
  const [complaints, setComplaints] = useState<ComplaintDto[]>([]);
  const [trays, setTrays] = useState<TrayDto[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<BrandDto[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedBrandName, setSelectedBrandName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [salesPersons, setSalesPersons] = useState<SalesPersonDto[]>([]);
  const [vendors, setVendors] = useState<VendorDto[]>([]);

  // Dialog states
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [isComplaintDialogOpen, setIsComplaintDialogOpen] = useState(false);
  const [isTrayDialogOpen, setIsTrayDialogOpen] = useState(false);
  const [isTechnicianDialogOpen, setIsTechnicianDialogOpen] = useState(false);

  // Form data for dialogs
  const [clientFormData, setClientFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    clientType: "Customer" as "Customer" | "Dealer",
    passwordIfDealer: "",
  });

  const [brandFormData, setBrandFormData] = useState({
    brand: "",
    model: "",
    description: "",
  });

  const [complaintFormData, setComplaintFormData] = useState({
    description: "",
  });

  const [trayFormData, setTrayFormData] = useState({
    numberOfTrays: 1,
  });

  const [technicianFormData, setTechnicianFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    doj: "",
    address: "",
  });

  // Fetch all data on mount
  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await fetchAllData();
      // Only fetch job sheet data after all reference data is loaded
      if (isEditMode && jobSheetId && fetchedData) {
        await fetchJobSheetData(fetchedData.brandsData);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobSheetId, isEditMode]);

  const fetchAllData = async () => {
    try {
      const [clientsRes, techniciansRes, brandsRes, complaintsRes, traysRes] = await Promise.all([
        crmApi.client.getAll({}),
        crmApi.technician.getAll({}),
        crmApi.model.getAll({}),
        crmApi.complaint.getAll({}),
        crmApi.tray.getAll({}),
      ]);

      const clientsData = clientsRes.data.data || [];
      const techniciansData = techniciansRes.data.data || [];
      const brandsData = brandsRes.data.data || [];
      const complaintsData = complaintsRes.data.data || [];
      const traysData = traysRes.data.data || [];

      setClients(clientsData);
      setTechnicians(techniciansData);
      setBrands(brandsData);
      setComplaints(complaintsData);
      setTrays(traysData);

      // Only fetch salesPersons and vendors in edit mode
      if (isEditMode) {
        const [salesPersonsRes, vendorsRes] = await Promise.all([
          crmApi.salesPerson.getAll({}),
          crmApi.vendor.getAll({}),
        ]);
        setSalesPersons(salesPersonsRes.data.data || []);
        setVendors(vendorsRes.data.data || []);
      }

      // Return the fetched data so fetchJobSheetData can use it
      return { brandsData, clientsData, techniciansData, complaintsData, traysData };
    } catch (error) {
      console.error("Failed to load data:", error);
      return { brandsData: [], clientsData: [], techniciansData: [], complaintsData: [], traysData: [] };
    }
  };

  const fetchJobSheetData = async (brandsData: BrandDto[]) => {
    if (!jobSheetId) return;
    setLoading(true);
    try {
      const response = await crmApi.jobSheet.getById(parseInt(jobSheetId));
      const jobSheet: JobSheetDto = response.data.data!;
      
      console.log("Loading job sheet data:", jobSheet);
      console.log("Form data before setting:", {
        clientId: jobSheet.client?.id.toString(),
        serviceType: jobSheet.serviceType,
        deviceType: jobSheet.deviceType,
        brandId: jobSheet.brand?.id.toString(),
        color: jobSheet.color,
      });
      
      setFormData({
        clientId: jobSheet.client?.id.toString() || "",
        serviceType: jobSheet.serviceType || "",
        deviceType: jobSheet.deviceType || "",
        brandId: jobSheet.brand?.id.toString() || "",
        color: jobSheet.color || "",
        serialNumber: jobSheet.serialNumber || "",
        complaintIds: Array.isArray(jobSheet.complaints)
          ? jobSheet.complaints.map(c => c.id.toString())
          : [],
        problemsIdentified: jobSheet.problemsIdentified || "",
        trayId: jobSheet.tray?.id.toString() || "",
        receivedFrom: jobSheet.receivedFrom || "",
        receivedById: jobSheet.receivedBy?.id.toString() || "",
        assignedToId: jobSheet.assignedTo?.id.toString() || "none",
        estimateAmount: jobSheet.estimateAmount?.toString() || "",
        amountPaid: jobSheet.amountPaid?.toString() || "",
        totalAmount: jobSheet.totalAmount?.toString() || "",
        picture: jobSheet.picture || "",
        status: jobSheet.status || "Pending",
        fixSummary: jobSheet.fixSummary || "",
        spareProduct: jobSheet.spares?.product || "",
        spareDescription: jobSheet.spares?.description || "",
        spareAmount: jobSheet.spares?.amount || "",
        spareBillNumber: jobSheet.spares?.billNumber || "",
        spareStatus: (jobSheet.spares?.status as any) || "Requested",
        spareSalesPersonId: jobSheet.spares?.salesPerson?.id.toString() || "",
        spareVendorId: jobSheet.spares?.vendor?.id.toString() || "",
      });
      
      if (jobSheet.picture) {
        setUploadedFileName(jobSheet.picture);
      }
      
      // Set selected model ID and populate available models using the fetched brands data
      if (jobSheet.brand?.id && brandsData.length > 0) {
        const brandId = jobSheet.brand.id.toString();
        // Find the exact brand/model entry from the job sheet
        const selectedBrandModel = brandsData.find(b => b.id === jobSheet.brand?.id);
        console.log("Selected brand model:", selectedBrandModel, "from brandsData length:", brandsData.length);
        if (selectedBrandModel) {
          // Set the brand name to filter models FIRST
          const brandName = selectedBrandModel.brand;
          setSelectedBrandName(brandName);
          // Get all models for this brand
          const models = brandsData.filter(b => b.brand === brandName);
          setAvailableModels(models);
          // Set the exact model ID from the job sheet
          setSelectedModelId(brandId);
          console.log("✅ Set brand name:", brandName, "model ID:", brandId, "available models:", models.length);
        } else {
          console.error("❌ Brand model not found for id:", jobSheet.brand.id);
        }
      } else {
        console.log("⚠️ Brand setup failed - brandId:", jobSheet.brand?.id, "brandsData length:", brandsData.length);
      }
      
      console.log("✅ Form data set:", {
        clientId: jobSheet.client?.id.toString(),
        brandId: jobSheet.brand?.id.toString(),
        complaintIds: Array.isArray(jobSheet.complaints)
          ? jobSheet.complaints.map(c => c.id.toString())
          : [],
        trayId: jobSheet.tray?.id.toString(),
        serviceType: jobSheet.serviceType,
        deviceType: jobSheet.deviceType,
      });
    } catch (error) {
      toast.error("Failed to load job sheet data");
      console.error("Error loading job sheet:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique brands (no duplicates)
  const uniqueBrands = Array.from(new Set(brands.map(b => b.brand))).sort();

  // Get free trays only (for add mode), or all trays (for edit mode)
  const availableTraysForSelection = isEditMode 
    ? trays // In edit mode, show all trays so current tray can be selected
    : trays.filter(t => t.status === "Free"); // In add mode, only show free trays

  // Sync selectedBrandName with formData.brandId when brands are loaded (for edit mode)
  useEffect(() => {
    if (isEditMode && formData.brandId && brands.length > 0 && !selectedBrandName) {
      const selectedBrand = brands.find(b => b.id.toString() === formData.brandId);
      if (selectedBrand) {
        setSelectedBrandName(selectedBrand.brand);
        const models = brands.filter(b => b.brand === selectedBrand.brand);
        setAvailableModels(models);
        if (!selectedModelId) {
          setSelectedModelId(formData.brandId);
        }
      }
    }
  }, [formData.brandId, brands, isEditMode, selectedBrandName, selectedModelId]);

  // Update available models when brand name changes
  useEffect(() => {
    if (selectedBrandName && brands.length > 0) {
      const models = brands.filter(b => b.brand === selectedBrandName);
      setAvailableModels(models);
      
      // Only generate serial number in add mode (not edit mode)
      if (!isEditMode) {
        const serialNumber = generateSerialNumber(selectedBrandName);
        setFormData(prev => ({ ...prev, serialNumber }));

        // If only one model, auto-select it
        if (models.length === 1) {
          setSelectedModelId(models[0].id.toString());
          setFormData(prev => ({ ...prev, brandId: models[0].id.toString() }));
        } else {
          setSelectedModelId("");
          setFormData(prev => ({ ...prev, brandId: "" }));
        }
      } else {
        // In edit mode, ensure the model is selected based on formData.brandId
        if (formData.brandId) {
          const matchingModel = models.find(m => m.id.toString() === formData.brandId);
          if (matchingModel && selectedModelId !== formData.brandId) {
            setSelectedModelId(formData.brandId);
          }
        }
      }
    } else if (!selectedBrandName && !isEditMode) {
      // Only clear in add mode, not edit mode
      setAvailableModels([]);
      setSelectedModelId("");
      setFormData(prev => ({ ...prev, brandId: "" }));
    }
  }, [selectedBrandName, brands, isEditMode, formData.brandId, selectedModelId]);

  // Helper functions
  const generateSerialNumber = (brand: string): string => {
    const prefix = brand.substring(0, 2).toUpperCase();
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}${timestamp}${random}`;
  };

  // Handle create/update job sheet
  const handleSaveJobSheet = async () => {
    if (!formData.clientId || !formData.serviceType || !formData.deviceType || formData.complaintIds.length === 0 || !formData.receivedById) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const selectedComplaints = complaints.filter(c =>
        formData.complaintIds.includes(c.id.toString())
      );

      const jobSheetData: any = {
        client: parseInt(formData.clientId),
        serviceType: formData.serviceType,
        deviceType: formData.deviceType,
        brand: parseInt(formData.brandId),
        color: formData.color,
        serialNumber: formData.serialNumber,
        complaints: selectedComplaints.map(c => c.id),
        problemsIdentified: formData.problemsIdentified || undefined,
        tray: parseInt(formData.trayId),
        receivedFrom: formData.receivedFrom || undefined,
        receivedBy: parseInt(formData.receivedById),
        assignedTo: formData.assignedToId && formData.assignedToId !== "none" ? parseInt(formData.assignedToId) : undefined,
        estimateAmount: formData.estimateAmount ? parseFloat(formData.estimateAmount) : undefined,
        amountPaid: formData.amountPaid ? parseFloat(formData.amountPaid) : undefined,
        totalAmount: isEditMode && formData.totalAmount ? parseFloat(formData.totalAmount) : undefined,
        picture: formData.picture || undefined,
        status: isEditMode ? formData.status : "Pending", // Default to Pending for new job sheets
        fixSummary: isEditMode ? (formData.fixSummary || undefined) : undefined,
      };

      // Add spares if spares data exists (only in edit mode)
      if (isEditMode && formData.spareProduct && formData.spareDescription && formData.spareSalesPersonId && formData.spareVendorId) {
        jobSheetData.spares = {
          product: formData.spareProduct,
          description: formData.spareDescription,
          amount: formData.spareAmount || undefined,
          billNumber: formData.spareBillNumber || undefined,
          status: formData.spareStatus,
          salesPerson: parseInt(formData.spareSalesPersonId),
          vendor: parseInt(formData.spareVendorId),
        };
      } else if (isEditMode && (formData.spareProduct || formData.spareDescription || formData.spareSalesPersonId || formData.spareVendorId)) {
        // If any spares field is partially filled but not complete, clear it
        // This handles the case where user removes spares data
        jobSheetData.spares = null;
      }

      if (isEditMode && jobSheetId) {
        await crmApi.jobSheet.update(parseInt(jobSheetId), jobSheetData);
        toast.success("Job sheet updated successfully");
      } else {
        await crmApi.jobSheet.create(jobSheetData);
        toast.success("Job sheet created successfully");
      }
      onBack();
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} job sheet`);
      console.error(error);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setFormData({ ...formData, picture: file.name });
    }
  };

  // Handle add client
  const handleAddClient = async () => {
    if (!clientFormData.name || !clientFormData.phone || !clientFormData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const newClient = await crmApi.client.create(clientFormData);
      await fetchAllData();
      setFormData({ ...formData, clientId: newClient.data.data?.id.toString() || "" });
      setIsClientDialogOpen(false);
      setClientFormData({ name: "", email: "", phone: "", address: "", clientType: "Customer", passwordIfDealer: "" });
      toast.success("Client added successfully");
    } catch (error) {
      toast.error("Failed to add client");
      console.error(error);
    }
  };

  // Handle add brand/model
  const handleAddBrand = async () => {
    if (!brandFormData.brand || !brandFormData.model) {
      toast.error("Please fill in brand and model");
      return;
    }

    try {
      await crmApi.model.create(brandFormData);
      await fetchAllData();
      setIsBrandDialogOpen(false);
      setBrandFormData({ brand: "", model: "", description: "" });
      toast.success("Brand/Model added successfully");
    } catch (error) {
      toast.error("Failed to add brand/model");
      console.error(error);
    }
  };

  // Handle add complaint
  const handleAddComplaint = async () => {
    if (!complaintFormData.description) {
      toast.error("Please enter complaint description");
      return;
    }

    try {
      const newComplaint = await crmApi.complaint.create(complaintFormData);
      await fetchAllData();
      setFormData(prev => ({
        ...prev,
        complaintIds: [
          ...prev.complaintIds,
          newComplaint.data.data?.id.toString() || "",
        ].filter(Boolean),
      }));
      setIsComplaintDialogOpen(false);
      setComplaintFormData({ description: "" });
      toast.success("Complaint added successfully");
    } catch (error) {
      toast.error("Failed to add complaint");
      console.error(error);
    }
  };

  // Handle add tray
  const handleAddTray = async () => {
    try {
      await crmApi.tray.bulkAdd({ totalCount: trayFormData.numberOfTrays });
      await fetchAllData();
      setIsTrayDialogOpen(false);
      setTrayFormData({ numberOfTrays: 1 });
      toast.success("Trays added successfully");
    } catch (error) {
      toast.error("Failed to add trays");
      console.error(error);
    }
  };
    
  // Handle add technician
  const handleAddTechnician = async () => {
    if (!technicianFormData.name || !technicianFormData.password || !technicianFormData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const newTechnician = await crmApi.technician.create(technicianFormData);
      await fetchAllData();
      setFormData({ ...formData, receivedById: newTechnician.data.data?.id.toString() || "" });
      setIsTechnicianDialogOpen(false);
      setTechnicianFormData({ name: "", email: "", password: "", phone: "", dob: "", doj: "", address: "" });
      toast.success("Technician added successfully");
    } catch (error) {
      toast.error("Failed to add technician");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="rounded-xl border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-gray-900">{isEditMode ? "Edit Job Sheet" : "Create New Job Sheet"}</h2>
            <p className="text-sm text-gray-500">{isEditMode ? "Update the job sheet details" : "Fill in the details to create a new repair job sheet"}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="rounded-xl border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveJobSheet}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg"
          >
            {loading ? "Loading..." : isEditMode ? "Update Job Sheet" : "Create Job Sheet"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card className="border-gray-200/50 shadow-lg rounded-2xl bg-white/80 backdrop-blur-xl">
        <CardContent className="p-8">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="grid gap-6 pr-4">
              {/* Client & Service Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="text-gray-800">Client & Service Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client" className="text-gray-700">Client *</Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.clientId}
                        onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                      >
                        <SelectTrigger id="client" className="rounded-xl border-gray-200 flex-1">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-xl"
                        onClick={() => setIsClientDialogOpen(true)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceType" className="text-gray-700">Service Type *</Label>
                    <Select
                      value={formData.serviceType}
                      onValueChange={(value: any) => setFormData({ ...formData, serviceType: value })}
                    >
                      <SelectTrigger id="serviceType" className="rounded-xl border-gray-200">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chip level">Chip level</SelectItem>
                        <SelectItem value="OS installation / upgrades">OS installation / upgrades</SelectItem>
                        <SelectItem value="Card level services">Card level services</SelectItem>
                        <SelectItem value="Warranty claim">Warranty claim</SelectItem>
                        <SelectItem value="Return complaint">Return complaint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deviceType" className="text-gray-700">Device Type *</Label>
                    <Select
                      value={formData.deviceType}
                      onValueChange={(value: any) => setFormData({ ...formData, deviceType: value })}
                    >
                      <SelectTrigger id="deviceType" className="rounded-xl border-gray-200">
                        <SelectValue placeholder="Select device type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UPS">UPS</SelectItem>
                        <SelectItem value="Projector">Projector</SelectItem>
                        <SelectItem value="Desktop">Desktop</SelectItem>
                        <SelectItem value="Laptop">Laptop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receivedFrom" className="text-gray-700">Received From</Label>
                    <Input
                      id="receivedFrom"
                      placeholder="Client staff name"
                      value={formData.receivedFrom}
                      onChange={(e) => setFormData({ ...formData, receivedFrom: e.target.value })}
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Device Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Laptop className="w-4 h-4 text-blue-600" />
                  <h3 className="text-gray-800">Device Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand" className="text-gray-700">Brand *</Label>
                    <div className="flex gap-2">
                    <Select
                        value={selectedBrandName}
                        onValueChange={(brandName) => {
                          setSelectedBrandName(brandName);
                        }}
                    >
                        <SelectTrigger id="brand" className="rounded-xl border-gray-200 flex-1">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                          {uniqueBrands.map((brandName) => (
                            <SelectItem key={brandName} value={brandName}>
                              {brandName}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                        onClick={() => setIsBrandDialogOpen(true)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-gray-700">Model *</Label>
                    <Select
                      value={selectedModelId}
                      onValueChange={(value) => {
                        setSelectedModelId(value);
                        setFormData({ ...formData, brandId: value });
                      }}
                      disabled={!formData.brandId || availableModels.length === 0}
                    >
                      <SelectTrigger id="model" className="rounded-xl border-gray-200">
                        <SelectValue placeholder={formData.brandId ? "Select model" : "Select brand first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.map((model) => (
                          <SelectItem key={model.id} value={model.id.toString()}>
                            {model.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color" className="text-gray-700">Color</Label>
                    <Input
                      id="color"
                      placeholder="e.g., Silver, Black"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber" className="text-gray-700">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      placeholder="Auto-generated"
                      value={formData.serialNumber}
                      readOnly
                      className="rounded-xl border-gray-200 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Issue Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="text-gray-800">Issue Details</h3>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complaints" className="text-gray-700">Complaints *</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-xl border-gray-200 flex-1 justify-between"
                        >
                          <span className={formData.complaintIds.length === 0 ? "text-gray-400" : ""}>
                            {formData.complaintIds.length === 0
                              ? "Select complaints"
                              : `${formData.complaintIds.length} complaint${formData.complaintIds.length > 1 ? "s" : ""} selected`}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[320px] p-0" align="start">
                        <div className="max-h-[220px] overflow-y-auto">
                          {complaints.length > 0 ? (
                            complaints.map((complaint) => {
                              const id = complaint.id.toString();
                              const selected = formData.complaintIds.includes(id);
                              return (
                                <button
                                  key={complaint.id}
                                  type="button"
                                  className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 ${
                                    selected ? "bg-blue-50" : ""
                                  }`}
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      complaintIds: selected
                                        ? prev.complaintIds.filter(cid => cid !== id)
                                        : [...prev.complaintIds, id],
                                    }));
                                  }}
                                >
                                  <span>{complaint.description}</span>
                                  {selected && (
                                    <span className="text-xs text-blue-600">
                                      Selected
                                    </span>
                                  )}
                                </button>
                              );
                            })
                          ) : (
                            <div className="px-2 py-6 text-sm text-center text-gray-500">
                              No complaints found
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl"
                      onClick={() => setIsComplaintDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="problemsIdentified" className="text-gray-700">Problems Identified</Label>
                  <Textarea
                    id="problemsIdentified"
                    placeholder="Detailed problems identified during diagnosis..."
                    rows={3}
                    value={formData.problemsIdentified}
                    onChange={(e) => setFormData({ ...formData, problemsIdentified: e.target.value })}
                    className="rounded-xl border-gray-200"
                  />
                </div>
              </div>

              {/* Reception Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="text-gray-800">Reception Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trayNumber" className="text-gray-700">Tray Number *</Label>
                    <div className="flex gap-2">
                    <Select
                        value={formData.trayId}
                        onValueChange={(value) => setFormData({ ...formData, trayId: value })}
                    >
                        <SelectTrigger id="trayNumber" className="rounded-xl border-gray-200 flex-1">
                        <SelectValue placeholder="Select available tray" />
                      </SelectTrigger>
                      <SelectContent>
                          {availableTraysForSelection.length > 0 ? (
                            availableTraysForSelection.map((tray) => (
                              <SelectItem key={tray.id} value={tray.id.toString()}>
                                {tray.trayNumber} {tray.status === "Free" && <span className="text-green-600">(Free)</span>}
                                {tray.status === "Occupied" && <span className="text-gray-500">(Occupied)</span>}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-trays" disabled>No trays available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                        onClick={() => setIsTrayDialogOpen(true)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {!isEditMode && (
                    <p className="text-xs text-gray-500">
                        {trays.filter(t => t.status === "Free").length} of {trays.length} trays available
                    </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receivedBy" className="text-gray-700">Received By *</Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.receivedById}
                        onValueChange={(value) => setFormData({ ...formData, receivedById: value })}
                      >
                        <SelectTrigger id="receivedBy" className="rounded-xl border-gray-200 flex-1">
                          <SelectValue placeholder="Select technician" />
                        </SelectTrigger>
                        <SelectContent>
                          {technicians.map((tech) => (
                            <SelectItem key={tech.id} value={tech.id.toString()}>
                              {tech.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-xl"
                        onClick={() => setIsTechnicianDialogOpen(true)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                  </div>
                  </div>
                </div>
                {/* Assigned To - Only in Edit Mode */}
                {isEditMode && (
                  <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="assignedTo" className="text-gray-700">Assigned To</Label>
                    <Select
                        value={formData.assignedToId}
                        onValueChange={(value) => setFormData({ ...formData, assignedToId: value })}
                    >
                        <SelectTrigger id="assignedTo" className="rounded-xl border-gray-200">
                          <SelectValue placeholder="Select technician (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                        {technicians.map((tech) => (
                            <SelectItem key={tech.id} value={tech.id.toString()}>
                              {tech.name}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                )}
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <h3 className="text-gray-800">Pricing</h3>
                </div>
                <div className={`grid gap-4 ${isEditMode ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  <div className="space-y-2">
                    <Label htmlFor="estimateAmount" className="text-gray-700">Estimate Amount (₹)</Label>
                    <Input
                      id="estimateAmount"
                      type="number"
                      placeholder="5000"
                      value={formData.estimateAmount}
                      onChange={(e) => setFormData({ ...formData, estimateAmount: e.target.value })}
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amountPaid" className="text-gray-700">Amount Paid (₹)</Label>
                    <Input
                      id="amountPaid"
                      type="number"
                      placeholder="2000"
                      value={formData.amountPaid}
                      onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                  {/* Total Amount - Only in Edit Mode and when status is Completed or Delivered */}
                  {isEditMode && (formData.status === "Completed" || formData.status === "Delivered") && (
                  <div className="space-y-2">
                      <Label htmlFor="totalAmount" className="text-gray-700">Total Amount (₹)</Label>
                    <Input
                        id="totalAmount"
                      type="number"
                        placeholder="5000"
                        value={formData.totalAmount}
                        onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                  )}
                </div>
              </div>

              {/* Fix Summary - Only in Edit Mode and when status is Completed or Delivered */}
              {isEditMode && (formData.status === "Completed" || formData.status === "Delivered") && (
              <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h3 className="text-gray-800">Fix Summary</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fixSummary" className="text-gray-700">Fix Summary</Label>
                    <Textarea
                      id="fixSummary"
                      placeholder="Summary of the fix applied..."
                      rows={4}
                      value={formData.fixSummary}
                      onChange={(e) => setFormData({ ...formData, fixSummary: e.target.value })}
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                </div>
              )}

              {/* Status - Only in Edit Mode, outside Spares Information */}
              {isEditMode && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <h3 className="text-gray-800">Status</h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-gray-700">Job Sheet Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger id="status" className="rounded-xl border-gray-200">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Waiting for Spares">Waiting for Spares</SelectItem>
                        <SelectItem value="Waiting for Customer Reply">Waiting for Customer Reply</SelectItem>
                        <SelectItem value="Not Repairable">Not Repairable</SelectItem>
                        <SelectItem value="Repair Declined">Repair Declined</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Spares Information - Only in Edit Mode and when spares data exists */}
              {isEditMode && (formData.spareProduct || formData.spareDescription || formData.spareSalesPersonId || formData.spareVendorId || formData.spareAmount || formData.spareBillNumber) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <Laptop className="w-4 h-4 text-blue-600" />
                    <h3 className="text-gray-800">Spares Information (Optional)</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="spareProduct" className="text-gray-700">Product</Label>
                    <Input
                        id="spareProduct"
                        placeholder="Product name"
                        value={formData.spareProduct}
                        onChange={(e) => setFormData({ ...formData, spareProduct: e.target.value })}
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                    <div className="space-y-2">
                      <Label htmlFor="spareStatus" className="text-gray-700">Status</Label>
                      <Select
                        value={formData.spareStatus}
                        onValueChange={(value: any) => setFormData({ ...formData, spareStatus: value })}
                      >
                        <SelectTrigger id="spareStatus" className="rounded-xl border-gray-200">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Requested">Requested</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="Purchase Initiated">Purchase Initiated</SelectItem>
                          <SelectItem value="Purchased">Purchased</SelectItem>
                          <SelectItem value="Delivered to Technician">Delivered to Technician</SelectItem>
                        </SelectContent>
                      </Select>
                </div>
              </div>
                  <div className="space-y-2">
                    <Label htmlFor="spareDescription" className="text-gray-700">Description</Label>
                    <Textarea
                      id="spareDescription"
                      placeholder="Spare part description..."
                      rows={2}
                      value={formData.spareDescription}
                      onChange={(e) => setFormData({ ...formData, spareDescription: e.target.value })}
                      className="rounded-xl border-gray-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="spareAmount" className="text-gray-700">Amount (₹)</Label>
                      <Input
                        id="spareAmount"
                        type="number"
                        placeholder="Amount"
                        value={formData.spareAmount}
                        onChange={(e) => setFormData({ ...formData, spareAmount: e.target.value })}
                        className="rounded-xl border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="spareBillNumber" className="text-gray-700">Bill Number</Label>
                      <Input
                        id="spareBillNumber"
                        placeholder="Bill number"
                        value={formData.spareBillNumber}
                        onChange={(e) => setFormData({ ...formData, spareBillNumber: e.target.value })}
                        className="rounded-xl border-gray-200"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="spareSalesPerson" className="text-gray-700">Sales Person</Label>
                      <Select
                        value={formData.spareSalesPersonId}
                        onValueChange={(value) => setFormData({ ...formData, spareSalesPersonId: value })}
                      >
                        <SelectTrigger id="spareSalesPerson" className="rounded-xl border-gray-200">
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
                    <div className="space-y-2">
                      <Label htmlFor="spareVendor" className="text-gray-700">Vendor</Label>
                      <Select
                        value={formData.spareVendorId}
                        onValueChange={(value) => setFormData({ ...formData, spareVendorId: value })}
                      >
                        <SelectTrigger id="spareVendor" className="rounded-xl border-gray-200">
                          <SelectValue placeholder="Select vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          {vendors.map((vendor) => (
                            <SelectItem key={vendor.id} value={vendor.id.toString()}>
                              {vendor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Picture */}
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="picture" className="text-gray-700">Device Picture</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="picture"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('picture')?.click()}
                    className="rounded-xl border-gray-200"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Picture
                  </Button>
                  {uploadedFileName && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{uploadedFileName}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          setUploadedFileName("");
                          setFormData({ ...formData, picture: "" });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add Client Dialog */}
      <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Add New Client</DialogTitle>
            <DialogDescription>Fill in the details to add a new client to the system</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name *</Label>
              <Input
                id="client-name"
                placeholder="Enter client name"
                value={clientFormData.name}
                onChange={(e) => setClientFormData({ ...clientFormData, name: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-email">Email</Label>
              <Input
                id="client-email"
                type="email"
                placeholder="client@example.com"
                value={clientFormData.email}
                onChange={(e) => setClientFormData({ ...clientFormData, email: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-phone">Phone Number *</Label>
              <Input
                id="client-phone"
                placeholder="Enter phone number"
                value={clientFormData.phone}
                onChange={(e) => setClientFormData({ ...clientFormData, phone: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-type">Client Type *</Label>
              <Select 
                value={clientFormData.clientType} 
                onValueChange={(value: "Customer" | "Dealer") => setClientFormData({ ...clientFormData, clientType: value })}
              >
                <SelectTrigger id="client-type" className="rounded-lg">
                  <SelectValue placeholder="Select client type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Dealer">Dealer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {clientFormData.clientType === "Dealer" && (
              <div className="space-y-2">
                <Label htmlFor="client-password">Dealer Password</Label>
                <Input
                  id="client-password"
                  type="password"
                  placeholder="Enter password"
                  value={clientFormData.passwordIfDealer}
                  onChange={(e) => setClientFormData({ ...clientFormData, passwordIfDealer: e.target.value })}
                  className="rounded-lg"
                />
              </div>
            )}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="client-address">Address *</Label>
              <Input
                id="client-address"
                placeholder="Enter full address"
                value={clientFormData.address}
                onChange={(e) => setClientFormData({ ...clientFormData, address: e.target.value })}
                className="rounded-lg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClientDialogOpen(false)} className="rounded-lg">Cancel</Button>
            <Button onClick={handleAddClient} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg">Add Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Brand/Model Dialog */}
      <Dialog open={isBrandDialogOpen} onOpenChange={setIsBrandDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add New Brand/Model</DialogTitle>
            <DialogDescription>Fill in the details to add a new brand and model</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Brand *</Label>
              <Input
                value={brandFormData.brand}
                onChange={(e) => setBrandFormData({ ...brandFormData, brand: e.target.value })}
              className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label>Model *</Label>
              <Input
                value={brandFormData.model}
                onChange={(e) => setBrandFormData({ ...brandFormData, model: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={brandFormData.description}
                onChange={(e) => setBrandFormData({ ...brandFormData, description: e.target.value })}
                className="rounded-lg resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBrandDialogOpen(false)} className="rounded-lg">Cancel</Button>
            <Button onClick={handleAddBrand} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg">Add Brand/Model</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Complaint Dialog */}
      <Dialog open={isComplaintDialogOpen} onOpenChange={setIsComplaintDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add New Complaint</DialogTitle>
            <DialogDescription>Describe the complaint type</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label>Complaint Description *</Label>
            <Textarea
              value={complaintFormData.description}
              onChange={(e) => setComplaintFormData({ ...complaintFormData, description: e.target.value })}
              className="rounded-lg min-h-[150px]"
              placeholder="Enter complaint description..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComplaintDialogOpen(false)} className="rounded-lg">Cancel</Button>
            <Button onClick={handleAddComplaint} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg">Add Complaint</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tray Dialog */}
      <Dialog open={isTrayDialogOpen} onOpenChange={setIsTrayDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add Multiple Trays</DialogTitle>
            <DialogDescription>Specify how many trays you want to add</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label>Number of Trays to Add</Label>
            <Input
              type="number"
              min="1"
              max="200"
              value={trayFormData.numberOfTrays}
              onChange={(e) => setTrayFormData({ numberOfTrays: parseInt(e.target.value) || 1 })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTrayDialogOpen(false)} className="rounded-lg">Cancel</Button>
            <Button onClick={handleAddTray} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg">Add Trays</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Technician Dialog */}
      <Dialog open={isTechnicianDialogOpen} onOpenChange={setIsTechnicianDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add New Technician</DialogTitle>
            <DialogDescription>Fill in the details to add a new technician</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={technicianFormData.name}
                onChange={(e) => setTechnicianFormData({ ...technicianFormData, name: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={technicianFormData.email}
                onChange={(e) => setTechnicianFormData({ ...technicianFormData, email: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label>Password *</Label>
              <Input
                type="password"
                value={technicianFormData.password}
                onChange={(e) => setTechnicianFormData({ ...technicianFormData, password: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input
                value={technicianFormData.phone}
                onChange={(e) => setTechnicianFormData({ ...technicianFormData, phone: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={technicianFormData.dob}
                onChange={(e) => setTechnicianFormData({ ...technicianFormData, dob: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label>Date of Joining</Label>
              <Input
                type="date"
                value={technicianFormData.doj}
                onChange={(e) => setTechnicianFormData({ ...technicianFormData, doj: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Address</Label>
              <Input
                value={technicianFormData.address}
                onChange={(e) => setTechnicianFormData({ ...technicianFormData, address: e.target.value })}
                className="rounded-lg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTechnicianDialogOpen(false)} className="rounded-lg">Cancel</Button>
            <Button onClick={handleAddTechnician} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg">Add Technician</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
