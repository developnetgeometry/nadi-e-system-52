
import { Button } from "@/components/ui/button";
import { Download, UserPlus } from "lucide-react";
import { exportStaffToCSV } from "@/utils/export-utils";

interface StaffToolbarProps {
  selectedStaff: any[];
  allStaff: any[];
  onAddStaff: () => void;
  organizationName?: string | null;
}

export const StaffToolbar = ({
  selectedStaff,
  allStaff,
  onAddStaff,
  organizationName,
}: StaffToolbarProps) => {
  const handleExport = () => {
    const staffToExport = selectedStaff.length > 0 
      ? selectedStaff 
      : allStaff;
    
    const filename = `${organizationName || 'staff'}-data`;
    exportStaffToCSV(staffToExport, filename);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-xl font-bold">Staff Management</h1>
        {organizationName && (
          <p className="text-sm text-muted-foreground mt-1">
            {organizationName}
          </p>
        )}
      </div>
      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button className="flex items-center gap-2" onClick={onAddStaff}>
          <UserPlus className="h-4 w-4" />
          Add New Staff
        </Button>
      </div>
    </div>
  );
};
