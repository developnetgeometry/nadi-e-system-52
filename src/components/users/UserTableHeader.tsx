
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortDirection, SortField } from "@/hooks/use-user-management";

interface UserTableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  showRowNumbers: boolean;
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortDirection: SortDirection;
}

export const UserTableHeader = ({
  onSelectAll,
  allSelected,
  showRowNumbers,
  onSort,
  sortField,
  sortDirection,
}: UserTableHeaderProps) => {
  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    if (sortDirection === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => onSelectAll(!!checked)}
            title="Select all users"
          />
        </TableHead>
        <TableHead className="w-[60px] text-center">No.</TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="p-0 font-semibold hover:bg-transparent flex items-center"
            onClick={() => onSort("name")}
          >
            Name {renderSortIcon("name")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="p-0 font-semibold hover:bg-transparent flex items-center"
            onClick={() => onSort("email")}
          >
            Email {renderSortIcon("email")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="p-0 font-semibold hover:bg-transparent flex items-center"
            onClick={() => onSort("phone")}
          >
            Phone {renderSortIcon("phone")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="p-0 font-semibold hover:bg-transparent flex items-center"
            onClick={() => onSort("status")}
          >
            Status {renderSortIcon("status")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="p-0 font-semibold hover:bg-transparent flex items-center"
            onClick={() => onSort("site")}
          >
            Site {renderSortIcon("site")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="p-0 font-semibold hover:bg-transparent flex items-center"
            onClick={() => onSort("phase")}
          >
            Phase {renderSortIcon("phase")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="p-0 font-semibold hover:bg-transparent flex items-center"
            onClick={() => onSort("state")}
          >
            State {renderSortIcon("state")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="p-0 font-semibold hover:bg-transparent flex items-center"
            onClick={() => onSort("role")}
          >
            Role {renderSortIcon("role")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            className="p-0 font-semibold hover:bg-transparent flex items-center"
            onClick={() => onSort("created_at")}
          >
            Created At {renderSortIcon("created_at")}
          </Button>
        </TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
