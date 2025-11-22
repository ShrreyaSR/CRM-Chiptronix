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
import { Search, UserPlus, Edit, Trash2, EyeOff, Eye } from "lucide-react";
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
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import crmApi from "../api/crmApi";
import { ClientDto as Client } from "../dtos";

export function Client() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Customer" | "Dealer">(
    "All"
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showPassword, setShowPassword] = useState<{ [key: number]: boolean }>(
    {}
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientRes] = await Promise.all([crmApi.client.getAll({})]);
      setClients(clientRes.data.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    passwordIfDealer: "",
    phone: "",
    address: "",
    clientType: "Customer" as "Customer" | "Dealer",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      passwordIfDealer: "",
      phone: "",
      address: "",
      clientType: "Customer",
    });
  };

  const openEditDialog = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      passwordIfDealer: client.passwordIfDealer,
      phone: client.phone,
      address: client.address,
      clientType: client.clientType,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  const handleAddClient = async () => {
    try {
      await crmApi.client.create(formData);
      console.log("Client added successfully");
      setIsAddDialogOpen(false);
      resetForm();
      await fetchData();
    } catch (err) {
      console.log("Failed to add client");
      console.error(err);
    }
  };

  const handleUpdateClient = async () => {
    if (!selectedClient) return;
    try {
      await crmApi.client.update(selectedClient.id, formData);
      console.log("Client updated successfully");
      setIsEditDialogOpen(false);
      setSelectedClient(null);
      resetForm();
      await fetchData();
    } catch (err) {
      console.log("Failed to update client");
      console.error(err);
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;
    try {
      await crmApi.client.delete(selectedClient.id);
      console.log("Client deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedClient(null);
      resetForm();
      await fetchData();
    } catch (err) {
      console.log("Failed to delete client");
      console.error(err);
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === "All" || client.clientType === filterType;
    return matchesSearch && matchesFilter;
  });

  const currentClients = filteredClients;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (value: "All" | "Customer" | "Dealer") => {
    setFilterType(value);
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
          <h2 className="text-gray-900">Client Management</h2>
          <p className="text-gray-600 mt-1">Manage customers and dealers</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search by name, email, phone or address..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-11 bg-white/50 border-gray-200/50 rounded-xl focus:border-blue-400 focus:ring-blue-400/20"
          />
        </div>

        <Tabs
          value={filterType}
          onValueChange={(value: string) =>
            handleFilterChange(value as "All" | "Customer" | "Dealer")
          }
          className="w-auto"
        >
          <TabsList className="bg-white/50 border border-gray-200/50 rounded-xl h-11">
            <TabsTrigger
              value="All"
              className="rounded-lg data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              All
            </TabsTrigger>

            <TabsTrigger
              value="Customer"
              className="rounded-lg data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              Customers
            </TabsTrigger>
            <TabsTrigger
              value="Dealer"
              className="rounded-lg data-[state=active]:bg-purple-500 data-[state=active]:text-white"
            >
              Dealers
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 rounded-xl h-11 px-6"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Add Client
        </Button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-purple-50 to-purple-50">
                <TableHead className="text-gray-900">ID</TableHead>
                <TableHead className="text-gray-900">Name</TableHead>
                <TableHead className="text-gray-900">Email</TableHead>
                <TableHead className="text-gray-900">Password</TableHead>
                <TableHead className="text-gray-900">Phone</TableHead>
                <TableHead className="text-gray-900">Address</TableHead>
                <TableHead className="text-gray-900">Type</TableHead>
                <TableHead className="text-right text-gray-900">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentClients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-gray-500"
                  >
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                currentClients.map((client) => (
                  <TableRow
                    key={client.id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200"
                      >
                        #{client.id}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {client.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {client.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">
                          {showPassword[client.id]
                            ? client.passwordIfDealer
                            : "••••••"}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => togglePasswordVisibility(client.id)}
                        >
                          {showPassword[client.id] ? (
                            <EyeOff className="h-3 w-3 text-gray-400" />
                          ) : (
                            <Eye className="h-3 w-3 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {client.phone}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {client.address}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          client.clientType === "Customer"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-purple-100 text-purple-700 border-purple-200"
                        }
                        variant="outline"
                      >
                        {client.clientType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-600 rounded-lg"
                          onClick={() => openEditDialog(client)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 rounded-lg"
                          onClick={() => openDeleteDialog(client)}
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
            <DialogTitle className="text-gray-900">Add New Client</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new client to the system
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Client Name</Label>
              <Input
                id="add-name"
                placeholder="Enter client name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-email">Email</Label>
              <Input
                id="add-email"
                type="email"
                placeholder="client@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-phone">Phone Number</Label>
              <Input
                id="add-phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-clientType">Client Type</Label>
              <Select
                value={formData.clientType}
                onValueChange={(value: "Customer" | "Dealer") =>
                  setFormData({ ...formData, clientType: value })
                }
              >
                <SelectTrigger id="add-clientType" className="rounded-lg">
                  <SelectValue placeholder="Select client type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Dealer">Dealer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="add-address">Address</Label>
              <Input
                id="add-address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="add-password">
                Dealer Password (if applicable)
              </Label>
              <Input
                id="add-password"
                placeholder="Enter dealer password"
                value={formData.passwordIfDealer}
                onChange={(e) =>
                  setFormData({ ...formData, passwordIfDealer: e.target.value })
                }
                className="rounded-lg"
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
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddClient}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg"
            >
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Edit Client</DialogTitle>
            <DialogDescription>Update the client information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Client Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter client name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="client@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-clientType">Client Type</Label>
              <Select
                value={formData.clientType}
                onValueChange={(value: "Customer" | "Dealer") =>
                  setFormData({ ...formData, clientType: value })
                }
              >
                <SelectTrigger id="edit-clientType" className="rounded-lg">
                  <SelectValue placeholder="Select client type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Dealer">Dealer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="rounded-lg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedClient(null);
                resetForm();
              }}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateClient}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg"
            >
              Update Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
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
              This will permanently delete the client "{selectedClient?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedClient(null);
              }}
              className="rounded-lg"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              className="bg-red-500 hover:bg-red-700 text-white rounded-lg"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
