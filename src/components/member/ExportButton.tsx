
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { exportToCSV } from "@/utils/export-utils";

interface ExportButtonProps {
  data: any[];
  filename?: string;
  title?: string; // Added for backward compatibility
}

const ExportButton = ({ data, filename = "members-data", title }: ExportButtonProps) => {
  // Use title for filename if provided (for backward compatibility)
  const actualFilename = title || filename;
  
  const handleCSVExport = () => {
    // Format the data for CSV export
    const formattedData = data.map(member => ({
      'Full Name': member.fullname || '',
      'Email': member.email || '',
      'Phone Number': member.phone_number || '',
      'Registration Date': member.created_at ? new Date(member.created_at).toLocaleDateString() : '',
      'Status': member.status || ''
    }));
    
    exportToCSV(formattedData, actualFilename);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-2 items-center">
          <Download size={16} />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleCSVExport} className="flex gap-2 items-center">
          <FileSpreadsheet size={16} />
          <span>Export to CSV</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
