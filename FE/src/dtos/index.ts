export interface ClientDto {
  id: number;
  name: string;
  email?: string;
  phone: string;
  address: string;
  clientType: "Dealer" | "Customer";
  passwordIfDealer?: string;
}

export interface TechnicianDto {
  id: number;
  name: string;
  email?: string;
  password: string;
  phone: string;
  dob?: string | null;
  doj?: string | null;
  address?: string;
}

export interface JobSheetDto {
  id: string;
  client: ClientDto;
  serviceType:  "Chip level" | "OS installation / upgrades" | "Card level services" | "Warranty claim" | "Return complaint"
  deviceType: "UPS" | "Projector" | "Desktop" | "Laptop";
  brand: BrandDto;
  color: string;
  serialNumber: string;
  complaint: ComplaintDto;
  problemsIdentified?: string;
  tray: TrayDto;
  receivedFrom?: string;
  assignedTo?: TechnicianDto;
  receivedBy: TechnicianDto;
  estimateAmount?: number;
  amountPaid?: number;
  picture?: string; 
  status: "Pending" | "In Progress" | "Completed" | "Delivered" | "Waiting for Spares" | "Waiting for Customer Reply" | "Not Repairable" | "Repair Declined" | "Not Repairable - Delivered" | "Repair Declined - Delivered" | "Paid";
  createdOn: string;
  spares?: SparesDto;
  totalAmount?: number;
  fixSummary?: string;
}

export interface BrandDto {
  id: number;
  brand: string;
  model: string;
  description?: string;
}

export interface TrayDto {
  id: number;
  trayNumber: string;
  status: "Free" | "Occupied";
}

export interface ComplaintDto {
  id: number;
  description: string;
}

export interface SparesDto {
  id: number;
  product: string;
  description: string;
  amount?: string;
  billNumber?: string;
  status: "Requested" | "Approved" | "Purchase Initiated" | "Purchased" | "Delivered to Technician";
  salesPerson: SalesPersonDto;
  vendor?: VendorDto;
}

export interface SalesPersonDto{
  id: number;
  name: string;
  email?: string | null;
  password: string;
  phone: string;
  dob?: string | null;
  doj?: string | null;
  address?: string | null;
}

export interface VendorDto{
  id: number;
  name: string;
}

export interface jobSheetResDto {
  items: JobSheetDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
