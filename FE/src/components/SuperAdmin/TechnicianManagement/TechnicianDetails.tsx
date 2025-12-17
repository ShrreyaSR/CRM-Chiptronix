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
import { TechnicianDto as Technician } from "../../../dtos";

/* =====================================================
    1) TOOLBAR COMPONENT
===================================================== */

function TechnicianToolbar({
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
        className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white h-11 px-6 rounded-xl"
      >
        <UserPlus className="mr-2 h-5 w-5" />
        Add Technician
      </Button>
    </div>
  );
}

/* =====================================================
    2) TABLE COMPONENT
===================================================== */

function TechnicianTable({
  technicians,
  showPassword,
  togglePassword,
  onEdit,
  onDelete,
}: {
  technicians: Technician[];
  showPassword: { [key: number]: boolean };
  togglePassword: (id: number) => void;
  onEdit: (t: Technician) => void;
  onDelete: (t: Technician) => void;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-teal-50 to-emerald-50">
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
            {technicians.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  No technicians found
                </TableCell>
              </TableRow>
            ) : (
              technicians.map((tech) => (
                <TableRow key={tech.id} className="hover:bg-blue-50/50">
                  <TableCell>
                    <Badge variant="outline" className="bg-teal-50">
                      #{tech.id}
                    </Badge>
                  </TableCell>
                  <TableCell>{tech.name}</TableCell>
                  <TableCell>{tech.email}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>
                        {showPassword[tech.id] ? tech.password : "••••••"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => togglePassword(tech.id)}
                      >
                        {showPassword[tech.id] ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>{tech.phone}</TableCell>
                  <TableCell>
                    {tech.dob ? new Date(tech.dob).toLocaleDateString() : "--"}
                  </TableCell>
                  <TableCell>
                    {tech.doj ? new Date(tech.doj).toLocaleDateString() : "--"}
                  </TableCell>
                  <TableCell>{tech.address}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(tech)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(tech)}
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

function TechnicianAddDialog({
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
          <DialogTitle>Add New Technician</DialogTitle>
        </DialogHeader>

        <TechnicianForm formData={formData} setFormData={setFormData} />

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Add Technician</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* =====================================================
    4) EDIT DIALOG
===================================================== */

function TechnicianEditDialog({
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
          <DialogTitle>Edit Technician</DialogTitle>
        </DialogHeader>

        <TechnicianForm formData={formData} setFormData={setFormData} />

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Update Technician</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* =====================================================
    SHARED FORM COMPONENT
===================================================== */

function TechnicianForm({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      {[
        ["name", "Full Name"],
        ["email", "Email"],
        ["password", "Password"],
        ["phone", "Phone Number"],
      ].map(([key, label]) => (
        <div className="space-y-2" key={key}>
          <Label>{label} *</Label>
          <Input
            value={formData[key]}
            type={key === "password" ? "password" : "text"}
            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
            className="rounded-xl"
          />
        </div>
      ))}

      <div className="space-y-2">
        <Label>DOB *</Label>
        <Input
          type="date"
          value={formData.dob}
          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>DOJ *</Label>
        <Input
          type="date"
          value={formData.doj}
          onChange={(e) => setFormData({ ...formData, doj: e.target.value })}
        />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label>Address *</Label>
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

function TechnicianDeleteDialog({
  open,
  onClose,
  technician,
  onDelete,
}: any) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <b>{technician?.name}</b> from the system.
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

export function Technician() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);

  const [showPassword, setShowPassword] = useState<{ [key: number]: boolean }>(
    {}
  );

  const [formData, setFormData] = useState<Omit<Technician, "id">>({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    doj: "",
    address: "",
  });

  const fetchData = async () => {
    try {
      const res = await crmApi.technician.getAll({});
      setTechnicians(res.data.data || []);
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

  const filteredTechnicians = technicians.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.phone.includes(searchQuery)
  );

  const openEditDialog = (t: Technician) => {
    setSelectedTechnician(t);
    setFormData({
      name: t.name,
      email: t.email,
      password: t.password,
      phone: t.phone,
      dob: t.dob,
      doj: t.doj,
      address: t.address,
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (t: Technician) => {
    setSelectedTechnician(t);
    setIsDeleteOpen(true);
  };

  const handleAdd = async () => {
    try {
      await crmApi.technician.create(formData);
      setIsAddOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error("Failed to add technician");
    }
  };

  const handleEdit = async () => {
    if (!selectedTechnician) return;
    try {
      await crmApi.technician.update(selectedTechnician.id, formData);
      setIsEditOpen(false);
      resetForm();
      fetchData();
    } catch {
      toast.error("Failed to update technician");
    }
  };

  const handleDelete = async () => {
    if (!selectedTechnician) return;
    try {
      await crmApi.technician.delete(selectedTechnician.id);
      setIsDeleteOpen(false);
      fetchData();
    } catch {
      toast.error("Failed to delete technician");
    }
  };

  return (
    <div className="space-y-6">
      <TechnicianToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddClick={() => setIsAddOpen(true)}
      />

      <TechnicianTable
        technicians={filteredTechnicians}
        showPassword={showPassword}
        togglePassword={togglePasswordVisibility}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />

      <TechnicianAddDialog
        open={isAddOpen}
        onClose={setIsAddOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAdd}
      />

      <TechnicianEditDialog
        open={isEditOpen}
        onClose={setIsEditOpen}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEdit}
      />

      <TechnicianDeleteDialog
        open={isDeleteOpen}
        onClose={setIsDeleteOpen}
        technician={selectedTechnician}
        onDelete={handleDelete}
      />
    </div>
  );
}
