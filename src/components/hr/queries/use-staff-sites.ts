
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  site_id: string;
  position: string;
  department: string;
  status: string;
}

interface Site {
  id: string;
  sitename: string;
}

export const useStaffSites = () => {
  const { user } = useAuth();
  const [selectedSite, setSelectedSite] = useState<string | null>(null);

  const { data: sites, isLoading: sitesLoading } = useQuery({
    queryKey: ["staff-sites"],
    queryFn: async () => {
      // Mock implementation
      const mockSites: Site[] = [
        { id: "1", sitename: "Site A" },
        { id: "2", sitename: "Site B" },
        { id: "3", sitename: "Site C" }
      ];
      return mockSites;
    },
    enabled: !!user
  });

  const { data: staff, isLoading: staffLoading } = useQuery({
    queryKey: ["site-staff", selectedSite],
    queryFn: async () => {
      if (!selectedSite) return [];
      
      // Mock implementation
      const mockStaff: Staff[] = [
        { 
          id: "1", 
          name: "John Doe", 
          email: "john@example.com", 
          phone: "1234567890", 
          site_id: "1", 
          position: "Manager", 
          department: "Administration", 
          status: "Active" 
        },
        { 
          id: "2", 
          name: "Jane Smith", 
          email: "jane@example.com", 
          phone: "0987654321", 
          site_id: "1", 
          position: "Supervisor", 
          department: "Operations", 
          status: "Active" 
        }
      ];
      
      return mockStaff.filter(s => s.site_id === selectedSite);
    },
    enabled: !!selectedSite
  });

  const formatSitesForSelect = () => {
    if (!sites) return [];
    return sites.map(site => ({
      value: site.id,
      label: site.sitename
    }));
  };

  return {
    sites,
    staff,
    selectedSite,
    setSelectedSite,
    sitesLoading,
    staffLoading,
    formatSitesForSelect
  };
};
