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
import { Search, Plus, Edit, Trash2 } from "lucide-react";
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
import crmApi from "../api/crmApi";
import { ComplaintDto as Complaint} from "../dtos";


export function Complaints() {
  
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );

    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      let complaintRes;
      try {
        complaintRes = await crmApi.complaint.getAll({});
        setComplaints(complaintRes.data.data || []);
      } catch (err) {
        console.error("Error loading data:", err);
      }
      finally{
        console.log(complaintRes);
      }
    };

  const [formData, setFormData] = useState({
    description: "",
  });

  const resetForm = () => {
    setFormData({
      description: "",
    });
  };

  const openEditDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setFormData({
      description: complaint.description,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDeleteDialogOpen(true);
  };

  const handleAddComplaint = async () => {
    if (!formData.description.trim()) {
      console.log("Please enter a complaint description");
      return;
    }
    try {
        await crmApi.complaint.create(formData);
        console.log("Complaint submitted successfully");
        setIsAddDialogOpen(false);
        resetForm();
        await fetchData();
      } catch (err) {
        console.log("Failed to add complaint");
        console.error(err);
      }
  };

  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return;

    if (!formData.description.trim()) {
      console.log("Please enter a complaint description");
      return;
    }

    try {
        await crmApi.complaint.update(selectedComplaint.id, formData);
        console.log("Complaint updated successfully");
        setIsEditDialogOpen(false);
        setSelectedComplaint(null);
        resetForm();
        await fetchData();
      } catch (err) {
        console.log("Failed to update complain");
        console.error(err);
      }
  };

  const handleDeleteComplaint = async () => {
      if (!selectedComplaint) return;
      try {
        await crmApi.complaint.delete(selectedComplaint.id);
        console.log("Complaint deleted successfully");
        setIsDeleteDialogOpen(false);
        setSelectedComplaint(null);
        resetForm();
        await fetchData();
      } catch (err) {
        console.log("Failed to delete complaint");
        console.error(err);
      }
    };


  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.id.toString().includes(searchQuery)
  );

  const currentComplaints = filteredComplaints.slice();


  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search complaints by ID or description..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-11 bg-white/50 border-gray-200/50 rounded-xl focus:border-blue-400 focus:ring-blue-400/20"
          />
        </div>

        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-blue-800 text-white h-11 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Complaint
        </Button>
      </div>

      

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              Submit New Complaint
            </DialogTitle>
            <DialogDescription>
              Describe the issue or complaint to notify the admin
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-description">Complaint Description</Label>
              <Textarea
                id="add-description"
                placeholder="Enter detailed description of the complaint..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="rounded-lg min-h-[150px] resize-none"
              />
              <p className="text-xs text-gray-500">
                Be specific and include all relevant details
              </p>
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
              onClick={handleAddComplaint}
              className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg"
            >
              Submit Complaint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-50 hover:to-indigo-50">
                <TableHead className="text-gray-900">ID</TableHead>
                <TableHead className="text-gray-900">Complaint</TableHead>
                <TableHead className="text-right text-gray-900">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentComplaints.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-gray-500"
                  >
                    No complaint found
                  </TableCell>
                </TableRow>
              ) : (
                currentComplaints.map((complaint) => (
                  <TableRow
                    key={complaint.id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        #{complaint.id}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {complaint.description}
                    </TableCell>
                  
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-600 rounded-lg"
                          onClick={() => openEditDialog(complaint)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 rounded-lg"
                          onClick={() => openDeleteDialog(complaint)}
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



      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Edit Complaint</DialogTitle>
            <DialogDescription>
              Update the complaint description
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-description">Complaint Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter detailed description of the complaint..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="rounded-lg min-h-[150px] resize-none"
              />
              <p className="text-xs text-gray-500">
                Be specific and include all relevant details
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedComplaint(null);
                resetForm();
              }}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateComplaint}
              className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg"
            >
              Update Complaint
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
              This will permanently delete the complaint. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedComplaint(null);
              }}
              className="rounded-lg"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComplaint}
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
