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
} from "../../ui/alert-dialog";
import { Badge } from "../../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { crmApi } from "../../../api";
import { ClientDto as Client } from "../../../dtos";

// ------------------------------------------------------------------
// TYPES FOR PROPS
// ------------------------------------------------------------------

interface ToolBarProps {
  searchQuery: string;
  handleSearch: (value: string) => void;
  filterType: string;
  handleFilterChange: (value: string) => void;
  openAdd: () => void;
}

interface ClientTableProps {
  clients: Client[];
  showPassword: Record<number, boolean>;
  togglePassword: (id: number) => void;
  openEdit: (client: Client) => void;
  openDelete: (client: Client) => void;
}

interface ClientDialogsProps {
  isAdd: boolean;
  setIsAdd: (v: boolean) => void;
  isEdit: boolean;
  setIsEdit: (v: boolean) => void;
  isDelete: boolean;
  setIsDelete: (v: boolean) => void;
  formData: any;
  setFormData: (data: any) => void;
  selectedClient: Client | null;
  handleAdd: () => void;
  handleUpdate: () => void;
  handleDelete: () => void;
  resetForm: () => void;
}

interface ClientFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

// ------------------------------------------------------------------
// TOOLBAR COMPONENT
// ------------------------------------------------------------------
function ToolBar({
  searchQuery,
  handleSearch,
  filterType,
  handleFilterChange,
  openAdd,
}: ToolBarProps) {
  return (
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
        onValueChange={(v: any) => handleFilterChange(v)}
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
        onClick={openAdd}
        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg rounded-xl h-11 px-6"
      >
        <UserPlus className="mr-2 h-5 w-5" />
        Add Client
      </Button>
    </div>
  );
}

// ------------------------------------------------------------------
// TABLE COMPONENT
// ------------------------------------------------------------------
function ClientTable({
  clients,
  showPassword,
  togglePassword,
  openEdit,
  openDelete,
}: ClientTableProps) {
  return (
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
              <TableHead className="text-right text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-gray-500"
                >
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
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

                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>
                        {showPassword[client.id]
                          ? client.passwordIfDealer
                          : "••••••"}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => togglePassword(client.id)}
                      >
                        {showPassword[client.id] ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.address}</TableCell>

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
                        className="h-8 w-8 text-blue-600"
                        onClick={() => openEdit(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => openDelete(client)}
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

// ------------------------------------------------------------------
// DIALOG COMPONENT — ADD + EDIT + DELETE
// ------------------------------------------------------------------
function ClientDialogs({
  isAdd,
  setIsAdd,
  isEdit,
  setIsEdit,
  isDelete,
  setIsDelete,
  formData,
  setFormData,
  selectedClient,
  handleAdd,
  handleUpdate,
  handleDelete,
  resetForm,
}: ClientDialogsProps) {
  return (
    <>
      {/* ADD DIALOG */}
      <Dialog open={isAdd} onOpenChange={setIsAdd}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new client.
            </DialogDescription>
          </DialogHeader>

          <ClientForm formData={formData} setFormData={setFormData} />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAdd(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button disabled={!formData.name || !formData.phone || !formData.clientType || (formData.clientType === "Dealer" && !formData.passwordIfDealer)} onClick={handleAdd}>Add Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEdit} onOpenChange={setIsEdit}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>

          <ClientForm formData={formData} setFormData={setFormData} />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEdit(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button disabled={!formData.name || !formData.phone || !formData.clientType || (formData.clientType === "Dealer" && !formData.passwordIfDealer)} onClick={handleUpdate}>Update Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <AlertDialog open={isDelete} onOpenChange={setIsDelete}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedClient?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDelete(false)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ------------------------------------------------------------------
// SMALL FORM COMPONENT
// ------------------------------------------------------------------
function ClientForm({ formData, setFormData }: ClientFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <Label>Client Name *</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
        {formData.email &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
            <p className="text-xs text-red-500">
              Please enter a valid email address
            </p>
          )}
      </div>

      <div className="space-y-2">
        <Label>Phone *</Label>
        <Input
          value={formData.phone}
          type="number"
          maxLength={10}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
        />
        {formData.phone && formData.phone.length !== 10 && (
          <p className="text-xs text-red-500">
            Phone number must be 10 digits
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <Select
          value={formData.clientType}
          onValueChange={(v: any) =>
            setFormData({ ...formData, clientType: v })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Customer">Customer</SelectItem>
            <SelectItem value="Dealer">Dealer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label>Address</Label>
        <Input
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
      </div>

      {formData.clientType === "Dealer" && (
        <div className="md:col-span-2 space-y-2">
          <Label>Dealer Password *</Label>
          <Input
            value={formData.passwordIfDealer}
            onChange={(e) =>
              setFormData({
                ...formData,
                passwordIfDealer: e.target.value,
              })
            }
          />
        </div>)}
    </div>
  );
}

// ------------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------------
export function Client() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");

  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [showPassword, setShowPassword] = useState<Record<number, boolean>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    passwordIfDealer: "",
    phone: "",
    address: "",
    clientType: "Customer",
  });

  const fetchData = async () => {
    const [clientRes] = await Promise.all([crmApi.client.getAll({})]);
    setClients(clientRes.data.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () =>
    setFormData({
      name: "",
      email: "",
      passwordIfDealer: "",
      phone: "",
      address: "",
      clientType: "Customer",
    });

  const openAdd = () => {
    resetForm();
    setIsAdd(true);
  };

  const openEdit = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name || "",
      email: client.email || "",
      passwordIfDealer: client.passwordIfDealer || "",
      phone: client.phone || "",
      address: client.address || "",
      clientType: client.clientType || "Customer",
    });
    setIsEdit(true);
  };

  const openDelete = (client: Client) => {
    setSelectedClient(client);
    setIsDelete(true);
  };

  const handleAdd = async () => {
    // Ensure clientType is passed as the correct type ("Customer" | "Dealer" | undefined)
    const addData = {
      ...formData,
      clientType: formData.clientType as "Customer" | "Dealer" | undefined,
    };
    await crmApi.client.create(addData);
    setIsAdd(false);
    resetForm();
    fetchData();
  };

  const handleUpdate = async () => {
    if (!selectedClient) return;
    // Ensure clientType is passed as typed, not string
    const updateData = {
      ...formData,
      clientType: formData.clientType as "Customer" | "Dealer" | undefined,
    };
    await crmApi.client.update(selectedClient.id, updateData);
    setIsEdit(false);
    resetForm();
    fetchData();
  };

  const handleDelete = async () => {
    if (!selectedClient) return;
    await crmApi.client.delete(selectedClient.id);
    setIsDelete(false);
    fetchData();
  };

  const togglePassword = (id: number) =>
    setShowPassword((p) => ({ ...p, [id]: !p[id] }));

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType = filterType === "All" || c.clientType === filterType;

    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <ToolBar
        searchQuery={searchQuery}
        handleSearch={setSearchQuery}
        filterType={filterType}
        handleFilterChange={setFilterType}
        openAdd={openAdd}
      />

      <ClientTable
        clients={filtered}
        showPassword={showPassword}
        togglePassword={togglePassword}
        openEdit={openEdit}
        openDelete={openDelete}
      />

      <ClientDialogs
        isAdd={isAdd}
        setIsAdd={setIsAdd}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        isDelete={isDelete}
        setIsDelete={setIsDelete}
        formData={formData}
        setFormData={setFormData}
        selectedClient={selectedClient}
        handleAdd={handleAdd}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        resetForm={resetForm}
      />
    </div>
  );
}
