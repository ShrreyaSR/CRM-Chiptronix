export interface ClientDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  clientType: "Dealer" | "Customer";
  passwordIfDealer: string;
}

export interface TechnicianDto {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  doj: string;
  idProofType?: string;
  idProof?: string;
  address?: string;
}

export interface JobSheetDto {
  id: string;
  client: ClientDto;
  deviceType: "UPS" | "Projector" | "Desktop" | "Laptop";
  brand: BrandDto;
  serviceType:  "Chip level" | "OS installation / upgrades" | "Card level services" | "Warranty claim" | "Return complaint"
  color: string;
  serialNumber: string;
  complaint: ComplaintDto;
  problemsIdentified?: string;
  tray: TrayDto;
  receivedFrom: string;
  assignedTo: TechnicianDto;
  receivedBy: TechnicianDto;
  estimateAmount?: number;
  estimateTime?: number;
  advancePayment?: number;
  description?: string;
  picture?: string; 
  status: "Pending" | "In Progress" | "Completed" | "Delivered" | "Waiting for Spares" | "Waiting for Customer Reply";
  createdOn: string;
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
  status?: "Free" | "Occupied";
}

export interface ComplaintDto {
  id: number;
  description: string;
}

export interface jobSheetResDto {
  items: JobSheetDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
