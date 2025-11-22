import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
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
} from "./ui/alert-dialog";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { TechnicianDto as Technician } from "../dtos";
import crmApi from "../api/crmApi";

export function Technician() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);
  const [showPassword, setShowPassword] = useState<{ [key: number]: boolean }>(
    {}
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let technicianRes;
    try {
      technicianRes = await crmApi.technician.getAll({});
      setTechnicians(technicianRes.data.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      console.log(technicianRes);
    }
  };

  const [formData, setFormData] = useState<Omit<Technician, "id">>({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    doj: "",
    address: "",
  });

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

  const handleAddTechnician = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.dob ||
      !formData.doj ||
      !formData.address
    ) {
      console.log("Enter all details");
      return;
    }

    try {
      await crmApi.technician.create(formData);
      console.log("Technician submitted successfully");
      setIsAddDialogOpen(false);
      resetForm();
      await fetchData();
    } catch (err) {
      console.log("Failed to add technician");
      console.error(err);
    }
  };

  const handleEditTechnician = async () => {
    if (!selectedTechnician) return;

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.dob ||
      !formData.doj ||
      !formData.address
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await crmApi.technician.update(selectedTechnician.id, formData);
      console.log("Technician updated successfully");
      setIsEditDialogOpen(false);
      setSelectedTechnician(null);
      resetForm();
      await fetchData();
    } catch (err) {
      console.log("Failed to update technician");
      console.error(err);
    }
  };

  const handleDeleteTechnician = async () => {
    if (!selectedTechnician) return;

    try {
      await crmApi.technician.delete(selectedTechnician.id);
      console.log("Technician deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedTechnician(null);
      resetForm();
      await fetchData();
    } catch (err) {
      console.log("Failed to delete technician");
      console.error(err);
    }
  };

  const openEditDialog = (technician: Technician) => {
    setSelectedTechnician(technician);
    setFormData({
      name: technician.name,
      email: technician.email,
      password: technician.password,
      phone: technician.phone,
      dob: technician.dob,
      doj: technician.doj,
      address: technician.address,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (technician: Technician) => {
    setSelectedTechnician(technician);
    setIsDeleteDialogOpen(true);
  };

  const filteredTechnicians = technicians.filter(
    (tech) =>
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.phone.includes(searchQuery) ||
      tech.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTechnicians = filteredTechnicians.slice();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const togglePasswordVisibility = (id: number) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-gray-900">Technicians Management</h2>
          <p className="text-gray-600 mt-1">
            Manage your team members and their information
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search by name, email or phone..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-11 bg-white/50 border-gray-200/50 rounded-xl focus:border-blue-400 focus:ring-blue-400/20"
          />
        </div>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white h-11 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Add Technician
        </Button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-50 hover:to-emerald-50">
                <TableHead className="text-gray-900">ID</TableHead>
                <TableHead className="text-gray-900">Name</TableHead>
                <TableHead className="text-gray-900">Email</TableHead>
                <TableHead className="text-gray-900">Password</TableHead>
                <TableHead className="text-gray-900">Phone</TableHead>
                <TableHead className="text-gray-900">Date of Birth</TableHead>
                <TableHead className="text-gray-900">Date of Joining</TableHead>
                <TableHead className="text-gray-900">Address</TableHead>

                <TableHead className="text-gray-900 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentTechnicians.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-12 text-gray-500"
                  >
                    No technicians found
                  </TableCell>
                </TableRow>
              ) : (
                currentTechnicians.map((technician) => (
                  <TableRow
                    key={technician.id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-teal-50 text-teal-700 border-teal-200"
                      >
                        #{technician.id}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {technician.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {technician.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">
                          {showPassword[technician.id]
                            ? technician.password
                            : "••••••"}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            togglePasswordVisibility(technician.id)
                          }
                        >
                          {showPassword[technician.id] ? (
                            <EyeOff className="h-3 w-3 text-gray-400" />
                          ) : (
                            <Eye className="h-3 w-3 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {technician.phone}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(technician.dob).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(technician.doj).toLocaleDateString("en-IN")}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {technician.address}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-600 rounded-lg"
                          onClick={() => openEditDialog(technician)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 rounded-lg"
                          onClick={() => openDeleteDialog(technician)}
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              Add New Technician
            </DialogTitle>
            <DialogDescription>
              Fill in the details to add a new technician to the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Full Name *</Label>
              <Input
                id="add-name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-email">Email *</Label>
              <Input
                id="add-email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-password">Password *</Label>
              <Input
                id="add-password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-phone">Phone Number *</Label>
              <Input
                id="add-phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-dob">Date of Birth *</Label>
              <Input
                id="add-dob"
                type="date"
                value={formData.dob}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-doj">Date of Joining *</Label>
              <Input
                id="add-doj"
                type="date"
                value={formData.doj}
                onChange={(e) =>
                  setFormData({ ...formData, doj: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="add-address">Address *</Label>
              <Input
                id="add-address"
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTechnician}
              className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white rounded-xl"
            >
              Add Technician
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Edit Technician</DialogTitle>
            <DialogDescription>
              Update the technician information
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Password *</Label>
              <Input
                id="edit-password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number *</Label>
              <Input
                id="edit-phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dob">Date of Birth *</Label>
              <Input
                id="edit-dob"
                type="date"
                value={formData.dob}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-doj">Date of Joining *</Label>
              <Input
                id="edit-doj"
                type="date"
                value={formData.doj}
                onChange={(e) =>
                  setFormData({ ...formData, doj: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-address">Address *</Label>
              <Input
                id="edit-address"
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedTechnician(null);
                resetForm();
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditTechnician}
              className="bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl"
            >
              Update Technician
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              technician
              <span className="text-gray-900">
                {" "}
                {selectedTechnician?.name}
              </span>{" "}
              from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTechnician}
              className="bg-red-500 hover:bg-red-700 text-white rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
