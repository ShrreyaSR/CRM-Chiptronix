import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
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
} from "../../ui/alert-dialog";
import { Badge } from "../../ui/badge";
import { crmApi } from "../../../api";
import { ComplaintDto as Complaint } from "../../../dtos";
import React from "react";


// ==================================================================
//  COMPONENT 1 — TOOLBAR
// ==================================================================
function ComplaintsToolbar({
  searchQuery,
  onSearch,
  onAdd,
}: {
  searchQuery: string;
  onSearch: (v: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search complaints..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 h-11 bg-white/50 border-gray-200/50 rounded-xl"
        />
      </div>

      <Button
        onClick={onAdd}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white h-11 px-6 rounded-xl"
      >
        <Plus className="mr-2 h-5 w-5" />
        Add Complaint
      </Button>
    </div>
  );
}


// ==================================================================
//  COMPONENT 2 — TABLE
// ==================================================================
function ComplaintsTable({
  complaints,
  onEdit,
  onDelete,
}: {
  complaints: Complaint[];
  onEdit: (c: Complaint) => void;
  onDelete: (c: Complaint) => void;
}) {
  return (
    <div className="bg-white/80 rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50">
              <TableHead>ID</TableHead>
              <TableHead>Complaint</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {complaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                  No complaint found
                </TableCell>
              </TableRow>
            ) : (
              complaints.map((c) => (
                <TableRow key={c.id} className="hover:bg-blue-50/50">
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      #{c.id}
                    </Badge>
                  </TableCell>

                  <TableCell>{c.description}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(c)}
                        className="h-8 w-8 text-blue-600 border-blue-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(c)}
                        className="h-8 w-8 text-red-600 border-red-200"
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


// ==================================================================
//  COMPONENT 3 — DIALOGS (ADD / EDIT / DELETE)
// ==================================================================
function AddComplaintDialog({ open, formData, setFormData, onClose, onSubmit }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Submit New Complaint</DialogTitle>
          <DialogDescription>Describe the issue</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Label>Complaint Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="rounded-lg min-h-[150px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit} className="bg-blue-600 text-white">
            Submit Complaint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditComplaintDialog({ open, formData, setFormData, onClose, onSubmit }: any) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Complaint</DialogTitle>
          <DialogDescription>Update the complaint</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="rounded-lg min-h-[150px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit} className="bg-blue-600 text-white">
            Update Complaint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteComplaintDialog({ open, onClose, onConfirm }: any) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the complaint.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-500 text-white">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


// ==================================================================
//  COMPONENT 4 — MAIN PAGE (STATE + LOGIC + API)
// ==================================================================
export function Complaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const [formData, setFormData] = useState({ description: "" });

  const resetForm = () => setFormData({ description: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await crmApi.complaint.getAll({});
    setComplaints(res.data.data || []);
  };

  const handleAddComplaint = async () => {
    await crmApi.complaint.create(formData);
    setIsAddDialogOpen(false);
    resetForm();
    fetchData();
  };

  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return;
    await crmApi.complaint.update(selectedComplaint.id, formData);
    setIsEditDialogOpen(false);
    setSelectedComplaint(null);
    resetForm();
    fetchData();
  };

  const handleDeleteComplaint = async () => {
    if (!selectedComplaint) return;
    await crmApi.complaint.delete(selectedComplaint.id);
    setIsDeleteDialogOpen(false);
    setSelectedComplaint(null);
    resetForm();
    fetchData();
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <ComplaintsToolbar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onAdd={() => setIsAddDialogOpen(true)}
      />

      {/* Table */}
      <ComplaintsTable
        complaints={complaints.filter(
          (c) =>
            c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.id.toString().includes(searchQuery)
        )}
        onEdit={(c) => {
          setSelectedComplaint(c);
          setFormData({ description: c.description });
          setIsEditDialogOpen(true);
        }}
        onDelete={(c) => {
          setSelectedComplaint(c);
          setIsDeleteDialogOpen(true);
        }}
      />

      {/* Add Dialog */}
      <AddComplaintDialog
        open={isAddDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onClose={() => { setIsAddDialogOpen(false); resetForm(); }}
        onSubmit={handleAddComplaint}
      />

      {/* Edit Dialog */}
      <EditComplaintDialog
        open={isEditDialogOpen}
        formData={formData}
        setFormData={setFormData}
        onClose={() => { setIsEditDialogOpen(false); setSelectedComplaint(null); resetForm(); }}
        onSubmit={handleUpdateComplaint}
      />

      {/* Delete Dialog */}
      <DeleteComplaintDialog
        open={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); setSelectedComplaint(null); }}
        onConfirm={handleDeleteComplaint}
      />
    </div>
  );
}
