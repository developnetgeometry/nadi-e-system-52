import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface StaffSite {
  id: string;
  sitename: string;
}

export function useStaffSites() {
  const { user } = useAuth();
  const [sites, setSites] = useState<StaffSite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStaffSites = async () => {
      if (!user) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // First check if the user is a super admin
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role_id')
          .eq('user_id', user.id)
          .single();
        
        if (roleError && roleError.code !== 'PGRST116') {
          throw roleError;
        }
        
        // If user is a super admin, get all sites
        if (roleData?.role_id === 'super_admin') {
          const { data, error } = await supabase
            .from('nd_site_profile')
            .select('id, sitename')
            .order('sitename');
          
          if (error) throw error;
          
          setSites(data as StaffSite[]);
          return;
        }
        
        // Otherwise, get only the sites the staff is assigned to
        const { data, error } = await supabase
          .from('staff_site_assignment')
          .select(`
            site:site_id (
              id, 
              sitename
            )
          `)
          .eq('staff_id', user.id);
        
        if (error) throw error;
        
        // Extract and flatten the site data
        const staffSites = data.map(item => ({
          id: item.site.id,
          sitename: item.site.sitename
        }));
        
        setSites(staffSites);
      } catch (err) {
        console.error('Error fetching staff sites:', err);
        setError(err as Error);
        toast({
          title: "Error",
          description: "Failed to load sites",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStaffSites();
  }, [user, toast]);
  
  return { sites, isLoading, error };
}
