
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface Site {
  id: string;
  sitename: string;
  address?: string;
  status?: string;
  manager?: string;
}

export default function Site() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSites() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("nd_site_profile")
          .select("id, sitename, address")
          .order("sitename");

        if (error) throw error;
        
        setSites(data || []);
      } catch (error) {
        console.error("Error fetching sites:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSites();
  }, []);

  const filteredSites = sites.filter(site => 
    site.sitename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (site.address && site.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <PageHeader 
            title="Site Management"
            description="View and manage all your organization's sites"
          />
          
          <Button onClick={() => alert("Add site functionality would go here")}>
            <Plus className="mr-2 h-4 w-4" /> Add New Site
          </Button>
        </div>

        <div className="flex items-center space-x-2 my-6">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search sites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">Loading sites...</div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.length > 0 ? (
                  filteredSites.map((site) => (
                    <TableRow key={site.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          {site.sitename}
                        </div>
                      </TableCell>
                      <TableCell>{site.address || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={site.status === "Inactive" ? "destructive" : "default"}>
                          {site.status || "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>{site.manager || "—"}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          onClick={() => navigate(`/dashboard/site/${site.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No sites found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
