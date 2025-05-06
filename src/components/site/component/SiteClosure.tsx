
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface SiteClosureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId: string;
  onSuccess: () => Promise<any>;
  editData?: any;
  clearEditData?: () => void;
}

export const SiteClosure: React.FC<SiteClosureProps> = ({
  open,
  onOpenChange,
  siteId,
  onSuccess,
  editData,
  clearEditData
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Site Closure" : "Add Site Closure"}
          </DialogTitle>
        </DialogHeader>
        <div>
          {/* Site closure form will go here */}
          <p>Form for site ID: {siteId}</p>
          {editData && <p>Editing existing data</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// No default export here, we're using named exports
