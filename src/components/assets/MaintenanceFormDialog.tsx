import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MaintenanceRecord {
  id?: string;
  asset_id: string;
  maintenance_date: string;
  description: string;
  performed_by: string;
  cost: number;
  next_maintenance_date?: string;
}

interface MaintenanceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetId: string;
  record?: MaintenanceRecord;
  onSave: () => void;
}

export function MaintenanceFormDialog({ 
  open, 
  onOpenChange, 
  assetId, 
  record, 
  onSave 
}: MaintenanceFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const maintenanceData = {
        asset_id: assetId,
        maintenance_date: formData.get("maintenance_date") as string,
        description: formData.get("description") as string,
        performed_by: formData.get("performed_by") as string,
        cost: parseFloat(formData.get("cost") as string),
        next_maintenance_date: formData.get("next_maintenance_date") as string || null,
      };

      if (record?.id) {
        const { error } = await supabase
          .from("nd_maintenance_record")
          .update(maintenanceData)
          .eq("id", record.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("nd_maintenance_record")
          .insert([maintenanceData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Maintenance record ${record ? "updated" : "created"} successfully`,
      });

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving maintenance record:", error);
      toast({
        title: "Error",
        description: "Failed to save maintenance record",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {record ? "Edit Maintenance Record" : "Add Maintenance Record"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="maintenance_date">Maintenance Date</Label>
            <Input
              id="maintenance_date"
              name="maintenance_date"
              type="date"
              defaultValue={record?.maintenance_date}
              required
            />
          </div>

          <div>
            <Label htmlFor="performed_by">Performed By</Label>
            <Input
              id="performed_by"
              name="performed_by"
              defaultValue={record?.performed_by}
              required
            />
          </div>

          <div>
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              name="cost"
              type="number"
              step="0.01"
              defaultValue={record?.cost}
              required
            />
          </div>

          <div>
            <Label htmlFor="next_maintenance_date">Next Maintenance Date</Label>
            <Input
              id="next_maintenance_date"
              name="next_maintenance_date"
              type="date"
              defaultValue={record?.next_maintenance_date}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={record?.description}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
