import React from "react";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Search, Plus, Edit, Trash2, Laptop } from "lucide-react";
import { toast } from "sonner";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../ui/select";

import { BrandDto as ModelBrand } from "../../../dtos";
import { crmApi } from "../../../api";

/* -------------------------------------------------------------------------- */
/* 🎯 1. TOOLBAR COMPONENT                                                    */
/* -------------------------------------------------------------------------- */

function ModelsToolbar({
  searchQuery,
  onSearch,
  filterBrand,
  brands,
  onFilterChange,
  onAddClick,
}: any) {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">

      {/* Search */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search by brand, model, or description..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 h-11 bg-white/50 border-gray-200/50 rounded-xl focus:border-blue-400 w-full"
        />
      </div>

      {/* Filter */}
      <div className="min-w-[200px]">
        <Select value={filterBrand} onValueChange={onFilterChange}>
          <SelectTrigger className="h-11 bg-white/50 border-gray-200/50 rounded-xl w-full">
            <SelectValue placeholder="Filter by brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand: string) => (
              <SelectItem key={brand} value={brand}>
                {brand === "All" ? "All Brands" : brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Add Button */}
      <Button
        onClick={onAddClick}
        className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white h-11 px-6 rounded-xl shadow-lg"
      >
        <Plus className="mr-2 h-5 w-5" />
        Add Model
      </Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 🎯 2. TABLE COMPONENT                                                      */
/* -------------------------------------------------------------------------- */

function ModelsTable({ data, onEdit, onDelete }: any) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-teal-50 to-emerald-50">
              <TableHead>ID</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                  No models found
                </TableCell>
              </TableRow>
            ) : (
              data.map((mb: ModelBrand) => (
                <TableRow key={mb.id} className="hover:bg-teal-50/50">
                  <TableCell>
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                      #{mb.id}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4 text-gray-400" />
                      {mb.brand}
                    </div>
                  </TableCell>

                  <TableCell>{mb.model}</TableCell>

                  <TableCell className="max-w-xs truncate text-gray-600">
                    {mb.description}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-blue-200 text-blue-600 rounded-lg"
                        onClick={() => onEdit(mb)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="border-red-200 text-red-600 rounded-lg"
                        onClick={() => onDelete(mb)}
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

/* -------------------------------------------------------------------------- */
/* 🎯 3. DIALOG COMPONENTS                                                    */
/* -------------------------------------------------------------------------- */

function AddEditDialog({
  open,
  onOpenChange,
  isEdit,
  formData,
  setFormData,
  onSubmit,
}: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Model & Brand" : "Add New Model & Brand"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the model information" : "Fill the details"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <Label className="mb-2">Brand *</Label>
            <Input
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="rounded-lg"
            />
          </div>

          <div>
            <Label className="mb-2">Model *</Label>
            <Input
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <Label className="mb-2">Description</Label>
            <Textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="rounded-lg resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => {onOpenChange(false); formData}}>Cancel</Button>

          <Button onClick={onSubmit} disabled={!formData.brand || !formData.model} className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl">
            {isEdit ? "Update Model" : "Add Model"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDialog({ open, onOpenChange, target, onConfirm }: any) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete "{target?.brand} {target?.model}".
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={onConfirm} className="bg-red-500 text-white rounded-lg">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* -------------------------------------------------------------------------- */
/* 🎯 4. MAIN COMPONENT (STATE + API + LOGIC)                                 */
/* -------------------------------------------------------------------------- */

export function ModelsBrands() {
  const [modelsBrands, setModelsBrands] = useState<ModelBrand[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrand, setFilterBrand] = useState("All");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<ModelBrand | null>(null);

  const [formData, setFormData] = useState({ brand: "", model: "", description: "" });

  const resetForm = () => setFormData({ brand: "", model: "", description: "" });

  const fetchData = async () => {
    try {
      const res = await crmApi.model.getAll({});
      setModelsBrands(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* -------------------------- CRUD HANDLERS --------------------------- */

  const handleAdd = async () => {
    if (!formData.brand || !formData.model) return toast.error("Missing fields");

    await crmApi.model.create(formData);
    setIsAddOpen(false);
    resetForm();
    fetchData();
  };

  const handleEdit = async () => {
    if (!selectedItem) return;

    await crmApi.model.update(selectedItem.id, formData);
    setIsEditOpen(false);
    setSelectedItem(null);
    resetForm();
    fetchData();
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    await crmApi.model.delete(selectedItem.id);
    setIsDeleteOpen(false);
    setSelectedItem(null);
    fetchData();
  };

  /* -------------------------- FILTER LOGIC --------------------------- */

  const brands = ["All", ...new Set(modelsBrands.map((x) => x.brand))];

  const filtered = modelsBrands.filter((mb) => {
    const q = searchQuery.toLowerCase();

    const matchSearch =
      mb.brand.toLowerCase().includes(q) ||
      mb.model.toLowerCase().includes(q) ||
      mb.description?.toLowerCase().includes(q);

    const matchFilter = filterBrand === "All" || mb.brand === filterBrand;

    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <ModelsToolbar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        brands={brands}
        filterBrand={filterBrand}
        onFilterChange={setFilterBrand}
        onAddClick={() => setIsAddOpen(true)}
      />

      {/* Table */}
      <ModelsTable
        data={filtered}
        onEdit={(item: ModelBrand) => {
          setSelectedItem(item);
          setFormData({
            brand: item.brand,
            model: item.model,
            description: item.description || "",
          });
          setIsEditOpen(true);
        }}
        onDelete={(item: ModelBrand) => {
          setSelectedItem(item);
          setIsDeleteOpen(true);
        }}
      />

      {/* Dialogs */}
      <AddEditDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        isEdit={false}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAdd}
      />

      <AddEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        isEdit={true}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEdit}
      />

      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        target={selectedItem}
        onConfirm={handleDelete}
      />
    </div>
  );
}
