import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
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
import { Search, Plus, Edit, Trash2, Laptop } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { BrandDto as ModelBrand } from "../dtos";
import crmApi from "../api/crmApi";

export function ModelsBrands() {
  const [modelsBrands, setModelsBrands] = useState<ModelBrand[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBrand, setFilterBrand] = useState<string>("All");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedModelBrand, setSelectedModelBrand] =
    useState<ModelBrand | null>(null);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    description: "",
  });

  const resetForm = () => {
    setFormData({
      brand: "",
      model: "",
      description: "",
    });
  };

  const openEditDialog = (modelBrand: ModelBrand) => {
    setSelectedModelBrand(modelBrand);
    setFormData({
      brand: modelBrand.brand,
      model: modelBrand.model,
      description: modelBrand.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (modelBrand: ModelBrand) => {
    setSelectedModelBrand(modelBrand);
    setIsDeleteDialogOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let modelRes;
    try {
      modelRes = await crmApi.model.getAllModels({});
      setModelsBrands(modelRes.data.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      console.log(modelRes);
    }
  };

  const handleAddModelBrand = async () => {
    if (!formData.brand.trim()) {
      toast.error("Please enter a brand name");
      return;
    }
    if (!formData.model.trim()) {
      toast.error("Please enter a model name");
      return;
    }

    try {
      await crmApi.model.createModel(formData);
      console.log("Model & Brand added successfully");
      setIsAddDialogOpen(false);
      resetForm();
      await fetchData();
    } catch (err) {
      console.log("Failed to add model and brand");
      console.error(err);
    }
  };

  const handleUpdateModelBrand = async () => {
    if (!selectedModelBrand) return;

    if (!formData.brand.trim()) {
      toast.error("Please enter a brand name");
      return;
    }
    if (!formData.model.trim()) {
      toast.error("Please enter a model name");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    try {
      await crmApi.model.updateModel(selectedModelBrand.id, formData);
      console.log("Model and Brand updated successfully");
      setIsEditDialogOpen(false);
      setSelectedModelBrand(null);
      resetForm();
      await fetchData();
    } catch (err) {
      console.log("Failed to update model and brand");
      console.error(err);
    }
  };

  const handleDeleteModelBrand = async () => {
    if (!selectedModelBrand) return;

    try {
      await crmApi.model.deleteModel(selectedModelBrand.id);
      console.log("Model & Brand deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedModelBrand(null);
      resetForm();
      await fetchData();
    } catch (err) {
      console.log("Failed to delete modela and brand");
      console.error(err);
    }
  };

  const uniqueBrands = [
    "All",
    ...Array.from(new Set(modelsBrands.map((mb) => mb.brand))),
  ];

  const filteredModelsBrands = modelsBrands.filter((mb) => {
    const matchesSearch =
      mb.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mb.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mb.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterBrand === "All" || mb.brand === filterBrand;

    return matchesSearch && matchesFilter;
  });

  const currentModelsBrands = filteredModelsBrands.slice();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (value: string) => {
    setFilterBrand(value);
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search by brand, model, or description..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-11 bg-white/50 border-gray-200/50 rounded-xl focus:border-blue-400 focus:ring-blue-400/20 w-full"
          />
        </div>

        {/* Select */}
        <div className="min-w-[200px]">
          <Select value={filterBrand} onValueChange={handleFilterChange}>
            <SelectTrigger className="h-11 bg-white/50 border-gray-200/50 rounded-xl w-full">
              <SelectValue placeholder="Filter by brand" />
            </SelectTrigger>
            <SelectContent>
              {uniqueBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand === "All" ? "All Brands" : brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Button */}
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-blue-700 hover:to-blue-800 text-white h-11 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 min-w-[150px]"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Model
        </Button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-50 hover:to-emerald-50">
                <TableHead className="text-gray-900">ID</TableHead>
                <TableHead className="text-gray-900">Brand</TableHead>
                <TableHead className="text-gray-900">Model</TableHead>
                <TableHead className="text-gray-900">Description</TableHead>
                <TableHead className="text-right text-gray-900">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentModelsBrands.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-gray-500"
                  >
                    No models found
                  </TableCell>
                </TableRow>
              ) : (
                currentModelsBrands.map((mb) => (
                  <TableRow
                    key={mb.id}
                    className="hover:bg-teal-50/50 transition-colors"
                  >
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-teal-50 text-teal-700 border-teal-200"
                      >
                        #{mb.id}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Laptop className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{mb.brand}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900">{mb.model}</span>
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-xs truncate">
                      {mb.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-600 rounded-lg"
                          onClick={() => openEditDialog(mb)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 rounded-lg"
                          onClick={() => openDeleteDialog(mb)}
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
              Add New Model & Brand
            </DialogTitle>
            <DialogDescription>
              Fill in the details to add a new laptop model
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-brand">Brand</Label>
              <Input
                id="add-brand"
                placeholder="e.g., Dell, HP, Lenovo"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-model">Model</Label>
              <Input
                id="add-model"
                placeholder="e.g., Inspiron 15 3000"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                placeholder="Enter model description (features, use case, etc.)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="rounded-lg resize-none"
                rows={3}
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
              onClick={handleAddModelBrand}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl"
            >
              Add Model
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              Edit Model & Brand
            </DialogTitle>
            <DialogDescription>Update the model information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-brand">Brand</Label>
              <Input
                id="edit-brand"
                placeholder="e.g., Dell, HP, Lenovo"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-model">Model</Label>
              <Input
                id="edit-model"
                placeholder="e.g., Inspiron 15 3000"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter model description (features, use case, etc.)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="rounded-lg resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedModelBrand(null);
                resetForm();
              }}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateModelBrand}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl"
            >
              Update Model
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
              This will permanently delete "{selectedModelBrand?.brand}{" "}
              {selectedModelBrand?.model}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedModelBrand(null);
              }}
              className="rounded-lg"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteModelBrand}
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
