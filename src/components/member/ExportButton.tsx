
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
}

export function ExportButton({ data, filename = "members-data" }: ExportButtonProps) {
  const handleCSVExport = () => {
    // Format the data for CSV export
    const formattedData = data.map(member => ({
      'Full Name': member.fullname || '',
      'Email': member.email || '',
      'Phone Number': member.phone_number || '',
      'Registration Date': member.created_at ? new Date(member.created_at).toLocaleDateString() : '',
      'Status': member.status || ''
    }));
    
    exportToCSV(formattedData, filename);
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
}
