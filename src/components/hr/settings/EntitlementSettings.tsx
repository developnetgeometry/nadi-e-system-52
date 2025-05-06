
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface EntitlementSettingsProps {
  siteId: string | null;
}

interface EntitlementType {
  id: string;
  name: string;
}

interface LeaveEntitlement {
  id?: string;
  site_id: string;
  entitlement_type_id: string;
  days_per_year: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export function EntitlementSettings({ siteId }: EntitlementSettingsProps) {
  const [entitlements, setEntitlements] = useState<LeaveEntitlement[]>([]);
  const [entitlementTypes, setEntitlementTypes] = useState<EntitlementType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>("");
  const [daysPerYear, setDaysPerYear] = useState<number>(0);
  const { toast } = useToast();
  
  useEffect(() => {
    // Fetch entitlement types first (like Annual Leave, Sick Leave, etc.)
    const fetchEntitlementTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('nd_leave_entitlement_types')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        
        setEntitlementTypes(data as EntitlementType[]);
      } catch (error) {
        console.error('Error fetching entitlement types:', error);
        toast({
          title: "Error",
          description: "Failed to load entitlement types",
          variant: "destructive"
        });
      }
    };
    
    fetchEntitlementTypes();
  }, [toast]);
  
  useEffect(() => {
    if (!siteId) {
      setIsLoading(false);
      return;
    }
    
    const fetchEntitlements = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('nd_leave_entitlement')
          .select('*')
          .eq('site_id', siteId);
        
        if (error) throw error;
        
        setEntitlements(data as LeaveEntitlement[]);
      } catch (error) {
        console.error('Error fetching entitlements:', error);
        toast({
          title: "Error",
          description: "Failed to load entitlements for this site",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntitlements();
  }, [siteId, toast]);
  
  const handleAddEntitlement = async () => {
    if (!siteId) {
      toast({
        title: "Error",
        description: "Please select a site first",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedType) {
      toast({
        title: "Error",
        description: "Please select an entitlement type",
        variant: "destructive"
      });
      return;
    }
    
    if (daysPerYear <= 0) {
      toast({
        title: "Error",
        description: "Days per year must be greater than 0",
        variant: "destructive"
      });
      return;
    }
    
    // Check if entitlement for this type already exists
    const exists = entitlements.find(e => e.entitlement_type_id === selectedType);
    if (exists) {
      toast({
        title: "Error",
        description: "Entitlement for this type already exists. Please update it instead.",
        variant: "destructive"
      });
      return;
    }
    
    const newEntitlement: LeaveEntitlement = {
      site_id: siteId,
      entitlement_type_id: selectedType,
      days_per_year: daysPerYear,
      is_active: true
    };
    
    try {
      const { data, error } = await supabase
        .from('nd_leave_entitlement')
        .insert(newEntitlement)
        .select();
      
      if (error) throw error;
      
      setEntitlements([...entitlements, data[0] as LeaveEntitlement]);
      
      toast({
        title: "Success",
        description: "Entitlement added successfully",
      });
      
      // Reset form
      setSelectedType("");
      setDaysPerYear(0);
    } catch (error) {
      console.error('Error adding entitlement:', error);
      toast({
        title: "Error",
        description: "Failed to add entitlement",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateEntitlement = async (id: string, days: number) => {
    if (!siteId) return;
    
    try {
      const { error } = await supabase
        .from('nd_leave_entitlement')
        .update({ days_per_year: days })
        .eq('id', id);
      
      if (error) throw error;
      
      setEntitlements(entitlements.map(ent => 
        ent.id === id ? { ...ent, days_per_year: days } : ent
      ));
      
      toast({
        title: "Success",
        description: "Entitlement updated successfully",
      });
    } catch (error) {
      console.error('Error updating entitlement:', error);
      toast({
        title: "Error",
        description: "Failed to update entitlement",
        variant: "destructive"
      });
    }
  };
  
  const getEntitlementTypeName = (typeId: string) => {
    const type = entitlementTypes.find(t => t.id === typeId);
    return type ? type.name : "Unknown";
  };
  
  if (!siteId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leave Entitlements</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          Please select a site to manage leave entitlements
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Entitlements</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading entitlements...</div>
        ) : (
          <>
            <div className="grid gap-6 mb-8">
              <div className="space-y-2">
                <h3 className="font-medium">Add New Entitlement</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="entitlement-type">Entitlement Type</Label>
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {entitlementTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="days-per-year">Days per Year</Label>
                    <Input
                      id="days-per-year"
                      type="number"
                      min="0"
                      value={daysPerYear}
                      onChange={(e) => setDaysPerYear(parseInt(e.target.value, 10))}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddEntitlement} className="w-full">
                      Add Entitlement
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Current Entitlements</h3>
                {entitlements.length === 0 ? (
                  <div className="text-center py-4 border rounded-md">
                    No entitlements have been set for this site
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entitlements.map((entitlement) => (
                      <div key={entitlement.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div>
                          <h4 className="font-medium">{getEntitlementTypeName(entitlement.entitlement_type_id)}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            className="w-24"
                            value={entitlement.days_per_year}
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value, 10);
                              const updatedEntitlements = entitlements.map(ent => 
                                ent.id === entitlement.id ? { ...ent, days_per_year: newValue } : ent
                              );
                              setEntitlements(updatedEntitlements);
                            }}
                          />
                          <span className="text-sm">days</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => entitlement.id && handleUpdateEntitlement(entitlement.id, entitlement.days_per_year)}
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
