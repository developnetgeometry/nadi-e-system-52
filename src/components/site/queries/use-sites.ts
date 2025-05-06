
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchSites, 
  toggleSiteActiveStatus, 
  deleteSite, 
  Site 
} from "../hook/site-utils";

// Hook for fetching all sites
export const useSites = (searchTerm?: string) => {
  return useQuery({
    queryKey: ['sites', searchTerm],
    queryFn: async () => {
      const sites = await fetchSites();
      if (searchTerm) {
        return sites.filter(site => 
          site.sitename.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (site.nd_site && site.nd_site[0]?.standard_code?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      return sites;
    }
  });
};

// Hook for toggling site active status
export const useToggleSiteActiveStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ siteId, active }: { siteId: string; active: boolean }) => 
      toggleSiteActiveStatus(siteId, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    }
  });
};

// Hook for deleting a site
export const useDeleteSite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (siteId: string) => deleteSite(siteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
    }
  });
};
