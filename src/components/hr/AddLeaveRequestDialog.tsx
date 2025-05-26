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

interface AddLeaveRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staffId: string;
  onSuccess: () => void;
}

export function AddLeaveRequestDialog({ 
  open, 
  onOpenChange, 
  staffId, 
  onSuccess 
}: AddLeaveRequestDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const leaveData = {
        staff_id: parseInt(staffId),
        start_date: formData.get("start_date") as string,
        end_date: formData.get("end_date") as string,
        leave_type: parseInt(formData.get("leave_type") as string),
        remark: formData.get("remark") as string,
        half_day: formData.get("half_day") === "on",
        leave_status: 1, // pending
      };

      const { error } = await supabase
        .from("nd_leave_request")
        .insert([leaveData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting leave request:", error);
      toast({
        title: "Error",
        description: "Failed to submit leave request",
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
          <DialogTitle>Add Leave Request</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="leave_type">Leave Type</Label>
            <Input
              id="leave_type"
              name="leave_type"
              type="number"
              defaultValue="1"
              required
            />
          </div>

          <div>
            <Label htmlFor="remark">Remarks</Label>
            <Textarea
              id="remark"
              name="remark"
              placeholder="Enter leave reason..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="half_day"
              name="half_day"
              className="rounded"
            />
            <Label htmlFor="half_day">Half Day</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
