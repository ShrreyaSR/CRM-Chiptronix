import React, { useState } from "react";
import { Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

/* ---------- Types ---------- */

interface SalesPersonDto {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface VendorDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  gst?: string;
}

type OrderStatus =
  | "Requested"
  | "Approved"
  | "Purchase Initiated"
  | "Purchased"
  | "Delivered to Technician";

interface CreateOrderPayload {
  product: string;
  description: string;
  amount?: string;
  billNumber?: string;
  status: OrderStatus;
  salesPerson: SalesPersonDto;
  vendor: VendorDto;
}

/* ---------- Component ---------- */

export function TechnicianOrders() {
  const [open, setOpen] = useState(false);

  const [product, setProduct] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [status, setStatus] = useState<OrderStatus>("Requested");
  const [selectedSalesPerson, setSelectedSalesPerson] =
    useState<number | null>(null);
  const [selectedVendor, setSelectedVendor] =
    useState<number | null>(null);

  /* ---------- Mock Data ---------- */

  const salesPersons: SalesPersonDto[] = [
    { id: 1, name: "Ravi Shankar", email: "ravi@chiptronix.com", phone: "9876543230" },
    { id: 2, name: "Anjali Mehta", email: "anjali@chiptronix.com", phone: "9876543231" },
  ];

  const vendors: VendorDto[] = [
    {
      id: 1,
      name: "TechSpares India Pvt Ltd",
      email: "sales@techspares.in",
      phone: "9876543240",
      address: "Delhi",
      gst: "07AABCT1234F1Z5",
    },
    {
      id: 2,
      name: "Laptop Components Hub",
      email: "info@lapcomponents.com",
      phone: "9876543241",
      address: "Bangalore",
    },
  ];

  /* ---------- Helpers ---------- */

  const getStatusColor = (status: OrderStatus) => {
    const map: Record<OrderStatus, string> = {
      Requested: "bg-yellow-100 text-yellow-800",
      Approved: "bg-blue-100 text-blue-800",
      "Purchase Initiated": "bg-indigo-100 text-indigo-800",
      Purchased: "bg-green-100 text-green-800",
      "Delivered to Technician": "bg-emerald-100 text-emerald-800",
    };
    return map[status];
  };

  /* ---------- Submit ---------- */

  const handleCreate = () => {
    if (!product || !selectedSalesPerson || !selectedVendor) return;

    const payload: CreateOrderPayload = {
      product,
      description,
      amount: amount || undefined,
      billNumber: billNumber || undefined,
      status,
      salesPerson: salesPersons.find(s => s.id === selectedSalesPerson)!,
      vendor: vendors.find(v => v.id === selectedVendor)!,
    };

    console.log("Create Order Payload:", payload);
    // 👉 API CALL HERE

    setOpen(false);

    // reset
    setProduct("");
    setDescription("");
    setAmount("");
    setBillNumber("");
    setStatus("Requested");
    setSelectedSalesPerson(null);
    setSelectedVendor(null);
  };

  /* ---------- UI ---------- */

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-700">
          <Package className="mr-2 h-4 w-4" />
          Create Spare Order
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Spare Parts Order</DialogTitle>
        </DialogHeader>

        <Card className="p-6 border-none shadow-none">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <Label>Product </Label>
              <Input className="mt-1" value={product} onChange={(e) => setProduct(e.target.value)} />
            </div>

            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea
              className="mt-1"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label>Sales Person</Label>
              <Select
                className="mt-1"
                value={selectedSalesPerson?.toString()}
                onValueChange={(v) => setSelectedSalesPerson(Number(v))}
              >
                <SelectTrigger className="mt-1">
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
              <Label>Vendor</Label>
              <Select
                className="mt-1"
                value={selectedVendor?.toString()}
                onValueChange={(v) => setSelectedVendor(Number(v))}
              >
                <SelectTrigger className="mt-1">
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
              <Label>Amount</Label>
              <Input className="mt-1" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>

            <div>
              <Label>Bill Number</Label>
              <Input className="mt-1" value={billNumber} onChange={(e) => setBillNumber(e.target.value)} />
            </div>

            <div className="col-span-2">
              <Label>Status</Label>
              <Select className="mt-1" value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(getStatusColor) as OrderStatus[])}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!product || !selectedSalesPerson || !description}
            >
              Create Order
            </Button>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
