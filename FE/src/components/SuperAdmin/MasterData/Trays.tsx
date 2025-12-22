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
import { Search, Plus, Edit, AlertCircle } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";

import { TrayDto as Tray } from "../../../dtos";
import { crmApi } from "../../../api";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";

/* =====================================================================================
   COMPONENT 1: Toolbar (Search + Filters + Add Button)
===================================================================================== */
function Toolbar({
  traySearchQuery,
  setTraySearchQuery,
  trayFilterStatus,
  setTrayFilterStatus,
  openAddDialog,
}: any) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search by tray number"
          value={traySearchQuery}
          onChange={(e) => setTraySearchQuery(e.target.value)}
          className="pl-10 h-11 bg-white/50 border-gray-200/50 rounded-xl"
        />
      </div>

      {/* Filter Tabs */}
      <Tabs
        value={trayFilterStatus}
        onValueChange={(value: string) =>
          setTrayFilterStatus(value as "All" | "Free" | "Occupied")
        }
        className="w-auto"
      >
        <TabsList className="bg-white/50 border border-gray-200/50 rounded-xl h-11">
          <TabsTrigger
            value="All"
            className="rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="Free"
            className="rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            Free
          </TabsTrigger>
          <TabsTrigger
            value="Occupied"
            className="rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:text-white"
          >
            Occupied
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Add Button */}
      <Button
        onClick={openAddDialog}
        className="bg-gradient-to-r from-amber-500 to-amber-600 text-white h-11 px-6 rounded-xl shadow-lg"
      >
        <Plus className="mr-2 h-5 w-5" />
        Add Tray
      </Button>
    </div>
  );
}

/* =====================================================================================
   COMPONENT 2: Tray Table (Table + Rows + Status Toggle)
===================================================================================== */
function TrayTable({ trays, toggleTrayStatus }: any) {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-amber-50 to-orange-50">
              <TableHead>ID</TableHead>
              <TableHead>Tray Number</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {trays.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-12 text-gray-500"
                >
                  No trays found
                </TableCell>
              </TableRow>
            ) : (
              trays.map((tray: Tray) => (
                <TableRow key={tray.id}>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200"
                    >
                      #{tray.id}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="text-gray-900">T-0{tray.trayNumber}</span>
                  </TableCell>

                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        tray.status === "Free"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {tray.status}

                      <Button
                        variant="none"
                        size="icon"
                        className="h-6 w-6 ml-2"
                        onClick={() => toggleTrayStatus(tray)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Badge>
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

/* =====================================================================================
   COMPONENT 3: Add Trays Dialog
===================================================================================== */
function AddTrayDialog({
  isOpen,
  onOpenChange,
  numberOfTraysToAdd,
  setNumberOfTraysToAdd,
  trays,
  handleAddTrays,
}: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">

        <DialogHeader>
          <DialogTitle>Add Multiple Trays</DialogTitle>
          <DialogDescription>
            Specify how many trays you want to add.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Label>Number of Trays to Add</Label>
          <Input
            type="text"
            inputMode="numeric"
            value={numberOfTraysToAdd === "" ? "" : numberOfTraysToAdd}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");

              if (value === "") {
                setNumberOfTraysToAdd("");
                return;
              }

              const num = Number(value);
              if (num >= 1 && num <= 1000) {
                setNumberOfTraysToAdd(num);
              }
            }}
            placeholder="1–1000"
          />


          <p className="text-xs text-gray-500">* The number of trays to add must be greater than the number of existing trays and less than 1000.</p>

          <p className="text-sm text-gray-500">
            {trays.length > 0
              ? `Next tray will be T-${String(
                Math.max(
                  ...trays.map((t: any) =>
                    parseInt(t.trayNumber.replace(/\D/g, ""))
                  )
                ) + 1
              ).padStart(3, "0")}`
              : "Next tray will be T-001"}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            onClick={handleAddTrays}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
            disabled={numberOfTraysToAdd < trays.length}
          >
            Add {numberOfTraysToAdd} Tray
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* =====================================================================================
   MAIN COMPONENT
===================================================================================== */

export function Trays() {
  const [trays, setTrays] = useState<Tray[]>([]);
  const [traySearchQuery, setTraySearchQuery] = useState("");
  const [trayFilterStatus, setTrayFilterStatus] = useState<
    "All" | "Free" | "Occupied"
  >("All");

  const [trayIsAddDialogOpen, setTrayIsAddDialogOpen] = useState(false);
  const [numberOfTraysToAdd, setNumberOfTraysToAdd] = useState(1);

  /* --- Fetch Data --- */
  const fetchData = async () => {
    try {
      const res = await crmApi.tray.getAll();
      setTrays(res.data.data || []);
    } catch (err) {
      console.error("Error loading trays:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* --- Add Trays --- */
  const handleAddTrays = async () => {
    try {
      await crmApi.tray.bulkAdd({ totalCount: numberOfTraysToAdd });
      setTrayIsAddDialogOpen(false);
      setNumberOfTraysToAdd(1);
      fetchData();
    } catch (err) {
      console.error("Failed to add trays:", err);
    }
  };

  /* --- Toggle Status --- */
  const toggleTrayStatus = async (tray: Tray) => {
    try {
      await crmApi.tray.update(tray.id, {
        ...tray,
        status: tray.status === "Free" ? "Occupied" : "Free",
      });
      fetchData();
    } catch (err) {
      console.error("Failed to update tray:", err);
    }
  };

  /* --- Filters --- */
  const filteredTrays = trays.filter((t) => {
    const matchesSearch = t.trayNumber
      .toLowerCase()
      .includes(traySearchQuery.toLowerCase());

    const matchesFilter =
      trayFilterStatus === "All" || t.status === trayFilterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Toolbar
        traySearchQuery={traySearchQuery}
        setTraySearchQuery={setTraySearchQuery}
        trayFilterStatus={trayFilterStatus}
        setTrayFilterStatus={setTrayFilterStatus}
        openAddDialog={() => setTrayIsAddDialogOpen(true)}
      />

      {/* Table */}
      <TrayTable trays={filteredTrays} toggleTrayStatus={toggleTrayStatus} />

      {/* Add Dialog */}
      <AddTrayDialog
        isOpen={trayIsAddDialogOpen}
        onOpenChange={setTrayIsAddDialogOpen}
        numberOfTraysToAdd={numberOfTraysToAdd}
        setNumberOfTraysToAdd={setNumberOfTraysToAdd}
        trays={trays}
        handleAddTrays={handleAddTrays}
      />
    </div>
  );
}
