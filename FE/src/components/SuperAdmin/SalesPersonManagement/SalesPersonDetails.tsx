import React from "react";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Search, UserPlus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "../../ui/badge";
import { crmApi } from "../../../api";
import { SalesPersonDto as SalesPerson } from "../../../dtos";
import { Alert } from "../../ui/alert";

/* =====================================================
    1) TOOLBAR COMPONENT
===================================================== */

function SalesPersonToolbar({
  searchQuery,
  setSearchQuery,
  onAddClick,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onAddClick: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search by name, email or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11 bg-white/50 border-gray-200/50 rounded-xl"
        />
      </div>

      <Button
        onClick={onAddClick}
        className="bg-gradient-to-r from-sales-500 to-sales-600 text-white h-11 px-6 rounded-xl hover:from-sales-600 hover:to-sales-700"
      >
        <UserPlus className="mr-2 h-5 w-5" />
        Add Sales Person
      </Button>
    </div>
  );
}

/* =====================================================
    2) TABLE COMPONENT
===================================================== */

function SalesPersonTable({
  salesPersons,
  showPassword,
  togglePassword,
  onEdit,
  onDelete,
}: {
  salesPersons: SalesPerson[];
  showPassword: { [key: number]: boolean };
  togglePassword: (id: number) => void;
  onEdit: (sp: SalesPerson) => void;
  onDelete: (sp: SalesPerson) => void;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-sales-50 to-sales-100">
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>DOJ</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {salesPersons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  No sales persons found
                </TableCell>
              </TableRow>
            ) : (
              salesPersons.map((sp) => (
                <TableRow key={sp.id} className="hover:bg-sales-50/50">
                  <TableCell>
                    <Badge variant="outline" className="bg-sales-50 text-sales-700 border-sales-200">
                      #{sp.id}
                    </Badge>
                  </TableCell>
                  <TableCell>{sp.name}</TableCell>
                  <TableCell>{sp.email}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>
                        {showPassword[sp.id] ? sp.password : "••••••"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => togglePassword(sp.id)}
                      >
                        {showPassword[sp.id] ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>{sp.phone}</TableCell>
                  <TableCell>
                    {sp.dob ? new Date(sp.dob).toLocaleDateString() : "--"}
                  </TableCell>
                  <TableCell>
                    {sp.doj ? new Date(sp.doj).toLocaleDateString() : "--"}
                  </TableCell>
                  <TableCell>{sp.address}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(sp)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(sp)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/* =====================================================
    3) ADD DIALOG
===================================================== */

function SalesPersonAddDialog({
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
}: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add New Sales Person</DialogTitle>
        </DialogHeader>

        <SalesPersonForm formData={formData} setFormData={setFormData} />

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!formData.name || !formData.password || !formData.phone}>Add Sales Person</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* =====================================================
    4) EDIT DIALOG
===================================================== */

function SalesPersonEditDialog({
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
}: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Sales Person</DialogTitle>
        </DialogHeader>

        <SalesPersonForm formData={formData} setFormData={setFormData} />

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancel
          </Button>

          <Button
            onClick={onSubmit}
            disabled={
              !formData.name ||
              !formData.password ||
              !formData.phone
            }
          >
            Update Sales Person
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* =====================================================
    SHARED FORM COMPONENT
===================================================== */

function SalesPersonForm({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <Label>
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="rounded-xl"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="rounded-xl"
        />
        {formData.email &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
            <p className="text-xs text-red-500">
              Please enter a valid email address
            </p>
          )}
      </div>

      <div className="space-y-2">
        <Label>
          Password <span className="text-red-500">*</span>
        </Label>
        <Input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="rounded-xl"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setFormData({ ...formData, phone: value });
          }}
          maxLength={10}
          placeholder="Enter  phone number"
          required
        />
        {formData.phone && formData.phone.length !== 10 && (
          <p className="text-xs text-red-500">
            Phone number must be 10 digits
          </p>
        )}
      </div>


      <div className="space-y-2">
        <Label>DOB</Label>
        <Input
          type="date"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>DOJ</Label>
        <Input
          type="date"
          value={formData.doj}
          onChange={(e) => setFormData({ ...formData, doj: e.target.value })}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label>Address</Label>
        <Input
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
      </div>
    </div>
  );
}

/* =====================================================
    5) DELETE DIALOG
===================================================== */

function SalesPersonDeleteDialog({
  open,
  onClose,
  salesPerson,
  onDelete,
}: any) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <b>{salesPerson?.name}</b> from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} className="bg-red-600 text-white">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* =====================================================
    6) MAIN COMPONENT — STATE + LOGIC + API
===================================================== */

export function SalesPerson() {
  const [salesPersons, setSalesPersons] = useState<SalesPerson[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedSalesPerson, setSelectedSalesPerson] =
    useState<SalesPerson | null>(null);

  const [showPassword, setShowPassword] = useState<{ [key: number]: boolean }>(
    {}
  );

  const [formData, setFormData] = useState<Omit<SalesPerson, "id">>({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: null,
    doj: null,
    address: "",
  });

  const fetchData = async () => {
    try {
      const res = await crmApi.salesPerson.getAll({});
      setSalesPersons(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      dob: "",
      doj: "",
      address: "",
    });
  };

  const togglePasswordVisibility = (id: number) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredSalesPersons = salesPersons.filter(
    (sp) =>
      sp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sp.phone.includes(searchQuery)
  );

  const openEditDialog = (sp: SalesPerson) => {
    setSelectedSalesPerson(sp);
    setFormData({
      name: sp.name,
      email: sp.email,
      password: sp.password,
      phone: sp.phone,
      dob: sp.dob,
      doj: sp.doj,
      address: sp.address,
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (sp: SalesPerson) => {
    setSelectedSalesPerson(sp);
    setIsDeleteOpen(true);
  };

  const handleAdd = async () => {
    try {
      await crmApi.salesPerson.create(formData);
      setIsAddOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error("Failed to add sales person");
    }
  };

  const handleEdit = async () => {
    if (!selectedSalesPerson) return;
    try {
      await crmApi.salesPerson.update(selectedSalesPerson.id, formData);
      setIsEditOpen(false);
      resetForm();
      fetchData();
    } catch {
      toast.error("Failed to update sales person");
    }
  };

  const handleDelete = async () => {
    if (!selectedSalesPerson) return;
    try {
      await crmApi.salesPerson.delete(selectedSalesPerson.id);
      setIsDeleteOpen(false);
      fetchData();
    } catch {
      toast.error("Failed to delete sales person");
    }
  };

  return (
    <div className="space-y-6">
      <SalesPersonToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddClick={() => setIsAddOpen(true)}
      />

      <SalesPersonTable
        salesPersons={filteredSalesPersons}
        showPassword={showPassword}
        togglePassword={togglePasswordVisibility}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />

      <SalesPersonAddDialog
        open={isAddOpen}
        onClose={setIsAddOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAdd}
      />

      <SalesPersonEditDialog
        open={isEditOpen}
        onClose={setIsEditOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEdit}
      />

      <SalesPersonDeleteDialog
        open={isDeleteOpen}
        onClose={setIsDeleteOpen}
        salesPerson={selectedSalesPerson}
        onDelete={handleDelete}
      />
    </div>
  );
}

