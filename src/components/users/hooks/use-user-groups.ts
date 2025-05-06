
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface UserGroup {
  id: string;
  group_name: string;
  description?: string;
  user_types?: string[];
}

export const useUserGroups = () => {
  return useQuery({
    queryKey: ["user-groups"],
    queryFn: async () => {
      // We only want to show MCMC, TP, DUSP, SSO, Vendor groups
      const { data, error } = await supabase
        .from("nd_user_group")
        .select("*")
        .or('group_name.ilike.%mcmc%,group_name.ilike.%tp%,group_name.ilike.%dusp%,group_name.ilike.%sso%,group_name.ilike.%vendor%')
        .order("group_name", { ascending: true });
        
      if (error) throw error;
      return data as UserGroup[];
    },
  });
};

export const getGroupById = (groups: UserGroup[], id: string): UserGroup | undefined => {
  if (!groups || !id) return undefined;
  return groups.find(group => group.id.toString() === id.toString());
};

export const isMcmcGroup = (group?: UserGroup): boolean => {
  if (!group) return false;
  return group.group_name.toLowerCase().includes('mcmc');
};

export const isTpGroup = (group?: UserGroup): boolean => {
  if (!group) return false;
  return group.group_name.toLowerCase().includes('tp') || 
         group.group_name.toLowerCase().includes('tech partner');
};

export const isDuspGroup = (group?: UserGroup): boolean => {
  if (!group) return false;
  return group.group_name.toLowerCase().includes('dusp');
};

export const isSsoGroup = (group?: UserGroup): boolean => {
  if (!group) return false;
  return group.group_name.toLowerCase().includes('sso');
};

export const isVendorGroup = (group?: UserGroup): boolean => {
  if (!group) return false;
  return group.group_name.toLowerCase().includes('vendor');
};
