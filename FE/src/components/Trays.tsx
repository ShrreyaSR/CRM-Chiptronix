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
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { TrayDto as Tray } from "../dtos";
import crmApi from "../api/crmApi";

export function Trays() {
  const [trays, setTrays] = useState<Tray[]>([]);
  const [traySearchQuery, setTraySearchQuery] = useState("");
  const [trayFilterStatus, setTrayFilterStatus] = useState<
    "All" | "Free" | "Occupied"
  >("All");
  const [trayIsAddDialogOpen, setTrayIsAddDialogOpen] = useState(false);
  const [numberOfTraysToAdd, setNumberOfTraysToAdd] = useState<number>(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let trayRes;
    try {
      trayRes = await crmApi.tray.getAll();
      setTrays(trayRes.data.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      console.log(trayRes);
    }
  };

  const handleAddTrays = async () => {

    try{
      await crmApi.tray.bulkAdd({
        "totalCount": numberOfTraysToAdd
      })
      setTrayIsAddDialogOpen(false);
      setNumberOfTraysToAdd(1);
      console.log("Tray addition successfull");
      fetchData();
    }
    catch (err){
      console.log("Failed to add trays: ", err)
    }
  };

  const toggleTrayStatus = async (tray: Tray) => {

    try{
      await crmApi.tray.update(tray.id, {
        ...tray, status: tray.status === "Free" ? "Occupied" : "Free"
      })
      console.log("Tray updation successfull");
      fetchData();
    }
    catch (err){
      console.log("Failed to update tray: ", err)
    }
  };



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
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search by tray number"
            value={traySearchQuery}
            onChange={(e) => setTraySearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white/50 border-gray-200/50 rounded-xl focus:border-blue-400 focus:ring-blue-400/20"
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

        <Button
          onClick={() => setTrayIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-blue-700 hover:to-blue-800 text-white h-11 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Tray
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-50 hover:to-orange-50">
                <TableHead className="text-gray-900">ID</TableHead>
                <TableHead className="text-gray-900">Tray Number</TableHead>
                <TableHead className="text-gray-900 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrays.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-12 text-gray-500"
                  >
                    No trays found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTrays.map((tray) => (
                  <TableRow
                    key={tray.id}
                    className="hover:bg-amber-50/50 transition-colors"
                  >
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200"
                      >
                        #{tray.id}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900">
                        T-0{tray.trayNumber}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        className={
                          tray.status === "Free"
                            ? "bg-green-25 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                        variant="outline"
                      >
                        {tray.status}
                        <Button
                          variant="none"
                          size="icon"
                          className="h-6 w-6 rounded-lg"
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

      <Dialog open={trayIsAddDialogOpen} onOpenChange={setTrayIsAddDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add Multiple Trays</DialogTitle>
            <DialogDescription>
              Specify how many trays you want to add. They will be created with
              sequential numbers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Number of Trays to Add</Label>
              <Input
                type="number"
                min="1"
                max="100"
                placeholder="e.g., 10"
                value={numberOfTraysToAdd}
                onChange={(e) =>
                  setNumberOfTraysToAdd(parseInt(e.target.value) || 1)
                }
              />
              <p className="text-sm text-gray-500">
                {trays.length > 0
                  ? `New trays will start from T-${String(
                      Math.max(
                        ...trays.map(
                          (t) => parseInt(t.trayNumber.replace(/\D/g, "")) || 0
                        )
                      ) + 1
                    ).padStart(3, "0")}`
                  : "New trays will start from T-001"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setTrayIsAddDialogOpen(false);
                setNumberOfTraysToAdd(1);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTrays}
              className="bg-gradient-to-r from-blue-600 to-indigo-700"
            >
              Add {numberOfTraysToAdd} Tray{numberOfTraysToAdd > 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
    </div>

  );
}
