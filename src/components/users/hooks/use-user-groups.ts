
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface UserGroup {
  id: number;
  group_name: string;
  description: string | null;
  user_types: string[];
}

export function useUserGroups() {
  return useQuery({
    queryKey: ["user-groups"],
    queryFn: async (): Promise<UserGroup[]> => {
      const { data, error } = await supabase
        .from("nd_user_group")
        .select("*")
        .order("group_name");

      if (error) {
        throw new Error(`Error fetching user groups: ${error.message}`);
      }

      return data || [];
    }
  });
}

/**
 * Helper function to determine if a group is of a specific type
 */
export function isGroupType(group: UserGroup | null, type: string): boolean {
  if (!group) return false;
  
  // Check group name
  if (group.group_name.toLowerCase().includes(type.toLowerCase())) {
    return true;
  }
  
  // Check user types
  if (group.user_types && Array.isArray(group.user_types)) {
    return group.user_types.some(
      userType => userType.toLowerCase().includes(type.toLowerCase())
    );
  }
  
  return false;
}

/**
 * Helper function to get the group by ID
 */
export function getGroupById(groups: UserGroup[], id: string | number): UserGroup | null {
  const groupId = typeof id === 'string' ? parseInt(id) : id;
  return groups.find(group => group.id === groupId) || null;
}

/**
 * Check if a user group is related to MCMC
 */
export function isMcmcGroup(group: UserGroup | null): boolean {
  return isGroupType(group, 'mcmc');
}

/**
 * Check if a user group is related to Technology Partners
 */
export function isTpGroup(group: UserGroup | null): boolean {
  return isGroupType(group, 'tp') || isGroupType(group, 'tech partner');
}
