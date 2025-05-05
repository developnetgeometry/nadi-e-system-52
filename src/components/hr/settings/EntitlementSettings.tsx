
import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Plus, Save, Trash } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface ContractType {
  id: string;
  name: string;
}

interface Entitlement {
  id: string;
  site_id: string;
  contract_type_id: string;
  annual_leave_day: number;
  pro_rate_formula: string;
  contract_type: ContractType;
}

interface EntitlementSettingsProps {
  siteId: string;
}

export function EntitlementSettings({ siteId }: EntitlementSettingsProps) {
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [contractTypes, setContractTypes] = useState<ContractType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEntitlement, setNewEntitlement] = useState<Partial<Entitlement>>({
    site_id: siteId,
    annual_leave_day: 0,
    pro_rate_formula: ""
  });
  const { toast } = useToast();

  // Fetch entitlements for the selected site
  useEffect(() => {
    async function fetchEntitlements() {
      setLoading(true);
      try {
        // Fetch contract types first
        const { data: contractTypesData, error: contractTypesError } = await supabase
          .from("nd_contract_type")
          .select("id, name");
        
        if (contractTypesError) throw contractTypesError;
        setContractTypes(contractTypesData as ContractType[]);
        
        // Then fetch entitlements for the selected site
        const { data: entitlementsData, error: entitlementsError } = await supabase
          .from("nd_leave_entitlement")
          .select(`
            id, 
            site_id, 
            contract_type_id, 
            annual_leave_day, 
            pro_rate_formula,
            contract_type:nd_contract_type(id, name)
          `)
          .eq("site_id", siteId);
        
        if (entitlementsError) throw entitlementsError;
        
        // Transform the data to ensure proper typing
        const formattedEntitlements = entitlementsData.map((item: any) => ({
          id: item.id,
          site_id: item.site_id,
          contract_type_id: item.contract_type_id,
          annual_leave_day: item.annual_leave_day,
          pro_rate_formula: item.pro_rate_formula,
          contract_type: {
            id: item.contract_type?.id || "",
            name: item.contract_type?.name || ""
          }
        }));
        
        setEntitlements(formattedEntitlements);
      } catch (error) {
        console.error("Error fetching entitlements:", error);
        toast({
          title: "Error loading entitlements",
          description: "Could not load leave entitlements for this site.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    if (siteId) {
      fetchEntitlements();
    }
  }, [siteId, toast]);

  const handleAddEntitlement = async () => {
    if (!newEntitlement.contract_type_id) {
      toast({
        title: "Missing information",
        description: "Please select a contract type.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from("nd_leave_entitlement")
        .insert({
          site_id: siteId,
          contract_type_id: newEntitlement.contract_type_id,
          annual_leave_day: newEntitlement.annual_leave_day || 0,
          pro_rate_formula: newEntitlement.pro_rate_formula || ""
        })
        .select(`
          id, 
          site_id, 
          contract_type_id, 
          annual_leave_day, 
          pro_rate_formula,
          contract_type:nd_contract_type(id, name)
        `)
        .single();
      
      if (error) throw error;
      
      // Transform the returned data to match our Entitlement type
      const newRecord: Entitlement = {
        id: data.id,
        site_id: data.site_id,
        contract_type_id: data.contract_type_id,
        annual_leave_day: data.annual_leave_day,
        pro_rate_formula: data.pro_rate_formula,
        contract_type: {
          id: data.contract_type.id,
          name: data.contract_type.name
        }
      };
      
      setEntitlements([...entitlements, newRecord]);
      
      setIsAddDialogOpen(false);
      setNewEntitlement({
        site_id: siteId,
        annual_leave_day: 0,
        pro_rate_formula: ""
      });
      
      toast({
        title: "Entitlement added",
        description: "Leave entitlement has been added successfully."
      });
    } catch (error: any) {
      console.error("Error adding entitlement:", error);
      toast({
        title: "Error adding entitlement",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteEntitlement = async (id: string) => {
    try {
      const { error } = await supabase
        .from("nd_leave_entitlement")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      setEntitlements(entitlements.filter(e => e.id !== id));
      
      toast({
        title: "Entitlement deleted",
        description: "Leave entitlement has been deleted successfully."
      });
    } catch (error: any) {
      console.error("Error deleting entitlement:", error);
      toast({
        title: "Error deleting entitlement",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!siteId) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-yellow-500 mb-4" />
          <CardTitle className="mb-2">No Site Selected</CardTitle>
          <CardDescription>
            Please select a site to manage leave entitlements.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Leave Entitlement</CardTitle>
            <CardDescription>
              Configure leave entitlements for different contract types
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add Entitlement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Leave Entitlement</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="contract-type">Contract Type</Label>
                  <Select 
                    onValueChange={(value) => setNewEntitlement({
                      ...newEntitlement,
                      contract_type_id: value
                    })}
                  >
                    <SelectTrigger id="contract-type">
                      <SelectValue placeholder="Select a contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="annual-leave">Annual Leave Days</Label>
                  <Input
                    id="annual-leave"
                    type="number"
                    value={newEntitlement.annual_leave_day || 0}
                    onChange={(e) => setNewEntitlement({
                      ...newEntitlement,
                      annual_leave_day: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="pro-rate-formula">Pro-rate Formula</Label>
                  <Input
                    id="pro-rate-formula"
                    value={newEntitlement.pro_rate_formula || ""}
                    onChange={(e) => setNewEntitlement({
                      ...newEntitlement,
                      pro_rate_formula: e.target.value
                    })}
                    placeholder="e.g., (days_worked / 365) * annual_leave"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEntitlement}>
                  <Save className="h-4 w-4 mr-2" /> Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-6 text-center">
              <p className="text-muted-foreground">Loading entitlements...</p>
            </div>
          ) : entitlements.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract Type</TableHead>
                  <TableHead>Annual Leave Days</TableHead>
                  <TableHead>Pro-rate Formula</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entitlements.map((entitlement) => (
                  <TableRow key={entitlement.id}>
                    <TableCell>{entitlement.contract_type.name}</TableCell>
                    <TableCell>{entitlement.annual_leave_day}</TableCell>
                    <TableCell>{entitlement.pro_rate_formula || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEntitlement(entitlement.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-6 text-center">
              <p className="text-muted-foreground">No entitlements configured for this site.</p>
              <p className="text-muted-foreground">Click "Add Entitlement" to create one.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
