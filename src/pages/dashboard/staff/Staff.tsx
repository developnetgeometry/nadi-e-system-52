
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

export default function Staff() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  // Placeholder data - would be replaced with actual API call
  const staffData = [
    { id: 1, name: "John Doe", position: "Manager", department: "HR", site: "Main Office" },
    { id: 2, name: "Jane Smith", position: "Team Lead", department: "Finance", site: "Branch A" },
    { id: 3, name: "Mike Johnson", position: "Developer", department: "IT", site: "Branch B" },
  ];
  
  const filteredStaff = staffData.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.site.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <PageHeader
            title="Staff Management"
            description="View and manage staff members"
          />
          <Button onClick={() => alert("Add staff functionality would go here")}>
            Add Staff
          </Button>
        </div>
        
        <div className="my-6">
          <Input
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>{staff.position}</TableCell>
                  <TableCell>{staff.department}</TableCell>
                  <TableCell>{staff.site}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate(`/dashboard/staff/${staff.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStaff.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No staff members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
