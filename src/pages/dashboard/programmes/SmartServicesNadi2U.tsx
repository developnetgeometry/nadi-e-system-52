
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error/ErrorFallback";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/date-utils";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SmartServicesNadi2U = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch event statuses for filter
        const { data: statusData, error: statusError } = await supabase
          .from('nd_event_status')
          .select('id, name');
          
        if (statusError) throw statusError;
        setStatuses(statusData);
        
        // Fetch programs where category_id is 2 (NADI 2U Programs)
        const { data: programData, error: programError } = await supabase
          .from('nd_event')
          .select(`
            id,
            program_name,
            location_event,
            start_datetime,
            end_datetime,
            created_by,
            nd_event_status:status_id(id, name)
          `)
          .eq('category_id', 2);
          
        if (programError) throw programError;
        
        // Format data
        const formattedData = await Promise.all(programData.map(async (program) => {
          // Get creator's name if possible
          let creatorName = "Unknown";
          if (program.created_by) {
            const { data: userData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', program.created_by)
              .single();
              
            creatorName = userData?.full_name || "Unknown";
          }
          
          return {
            id: program.id,
            title: program.program_name || "Untitled Program",
            location: program.location_event || "No Location",
            date: program.start_datetime || new Date().toISOString(),
            createdBy: creatorName,
            status: program.nd_event_status?.name?.toLowerCase() || "draft",
            statusId: program.nd_event_status?.id
          };
        }));
        
        setProgrammes(formattedData);
      } catch (error) {
        console.error("Error fetching program data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Function to get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "registered":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            Registered
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Draft
          </Badge>
        );
    }
  };

  // Filter programmes based on search query and status
  const filteredProgrammes = programmes.filter((programme) => {
    const matchesSearch =
      programme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      programme.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || 
      String(programme.statusId) === statusFilter ||
      programme.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading programs...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">
            Smart Services NADI2U Programs
          </h1>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <Input
                  placeholder="Search programs..."
                  className="max-w-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status.id} value={String(status.id)}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Program Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProgrammes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No programmes found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProgrammes.map((programme) => (
                        <TableRow key={programme.id}>
                          <TableCell className="font-medium">
                            {programme.title}
                          </TableCell>
                          <TableCell>{programme.location}</TableCell>
                          <TableCell>{formatDate(programme.date)}</TableCell>
                          <TableCell>{programme.createdBy}</TableCell>
                          <TableCell>
                            {getStatusBadge(programme.status)}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default SmartServicesNadi2U;
